"use client";

import { createNote } from "@/services/note-data";
import { useState } from "react";
import type Note from '@/types/note';

export default function NoteForm() {
  const [loading, setLoading] = useState(false);
  
  async function handleFormSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);

      const input_data: Partial<Note> = {
          class_title: formData.get('class_title')! as string,
          class_code:  formData.get('class_code')! as string,
          semester:  formData.get('semester')! as string,
          professor:  formData.get('professor') as string ?? "Unknown",
          unit:  formData.get('unit') as string ?? "Unknown",
          description:  formData.get('description') as string ?? "",
          is_public: true,
      }

      const {data, error} = await createNote(input_data);

      if (error) {
        alert(`Upload failed: ${error}`);
      } else {
        alert("New note created in supabase successfully!");
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred.";
      alert(`Creation failed: ${message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="new-note-card" aria-labelledby="new-note-title">
        <div className="note-card-heading">
          <p className="site-eyebrow">Start sharing</p>
          <h2 id="new-note-title">Create a note</h2>
        </div>
        <form onSubmit={handleFormSubmit}>
            <div className="note-field">
                <label htmlFor="class_title">Class Title</label>
                <input id="class_title" name="class_title" type="text" autoComplete="class_title" required />
            </div>
            <div className="note-field">
                <label htmlFor="class_code">Class Code</label>
                <input id="class_code" name="class_code" type="text" autoComplete="class_code" required />
            </div>
            <div className="note-field">
                <label htmlFor="semester">Semester</label>
                <input id="semester" name="semester" type="text" autoComplete="semester" required />
            </div>
            <div className="note-field">
                <label htmlFor="professor">Professor Name</label>
                <input id="professor" name="professor" type="text" autoComplete="professor" />
            </div>
            <div className="note-field">
                <label htmlFor="unit">Unit</label>
                <input id="unit" name="unit" type="text" />
            </div>
            <div className="note-field">
                <label htmlFor="description">Description</label>
                <input id="description" name="description" type="text" />
            </div>
            <button 
                className="notes-primary-button"
                type="submit" 
                disabled={loading}
            >
                {loading ? "Creating..." : "Create note"}
            </button>
        </form>
    </section>  
  );
}