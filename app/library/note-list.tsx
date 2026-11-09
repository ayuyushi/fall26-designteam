import Link from 'next/link';
import DeleteNoteButton from './delete-note-button';
import type Note from '@/types/note';

export default function NotesList({ notes }: { notes: Note[]} ) {
    return (
        <ul className="notes-list">
            {notes.map((note) => (
                <li key={note.id}>
                    <Link href={`/library/${note.id}`}>
                        <h2>{note.class_title} ({note.semester})</h2>
                        <p>{note.description}</p>
                    </Link>
                    <DeleteNoteButton noteId={note.id} />
                </li>
            ))}
        </ul>
    );
}