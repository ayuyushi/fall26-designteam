'use client';

import { useState } from 'react';
import { deleteNote } from '@/services/note-data';

export default function DeleteNoteButton({ noteId }: {noteId: string}) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      const { error } = await deleteNote(noteId);
      if (error) {
        console.error('Failed to delete note:', error);
        window.alert('Could not delete the note. Please try again.');
      }
    } catch (error) {
      console.error('Failed to delete note:', error);
      window.alert('Could not delete the note. Please try again.');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <button type="button" onClick={handleDelete} disabled={deleting}>
      {deleting ? 'Deleting...' : 'DELETE NOTE'}
    </button>
  );
}
