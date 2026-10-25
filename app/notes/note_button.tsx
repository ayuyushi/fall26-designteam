"use client";

import { createNote } from "./actions";
import { useState } from "react";

export default function NoteForm() {
  const [loading, setLoading] = useState(false);
  
  async function handleFormSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const response = await createNote(formData);

      if (response.success) {
        alert("New note created in supabase successfully!");
      } else {
        alert(`Upload failed: ${response.error}`);
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
    <section className="new-note-card" aria-labelledby="create-new-note">
        <h2 id="new-note-title">Create New Note</h2>
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
                <label htmlFor="unit">unit</label>
                <input id="unit" name="unit" type="text" />
            </div>
            <div className="note-field">
                <label htmlFor="description">Description</label>
                <input id="description" name="description" type="text" />
            </div>
            <button 
                type="submit" 
                disabled={loading}
            >
                {loading ? "Processing..." : "Create New Note"}
            </button>
        </form>
    </section>  
  );
}