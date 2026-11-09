import Link from 'next/link';
import DeleteNoteButton from './delete_note_button';

type Note = {
    id: string;
    class_title: string;
    semester: string;
    description: string | null;
};

type NotesListProps = {
    notes: Note[];
};

export default function NotesList({ notes }: NotesListProps) {
    if (notes.length === 0) {
        return (
            <div className="notes-empty-state">
                <h3>No notes yet</h3>
                <p>Create your first class note to get started.</p>
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
                            <p>{note.description || 'No description provided.'}</p>
                            <span className="note-list-open">View note <span aria-hidden="true">→</span></span>
                        </Link>
                        <div className="note-list-actions">
                            <DeleteNoteButton noteId={note.id} />
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
}