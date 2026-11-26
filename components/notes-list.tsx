import Link from 'next/link';
import PreviewNoteCard from '@/components/preview-note-card';
import type NoteSpecific from '@/types/note-specific';

type NotesListProps = {
    notes: NoteSpecific[];
};

export default function NotesList({ notes } : NotesListProps) {
    if (notes?.length === 0) {
        return (
            <div className="notes-empty-state">
                <h3>No notes found</h3>
                <div className="note-file-actions">
                    <Link className="note-list-open" href="/notes">Search Public Notes →</Link>
                    <Link className="note-list-open" href="dashboard/library">Go to my collection →</Link>
                    <Link className="note-list-open" href="dashboard/create">Create a note →</Link>
                </div>
            </div>
        );
    }

    return (
        <section className="notes-list">
            {notes?.map((note) => (
                <PreviewNoteCard key={note.id} note={note} />
            ))}
        </section>
    );
}