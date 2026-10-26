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
    return (
        <ul className="notes-list">
            {notes.map((note) => (
                <li key={note.id}>
                    <Link href={`/notes/${note.id}`}>
                        <h2>{note.class_title} ({note.semester})</h2>
                        <p>{note.description}</p>
                    </Link>
                    <DeleteNoteButton noteId={note.id} />
                </li>
            ))}
        </ul>
    );
}