import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { getOwnNotes } from '@/services/note-data';

import NotesSection from '@/components/notes-section';
import type NoteSpecific from '@/types/note-specific';

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Library'
};

interface FilterProps {
  searchParams: Promise<{ [key: string]: string }>;
};

const DEFAULT_PAGE_SIZE = 10;

export default async function MyLibrary({ searchParams }: FilterProps) {
  const supabase = await createClient();

  const { data: claimsData } = await supabase.auth.getClaims()
  if(!claimsData?.claims){
    redirect('/login') //redirect to login page if not valid authentication
  };

  const resolvedParams = await searchParams;

  const search_filters: Record<string, string> = {
    class_title: resolvedParams.class_title ?? '',
    class_code: resolvedParams.class_code ?? '',
    semester_term: resolvedParams.semester_term ?? '',
    semester_year: resolvedParams.semester_year ?? '',
    professor:  resolvedParams.professor ?? '',
    unit: resolvedParams.unit ?? ''
  };

  const currentPage = Number(resolvedParams.page) || 1;
  const pageSize = Number(resolvedParams.pageSize) || DEFAULT_PAGE_SIZE;
  const { data: notes, count } = await getOwnNotes(search_filters, pageSize, (currentPage - 1) * pageSize);
  const totalPages = count ? Math.ceil(count/pageSize) : 0;
    
  return (
    <main className="site-page">
      <section className="site-content notes-page-content">
        <div className="account-intro notes-intro">
          <p className="site-eyebrow">Your space</p>
          <h1>My collection</h1>
          <p>Edit and organize your class notes and resources.</p>
        </div>
        <div className="notes-workspace">
          <section className="notes-section" aria-labelledby="your-notes-title">
            <div className="notes-section-heading">
              <p className="site-eyebrow">Your library</p>
              <h2 id="your-notes-title">Your notes</h2>
            </div>
            <NotesSection 
              currentPage={currentPage} 
              totalPages={totalPages} 
              notes={notes ? notes as NoteSpecific[] : []}/>
          </section>
        </div>
      </section>
    </main>
  );
}
