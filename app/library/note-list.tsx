import PreviewNoteCard from '@/components/preview-note-card';
import type NoteSpecific from '@/types/note-specific';

type NotesListProps = {
    notes: NoteSpecific[];
};

export default function PrivateNotesList({ notes }: NotesListProps ) {
    if (notes?.length === 0) {
        return (
            <div className="notes-empty-state">
                <h3>No notes in your collection yet</h3>
                <p>Use the form to create your first class note.</p>
            </div>
        );
    }

    return (
        <section className="notes-list">
            {notes?.map((note) => (
                <PreviewNoteCard key={note.id} note={note}/>
            ))}
        </section>
    );
}