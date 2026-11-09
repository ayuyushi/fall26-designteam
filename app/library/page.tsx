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
    <main>
      <h1>Hello to notes page</h1>
      <NoteForm/>
      <br></br>
      <NotesList notes={notes}/>
    </main>
  );
}