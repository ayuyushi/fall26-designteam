'use client'

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { deleteFile, getFileUrl } from './file_upload';

type FileListProps = {
    files: {
        note_id: string;
        file_id: string;
        name: string;
    }[];
};

export default function FileList({ files }: FileListProps) {
    const router = useRouter();
    const [busyFileId, setBusyFileId] = useState<string | null>(null);

    async function downloadFile(noteId: string, fileId: string) {
        setBusyFileId(fileId);
        try {
            const result = await getFileUrl(noteId, fileId);
            if (!result.success || !result.url) {
                window.alert(result.error ?? 'Could not download the file.');
                return;
            }
            window.location.assign(result.url);
        } catch (error) {
            console.error('Could not download the file:', error);
            window.alert('Could not download the file.');
        } finally {
            setBusyFileId(null);
        }
    }

    async function removeFile(noteId: string, fileId: string) {
        setBusyFileId(fileId);
        try {
            const result = await deleteFile(noteId, fileId);
            if (!result.success) {
                window.alert(result.error ?? 'Could not delete the file.');
                return;
            }
            router.refresh();
        } catch (error) {
            console.error('Could not delete the file:', error);
            window.alert('Could not delete the file.');
        } finally {
            setBusyFileId(null);
        }
    }

    return (
        <section>
            <h2>Current Files</h2>
            <ul>
                {files.map((file) => (
                    <li key={file.file_id}>
                        <h2>{file.name}</h2>
                        <button
                            type="button"
                            disabled={busyFileId === file.file_id}
                            onClick={() => downloadFile(file.note_id, file.file_id)}
                        >
                            Download File
                        </button>
                        <button
                            type="button"
                            disabled={busyFileId === file.file_id}
                            onClick={() => removeFile(file.note_id, file.file_id)}
                        >
                            DELETE FILE
                        </button>
                    </li>
                ))}
            </ul>
        </section>
    );
}