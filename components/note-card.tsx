'use client'

import { useState } from 'react';
import Image from 'next/image';
import { insertFavoritedNote, deleteFavoritedNote } from '@/services/note-data';
import DeleteNoteButton from '@/components/delete-note-button';
import type NoteSpecific from '@/types/note-specific';

import star from '../public/star.png';
import unstar from '../public/unstar.png';

export default function NoteCard({ note }: { note: NoteSpecific }) {
  const [ favorite, setFavorite ] = useState(note.is_favorited);

  const invertFavorite = async (noteId: string) => {
    try {
      const { error } = favorite ? await deleteFavoritedNote(noteId) : await insertFavoritedNote(noteId);
        
      if (error) {
        console.log('Failed to favorite note:', error);
        window.alert('Could not favorite the note. Please try again.');
      }

      setFavorite(!favorite);
    } catch (error) {
      console.log('Failed to favorite note:', error);
      window.alert('Could not favorite the note. Please try again.');
    }
  }

  return (
  <section className="note-detail-card">
    <p className="site-eyebrow">Class note</p>
    <h1>{note.class_title}</h1>
    <button onClick={() => invertFavorite(note.id)}>
      <Image 
        src={favorite ? star : unstar} 
        alt="Action icon" 
        width={20} 
        height={20} 
      />
    </button>
    <dl className="note-details">
      <div>
        <dt>Class code</dt>
        <dd>{note.class_code}</dd>
      </div>
      <div>
        <dt>Semester</dt>
        <dd>{note.semester_term + ' ' + note.semester_year}</dd>
      </div>
      <div>
        <dt>Professor</dt>
        <dd>{note.professor ?? 'Unknown'}</dd>
      </div>
      <div>
        <dt>Unit</dt>
        <dd>{note.unit ?? 'Unknown'}</dd>
      </div>
      <div>
        <dt>Description</dt>
        <dd>{note.description ?? 'No description provided.'}</dd>
      </div>
    </dl>
    { note.is_author && <DeleteNoteButton noteId={note.id} /> }
  </section>
  );
}