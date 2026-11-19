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

      const input_data: Omit<Note, 'id'> = {
          class_title: formData.get('class_title')! as string,
          class_code:  formData.get('class_code')! as string,
          semester_term:  formData.get('semester_term')! as string,
          semester_year:  formData.get('semester_year')! as string,
          professor:  formData.get('professor') as string,
          unit:  formData.get('unit') as string,
          description:  formData.get('description') as string,
          is_public: true,
      }

      const { error } = await createNote(input_data);

      if (error) {
        alert(`Creation failed: ${error}`);
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
                <label htmlFor="class_title">Class Title*</label>
                <input id="class_title" name="class_title" type="text" autoComplete="class_title" required />
            </div>
            <div className="note-field">
                <label htmlFor="class_code">Class Code*</label>
                <input id="class_code" name="class_code" type="text" autoComplete="class_code" required />
            </div>
            <div className="note-field">
                <label htmlFor="semester">Semester*</label>
                <select id="semester_term" name="semester_term" autoComplete="semester_term" required>
                  <option value="" disabled> Choose a term </option>
                  <option value="Fall">Fall</option>
                  <option value="Spring">Spring</option>
                  <option value="Summer A">Summer A</option>
                  <option value="Summer B">Summer B</option>
                  <option value="Summer C">Summer C</option>
                </select>
                <input id="semester_year" name="semester_year" type="number" min={2000} max={2027} autoComplete="semester_year" required />
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