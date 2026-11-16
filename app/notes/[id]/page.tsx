import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/header'
import { getNote } from '@/services/note-data';
import { getNoteFileMetadata } from '@/services/file-metadata';
import NoteCard from '@/components/note-card';
import FileList from './file-list';

type NotePageProps = {
  params: Promise<{ id: string }>;
};

export default async function NotePage({ params }: NotePageProps) {
  const { id: noteId } = await params;
  const [
    { data: note, error: noteError },
    { data: files, error: filesError },
  ] = await Promise.all([
    getNote(noteId),
    getNoteFileMetadata(noteId),
  ]);

  if (noteError) {
    console.error('Failed to load note:', noteError);
    throw new Error('Failed to load note.');
  }
  if (filesError) {
    console.error('Failed to load note files:', filesError);
    throw new Error('Failed to load note files.');
  }
  if (!note) {
    notFound();
  }

  return (
    <main className="site-page">
      <Header visibility='auth' current='/notes'/>
      <section className="site-content note-detail-content">
        <Link className="note-back-link" href="/notes">← Back to notes</Link>
        <NoteCard note={note} />
        <div className="file-workspace">
          <FileList files={files ?? []} />
        </div>
      </section>
    </main>
  );
}