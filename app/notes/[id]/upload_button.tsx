"use client";

import { uploadFiles } from "@/app/notes/[id]/file_upload";
import { useState } from "react";

export default function UploadFile({ noteId }: { noteId: string}) {
  const [loading, setLoading] = useState(false);
  
  async function handleFormSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const response = await uploadFiles(formData, noteId);

      if (response.success) {
        alert("Files uploaded and metadata saved to Supabase successfully!");
      } else {
        alert(`Upload failed: ${response.error}`);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred.";
      alert(`Upload failed: ${message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 max-w-sm p-4">
      <input 
        type="file" 
        id="file_upload" 
        name="file_upload" 
        accept="image/jpeg,image/png,.doc,.docx,.pdf" 
        multiple 
        required />
      <button 
        type="submit" 
        disabled={loading}
      >
        {loading ? "Processing..." : "Upload & Save"}
      </button>
    </form>
  );
}
