import { getPublicNotes } from '@/services/note-data';
import Link from 'next/link';
import NotesList from './note-list';

export default async function NotesPage() {
  const {data: notes, error} = await getPublicNotes();

  if (error) {
    console.error('Failed to load notes:', error);
    throw new Error('Failed to load notes.');
  }
  if (!notes) {
    throw new Error('Failed to load notes: the query returned no data.');
  }

  return (
    <main className="site-page">
      <header className="site-header">
        <Link className="site-header-link" href="/">Home</Link>
        <p>ChompIn</p>
        <nav className="site-header-nav" aria-label="Main navigation">
          <Link className="site-header-link" href="/library">My collection</Link>
          <Link className="site-header-link" href="/account">Profile</Link>
        </nav>
      </header>
      <section className="site-content notes-page-content">
        <div className="account-intro notes-intro">
          <p className="site-eyebrow">Explore and share</p>
          <h1>Search notes</h1>
          <p>Browse notes shared by the ChompIn community.</p>
        </div>
        <section className="notes-section" aria-labelledby="public-notes-title">
          <div className="notes-section-heading">
            <p className="site-eyebrow">View your content here</p>
            <h2 id="public-notes-title">Public notes</h2>
          </div>
          <NotesList notes={notes} />
        </section>
      </section>
    </main>
  );
}