import Link from 'next/link';
import type Note from '@/types/note';

type NotesListProps = {
    notes: Note[];
};

export default function PublicNotesList({ notes }: NotesListProps) {
    if (notes.length === 0) {
        return (
            <div className="notes-empty-state">
                <h3>No public notes yet</h3>
                <p>Check back later, or visit your collection to create a note.</p>
                <Link className="note-list-open" href="/library">Go to my collection →</Link>
            </div>
        );
    }

    return (
        <ul className="notes-list">
            {notes.map((note) => (
                <li key={note.id}>
                    <div className="note-list-card">
                        <Link className="note-list-link" href={`/notes/${note.id}`}>
                            <span className="note-list-semester">{note.semester}</span>
                            <h3>{note.class_title}</h3>
                            <p>{note.description ?? 'No description provided.'}</p>
                            <span className="note-list-open">View note <span aria-hidden="true">→</span></span>
                        </Link>
                    </div>
                </li>
            ))}
        </ul>
    );
}