import Header from '@/components/header'
import { getPublicNotes } from '@/services/note-data';
import NoteSection from './note-section';

export default function NotesPage() {
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
          <NoteSection getNoteFunction={getPublicNotes}/>
        </section>
      </section>
    </main>
  );
}