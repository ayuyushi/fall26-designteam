import NoteForm from './note_button';
import NotesList from './note_list';

export default function NotesPage() {
  return (
    <main className="p-6">
      <h1>Hello to notes page</h1>
      <NoteForm />
      <NotesList />
    </main>
  );
}