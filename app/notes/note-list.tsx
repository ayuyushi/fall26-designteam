import Link from 'next/link';
import PreviewNoteCard from '@/components/preview-note-card';
import type NoteSpecific from '@/types/note-specific';

type NotesListProps = {
    notes: NoteSpecific[];
};

export default function NotesList({ notes }: NotesListProps) {
    if (notes?.length === 0) {
        return (
            <div className="notes-empty-state">
                <h3>No public notes yet</h3>
                <p>Check back later, or visit your collection to create a note.</p>
                <Link className="note-list-open" href="/library">Go to my collection →</Link>
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