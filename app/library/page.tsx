import Header from '@/components/header'
import { getOwnNotes } from '@/services/note-data'
import NoteForm from './note-form'
import NoteSection from './note-section'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function MyLibrary() {
  const supabase = await createClient()

  const { data: claimsData } = await supabase.auth.getClaims()
  if(!claimsData?.claims){
    redirect('/login') //redirect to login page if not valid authentication
  }
    
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
            <NoteSection getNoteFunction={getOwnNotes}/>
          </section>
        </div>
      </section>
    </main>
  );
}