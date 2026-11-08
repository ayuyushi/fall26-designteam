import { getPublicNotes } from '@/services/note-data';
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
    <main>
      <h1>Hello to notes page</h1>
      <br></br>
      <NotesList notes={notes}/>
    </main>
  );
}