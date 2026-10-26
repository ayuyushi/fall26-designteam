'use client';

import { useState } from 'react';
import { deleteNote } from './actions';

type DeleteNoteButtonProps = {
  noteId: string;
};

export default function DeleteNoteButton({ noteId }: DeleteNoteButtonProps) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      const result = await deleteNote(noteId);
      if (!result.success) {
        console.error('Failed to delete note:', result.error);
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
