import { notFound } from 'next/navigation';
import { getNote,  } from '@/services/note-data';
import { getNoteFileMetadata } from '@/services/file-metadata';
import NoteCard from '@/components/note-card';
import FileList from './file-list';

type NotePageProps = {
  params: Promise<{ id: string }>;
};

export default async function NotePage({params} : NotePageProps) {
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
        <main>
            <NoteCard note={note} />
            <FileList files={files!} />
        </main>
    );
}