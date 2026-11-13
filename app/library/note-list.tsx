import Link from 'next/link';
import DeleteNoteButton from './delete-note-button';
import type Note from '@/types/note';

export default function PrivateNotesList({ notes }: { notes: Note[]} ) {
    if (notes?.length === 0) {
        return (
            <div className="notes-empty-state">
                <h3>No notes in your collection yet</h3>
                <p>Use the form to create your first class note.</p>
            </div>
        );
    }

    return (
        <ul className="notes-list">
            {notes?.map((note) => (
                <li key={note.id}>
                    <div className="note-list-card">
                        <Link className="note-list-link" href={`/library/${note.id}`}>
                            <span className="note-list-semester">{note.semester}</span>
                            <h3>{note.class_title}</h3>
                            <p>{note.description || 'No description provided.'}</p>
                            <span className="note-list-open">View note <span aria-hidden="true">→</span></span>
                        </Link>
                        <div className="note-list-actions">
                            <DeleteNoteButton noteId={note.id!} />
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
}