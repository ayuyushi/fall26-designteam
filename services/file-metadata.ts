'use server'

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { executeSupabaseQuery } from '@/utils/supabase/query';
import type File from '@/types/file';

export async function uploadFileMetadata(fileMetadata: File | File[]) {
    const supabase = await createClient();

    const result = await executeSupabaseQuery(
      supabase
        .from("file")
        .insert(fileMetadata)
        .select('note_id, file_id, name, type, size'),
      'save file metadata',
      'Could not save file details.'
    );

    if (!result.error) {
      revalidatePath('/notes');
      revalidatePath('/library');
    }

    return result;
}

export async function getNoteFileMetadata(noteId: string) {
  const supabase = await createClient();

  const result = await executeSupabaseQuery(
    supabase
      .from('file')
      .select('note_id, file_id, name, type, size')
      .eq('note_id', noteId),
    'load file metadata',
    'Could not load file details.'
  );

  if (result.error || !result.data) {
    return { data: result.data, error: result.error ?? 'Files not found.' };
  }

  return result;
}

export async function getFileMetadata(noteId: string, fileId: string) {
  const supabase = await createClient();

  const result = await executeSupabaseQuery(
    supabase
      .from('file')
      .select('note_id, file_id, name, type, size')
      .eq('note_id', noteId)
      .eq("file_id", fileId)
      .maybeSingle(),
    'load file metadata',
    'Could not load file details.'
  );

  if (result.error || !result.data) {
    return { data: result.data, error: result.error ?? 'File not found.' };
  }

  return result;
}

export async function getFilesMetadata(noteId: string, fileId: string[]) {
  const supabase = await createClient();

  const result = await executeSupabaseQuery(
    supabase
      .from('file')
      .select('note_id, file_id, name, type, size')
      .eq('note_id', noteId)
      .in("file_id", fileId),
    'load file metadata',
    'Could not load file details. Please try again.'
  );

  if (result.error || !result.data) {
    return { data: result.data, error: result.error ?? 'File not found.' };
  }

  return result;
}

export async function deleteFileMetadata(noteId: string, fileId: string) {
  const supabase = await createClient();

  const result = await executeSupabaseQuery(
    supabase
      .from('file')
      .delete()
      .eq("note_id", noteId)
      .eq("file_id", fileId)
      .select('note_id, file_id, name, type, size')
      .maybeSingle(),
    'delete file metadata',
    'Could not delete the file details. Please try again.'
  );

  if (result.error || !result.data) {
    return { data: result.data, error: result.error ?? 'File not found.' };
  }

  return result;
}