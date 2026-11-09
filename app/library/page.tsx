import Link from 'next/link';
import { getOwnNotes } from '@/services/note-data';
import NoteForm from './note-form';
import NotesList from './note-list';

export default async function MyLibrary() {
  const {data: notes, error} = await getOwnNotes();

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
        <Link className="site-header-link" href="/notes">Search notes</Link>
        <p>ChompIn</p>
        <nav className="site-header-nav" aria-label="Main navigation">
          <Link className="site-header-link" href="/account">Profile</Link>
        </nav>
      </header>
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
            <NotesList notes={notes} />
          </section>
        </div>
      </section>
    </main>
  );
}