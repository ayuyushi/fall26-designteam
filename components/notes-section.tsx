import FilterBar from '@/components/filter-bar';
import NotesList from '@/components/notes-list';
import Pagination from  '@/components/pagination';
import type NoteSpecific from '@/types/note-specific';

type NotesSectionProps = {
    currentPage: number;
    totalPages: number;
    notes: NoteSpecific[];
};

export default function NotesSection({ currentPage, totalPages, notes} : NotesSectionProps) {
    return (
    <div className="notes-results-layout">
        <div className="note-list">
            {totalPages > 0 && <p>{`Page ${currentPage} of ${totalPages}`}</p>}
            <NotesList notes={notes} />
            <Pagination currentPage={currentPage} totalPages={totalPages}/>
        </div>
        <FilterBar />
    </div>
    );
}