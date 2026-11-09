import Link from 'next/link';
import { getNotes } from './actions';
import NoteForm from './note_form';
import NotesList from './note_list';

export default async function NotesPage() {
  const {success, data: notes, error} = await getNotes();

  if (!success) {
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
        <Link className="site-header-link" href="/account">Profile</Link>
      </header>
      <section className="site-content notes-page-content">
        <div className="account-intro notes-intro">
          <p className="site-eyebrow">Your library</p>
          <h1>Class notes</h1>
          <p>Create a note to organize and share resources for your classes.</p>
        </div>
        <div className="notes-workspace">
          <NoteForm />
          <section className="notes-section" aria-labelledby="your-notes-title">
            <div className="notes-section-heading">
              <p className="site-eyebrow">View your content here</p>
              <h2 id="your-notes-title">Your notes</h2>
            </div>
            <NotesList notes={notes} />
          </section>
        </div>
      </section>
    </main>
  );
}