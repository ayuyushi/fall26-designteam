import { notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import NoteCard from './note_card'
import FileList from './file_list';
import UploadFile from './upload_button';

type NotePageProps = {
  params: Promise<{ id: string }>;
};

export default async function NotePage({ params }: NotePageProps) {
  const { id: noteId } = await params;
  
  const supabase = await createClient();
  const [
    { data: note, error: noteError },
    { data: files, error: filesError },
  ] = await Promise.all([
    supabase
      .from('note')
      .select('id, class_title, class_code, semester, professor, unit, description')
      .eq('id', noteId)
      .maybeSingle(),
    supabase
      .from('file')
      .select('note_id, file_id, name')
      .eq('note_id', noteId),
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
    <main className="p-6">
      <NoteCard note={note} />
      <FileList files={files} />
      <UploadFile noteId={noteId}/>
    </main>
  );
}