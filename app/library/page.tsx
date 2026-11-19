import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { getOwnNotes } from '@/services/note-data'

import Header from '@/components/header'
import FilterBar from '@/components/filter-bar';
import Pagination from  '@/components/pagination';
import type Note from '@/types/note';

import PrivateNotesList from './note-list';
import NoteForm from './note-form'

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
  const { data: notes, count } = await getOwnNotes(search_filters, pageSize, (currentPage - 1) * pageSize);
  const totalPages = count ? Math.ceil(count/pageSize) : 0;
    
  return (
    <main className="site-page">
      <Header visibility='auth' current='/library'/>
      <section className="site-content notes-page-content">
        <div className="account-intro notes-intro">
          <p className="site-eyebrow">Your space</p>
          <h1>My collection</h1>
          <p>Create and organize your class notes and resources.</p>
        </div>
        <div className="notes-workspace">
          <NoteForm />
          <section className="notes-section" aria-labelledby="your-notes-title">
            <div className="notes-section-heading">
              <p className="site-eyebrow">Your library</p>
              <h2 id="your-notes-title">Your notes</h2>
            </div>
             <div className="note-list">
                <FilterBar />
                <p>{`${currentPage} of ${totalPages}`}</p>
                <PrivateNotesList notes={notes ? notes as Note[] : []} />
                <Pagination currentPage={currentPage} totalPages={totalPages}/>
              </div>
          </section>
        </div>
      </section>
    </main>
  );
}
