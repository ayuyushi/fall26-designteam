"use server";

import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import { r2Client } from "@/utils/cloudflare/r2";
import { createClient } from "@/utils/supabase/server";

const MAX_TOTAL_SIZE_MEGABYTES = 5;
const MAX_FILE_SIZE_BYTES = MAX_TOTAL_SIZE_MEGABYTES * 1024 * 1024;
const MAX_FILES = 5;
const SIGNED_URL_TTL_SECONDS = 60;

const ALLOWED_TYPES: Record<string, string> = {
  "application/msword": "doc",
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "image/jpeg": "jpg",
  "image/png": "png",
};

class RequestValidationError extends Error {}

function getBucketName() {
  const bucketName = process.env.R2_BUCKET_NAME;
  if (!bucketName)
    throw new Error("R2_BUCKET_NAME is not configured.");

  return bucketName;
}

function formToFiles(formData: FormData) {
  const entries = formData.getAll("file_upload");
  if (entries.length === 0 || entries.length > MAX_FILES) {
    throw new RequestValidationError(`Choose between 1 and ${MAX_FILES} files.`);
  }

  const files: File[] = [];
  for (const entry of entries) {
    if (!(entry instanceof File) || !entry.name || entry.size === 0) {
      throw new RequestValidationError("The request contains an invalid file.");
    }

    if (entry.size > MAX_FILE_SIZE_BYTES) {
      throw new RequestValidationError("Each file must be 5 MB or smaller.");
    }

    if (!ALLOWED_TYPES[entry.type]) {
      throw new RequestValidationError(
        "Supported files are PDF, DOC, DOCX, JPG, and PNG."
      );
    }

    files.push(entry);
  }

  return files;
}

async function requireAuthenticatedUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error)
    throw error;
  
  if (!data.user)
    throw new RequestValidationError("Sign in before managing files.");

  return supabase;
}

async function removeUploadedObjects(bucketName: string, objectKeys: string[]) {
  const failures: string[] = [];
  for (const key of objectKeys) {
    try {
      await r2Client.send(
        new DeleteObjectCommand({ Bucket: bucketName, Key: key })
      );
    } catch (error) {
      console.error("Failed to roll back an R2 upload:", { key, error });
      failures.push(key);
    }
  }
  return failures;
}

export async function uploadFiles(formData: FormData, noteId: string) {
  let files: File[];

  try {
    files = formToFiles(formData);
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof RequestValidationError
          ? error.message
          : "The upload request is invalid.",
    };
  }

  let supabase: Awaited<ReturnType<typeof createClient>>;
  try {
    supabase = await requireAuthenticatedUser();
  } catch (error) {
    console.error("Could not authenticate file upload:", error);
    return {
      success: false,
      error:
        error instanceof RequestValidationError
          ? error.message
          : "Could not verify your sign-in. Please try again.",
    };
  }

  const bucketName = getBucketName();
  const objectKeys: string[] = [];
  const metadata = [];

  try {
    for (const file of files) {
      const key = `userUpload/${randomUUID()}`;
      objectKeys.push(key);

      await r2Client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: key,
          Body: Buffer.from(await file.arrayBuffer()),
          ContentType: file.type,
          ContentDisposition: "attachment",
        })
      );

      metadata.push({
        note_id: noteId,
        file_id: key,
        name: file.name,
        size: file.size,
        type: file.type,
      });
    }

    const { error } = await supabase.from("file").insert(metadata);
    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error("File upload failed:", error);

    let metadataCleanupFailed = false;
    if (objectKeys.length > 0) {
      try {
        const { data: existingRows, error: lookupError } = await supabase
          .from("file")
          .select("file_id")
          .eq("note_id", noteId)
          .in("file_id", objectKeys);
        if (lookupError) {
          throw lookupError;
        }
        if (!existingRows) {
          throw new Error("File metadata rollback lookup returned no result.");
        }

        if (existingRows.length > 0) {
          const { data: deletedRows, error: cleanupError } = await supabase
            .from("file")
            .delete()
            .eq("note_id", noteId)
            .in("file_id", objectKeys)
            .select("file_id");
          if (cleanupError) {
            throw cleanupError;
          }
          if (!deletedRows || deletedRows.length !== existingRows.length) {
            throw new Error("File metadata rollback did not remove every row.");
          }
        }
      } catch (cleanupError) {
        metadataCleanupFailed = true;
        console.error("Failed to roll back file metadata:", cleanupError);
      }
    }

    const cleanupFailures = metadataCleanupFailed
      ? objectKeys
      : await removeUploadedObjects(bucketName, objectKeys);
    const needsReconciliation =
      metadataCleanupFailed || cleanupFailures.length > 0;

    return {
      success: false,
      error: needsReconciliation
        ? "Upload failed and cleanup was incomplete. The files need reconciliation."
        : "Upload failed. No uploaded files were retained.",
      needsReconciliation,
    };
  }
}

export async function getFile(noteId: string, fileId: string) {
  try {
    const supabase = await requireAuthenticatedUser();
    const { data, error } = await supabase
      .from("file")
      .select("file_id")
      .eq("note_id", noteId)
      .eq("file_id", fileId)
      .maybeSingle();

    if (error) {
      throw error;
    }
    if (!data) {
      return { success: false, error: "File not found." };
    }

    const url = await getSignedUrl(
      r2Client,
      new GetObjectCommand({
        Bucket: getBucketName(),
        Key: fileId,
        ResponseContentDisposition: "attachment",
        ResponseContentType: "application/octet-stream",
      }),
      { expiresIn: SIGNED_URL_TTL_SECONDS }
    );

    return { success: true, url };
  } catch (error) {
    console.error("Could not create a file download link:", error);
    return {
      success: false,
      error:
        error instanceof RequestValidationError
          ? error.message
          : "Could not retrieve the file.",
    };
  }
}

export async function deleteFile(noteId: string, fileId: string) {
  try {
    const supabase = await requireAuthenticatedUser();
    const { data: existingFile, error: readError } = await supabase
      .from("file")
      .select("file_id, name, size, type")
      .eq("note_id", noteId)
      .eq("file_id", fileId)
      .maybeSingle();

    if (readError) {
      throw readError;
    }
    if (!existingFile) {
      return { success: false, error: "File not found." };
    }

    const { data: deletedFile, error: deleteError } = await supabase
      .from("file")
      .delete()
      .eq("note_id", noteId)
      .eq("file_id", fileId)
      .select("file_id")
      .maybeSingle();

    if (deleteError) {
      throw deleteError;
    }
    if (!deletedFile) {
      return {
        success: false,
        error: "File metadata could not be removed. The stored file was kept.",
      };
    }

    try {
      await r2Client.send(
        new DeleteObjectCommand({ Bucket: getBucketName(), Key: fileId })
      );
      return { success: true };
    } catch (storageError) {
      console.error("R2 file deletion failed; restoring metadata:", storageError);

      let restoreError: unknown;
      try {
        const { error } = await supabase.from("file").insert({
          note_id: noteId,
          file_id: existingFile.file_id,
          name: existingFile.name,
          size: existingFile.size,
          type: existingFile.type,
        });
        restoreError = error;
      } catch (error) {
        restoreError = error;
      }

      if (restoreError) {
        console.error("Could not restore file metadata:", restoreError);
      }

      return {
        success: false,
        error: restoreError
          ? "Delete failed and metadata could not be restored. Reconciliation is required."
          : "Delete failed. Metadata was restored, but storage state should be checked.",
        needsReconciliation: true,
      };
    }
  } catch (error) {
    console.error("File deletion failed:", error);
    return {
      success: false,
      error:
        error instanceof RequestValidationError
          ? error.message
          : "Could not delete the file.",
    };
  }
}
