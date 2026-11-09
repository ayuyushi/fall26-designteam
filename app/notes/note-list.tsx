import Link from 'next/link';
import type Note from '@/types/note'

type NotesListProps = {
    notes: Note[];
};

export default function NotesList({ notes }: NotesListProps) {
    return (
        <ul className="notes-list">
            {notes.map((note) => (
                <li key={note.id}>
                    <Link href={`/notes/${note.id}`}>
                        <h2>{note.class_title} ({note.semester})</h2>
                        <p>{note.description}</p>
                    </Link>
                </li>
            ))}
        </ul>
    );
}