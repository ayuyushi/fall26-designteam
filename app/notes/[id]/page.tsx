import { notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import UploadFile from './upload_button';

type NotePageProps = {
  params: Promise<{ id: string }>;
};

export default async function NotePage({ params }: NotePageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: note, error } = await supabase
    .from('note')
    .select('id, class_title, class_code, semester, professor, unit, description')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Failed to load note:', error);
    throw new Error('Failed to load note.');
  }

  if (!note) {
    notFound();
  }

  return (
    <main className="p-6">
      <h1>{note.class_title}</h1>
      <dl>
        <div>
          <dt>Class code</dt>
          <dd>{note.class_code}</dd>
        </div>
        <div>
          <dt>Semester</dt>
          <dd>{note.semester}</dd>
        </div>
        <div>
          <dt>Professor</dt>
          <dd>{note.professor || 'Unknown'}</dd>
        </div>
        <div>
          <dt>Unit</dt>
          <dd>{note.unit || 'Unknown'}</dd>
        </div>
        <div>
          <dt>Description</dt>
          <dd>{note.description || 'No description'}</dd>
        </div>
      </dl>

      <UploadFile id={note.id as string}/>
    </main>
  );
}