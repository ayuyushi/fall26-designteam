import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { getFavoritedNotes } from '@/services/note-data'

import FilterBar from '@/components/filter-bar';
import Pagination from  '@/components/pagination';
import type NoteSpecific from '@/types/note-specific';

import NotesList from './note-list';

interface FilterProps {
  searchParams: Promise<{ [key: string]: string }>;
};

const DEFAULT_PAGE_SIZE = 10;

export default async function MyLibrary({ searchParams }: FilterProps) {
  const supabase = await createClient()

  const { data: claimsData } = await supabase.auth.getClaims()
  if(!claimsData?.claims){
    redirect('/login') //redirect to login page if not valid authentication
  }

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
  const { data: notes, count } = await getFavoritedNotes(search_filters, pageSize, (currentPage - 1) * pageSize);
  const totalPages = count ? Math.ceil(count/pageSize) : 0;
    
  return (
    <main className="site-page">
      <section className="site-content notes-page-content">
        <div className="account-intro notes-intro">
          <p className="site-eyebrow">Your space</p>
          <h1>My favorites</h1>
          <p>Your favorited notes and resources.</p>
        </div>
        <div className="notes-workspace">
          <section className="notes-section" aria-labelledby="your-notes-title">
            <div className="notes-section-heading">
              <p className="site-eyebrow">Your library</p>
              <h2 id="your-notes-title">Your notes</h2>
            </div>
             <div className="note-list">
                <FilterBar />
                {totalPages > 0 && <p>{`Page ${currentPage} of ${totalPages}`}</p>}
                <NotesList notes={notes ? notes as NoteSpecific[] : []} />
                <Pagination currentPage={currentPage} totalPages={totalPages}/>
              </div>
          </section>
        </div>
      </section>
    </main>
  );
}
