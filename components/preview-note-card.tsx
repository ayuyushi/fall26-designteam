'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type Note from '@/types/note';

export default function PreviewNoteCard({ note }: { note: Note }) {
  const pathname = usePathname();
  const link = pathname.includes('favorites') ? `/notes//${note.id}` : `${pathname}//${note.id}`;

  return (
  <section className="note-list-card">
    <Link className="note-list-link" href={link}>
        <span className="note-list-semester">{note.semester_term + ' ' + note.semester_year}</span>
        <h3>{`${note.class_title} (${note.class_code})`}</h3>
        <p>{`Professor ${note.professor ?? 'Unknown'} (Unit: ${note.unit ?? 'Unknown'})`}</p>
        <p>{note.description || 'No description provided.'}</p>
        <span className="note-list-open">View note <span aria-hidden="true">→</span></span>
    </Link>
  </section>
  );
}