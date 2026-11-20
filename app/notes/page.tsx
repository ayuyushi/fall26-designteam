import Header from '@/components/header'
import { getPublicNotes } from '@/services/note-data';
import FilterBar from '@/components/filter-bar';
import Pagination from  '@/components/pagination';
import type NoteSpecific from '@/types/note-specific';
import PublicNotesList from './note-list';

interface FilterProps {
  searchParams: Promise<{ [key: string]: string }>;
};

const DEFAULT_PAGE_SIZE = 10;

export default async function NotesPage({ searchParams }: FilterProps) {
  const resolvedParams = await searchParams;

  const search_filters: Record<string, string> = {
    class_title: resolvedParams.class_title ?? '',
    class_code: resolvedParams.class_code ?? '',
    semester_term: resolvedParams.semester_term ?? '',
    semester_year: resolvedParams.semester_year ?? '',
    professor:  resolvedParams.professor ?? '',
    unit: resolvedParams.unit ?? ''
  }

  const currentPage = Number(resolvedParams.page) || 1;
  const pageSize = Number(resolvedParams.pageSize) || DEFAULT_PAGE_SIZE;
  const { data: notes, count } = await getPublicNotes(search_filters, pageSize, (currentPage - 1) * pageSize);
  const totalPages = count ? Math.ceil(count/pageSize) : 0;

  return (
    <main className="site-page">
      <Header visibility='auth' current='/notes'/>
      <section className="site-content notes-page-content">
        <div className="account-intro notes-intro">
          <p className="site-eyebrow">Explore and share</p>
          <h1>Search notes</h1>
          <p>Browse notes shared by the ChompIn community.</p>
        </div>
        <section className="notes-section" aria-labelledby="public-notes-title">
          <div className="notes-section-heading">
            <p className="site-eyebrow">View public content here</p>
            <h2 id="public-notes-title">Public notes</h2>
          </div>
          <div className="note-list">
              <FilterBar />
              {totalPages > 0 && <p>{`Page ${currentPage} of ${totalPages}`}</p>}
              <PublicNotesList notes={notes ? notes as NoteSpecific[] : []} />
              <Pagination currentPage={currentPage} totalPages={totalPages}/>
          </div>
        </section>
      </section>
    </main>
  );
}
