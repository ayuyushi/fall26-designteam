import { getOwnNotes, getPublicNotes } from './actions';
import NoteForm from './note_form';
import NotesList from './note_list';

export default async function NotesPage() {
  const {success, data: notes, error} = await getOwnNotes();

  if (!success) {
    console.error('Failed to load notes:', error);
    throw new Error('Failed to load notes.');
  }
  if (!notes) {
    throw new Error('Failed to load notes: the query returned no data.');
  }

  return (
    <main className="p-6">
      <h1>Hello to notes page</h1>
      <NoteForm/>
      <br></br>
      <NotesList notes={notes}/>
    </main>
  );
}