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
        <section className="file-list-card" aria-labelledby="current-files-title">
            <div className="note-card-heading">
                <p className="site-eyebrow">Resources</p>
                <h2 id="current-files-title">Current files</h2>
            </div>
            {files.length === 0 ? (
                <p className="files-empty-state">No files have been added to this note yet.</p>
            ) : (
            <ul className="note-files-list">
                {files.map((file) => (
                    <li className="note-file-item" key={file.file_id}>
                        <h3>{file.name}</h3>
                        <div className="note-file-actions">
                        <button
                            className="notes-primary-button"
                            type="button"
                            disabled={busyFileId === file.file_id}
                            onClick={() => downloadFile(file.note_id, file.file_id)}
                        >
                            {busyFileId === file.file_id ? 'Working...' : 'Download'}
                        </button>
                        <button
                            className="notes-secondary-button"
                            type="button"
                            disabled={busyFileId === file.file_id}
                            onClick={() => removeFile(file.note_id, file.file_id)}
                        >
                            Delete
                        </button>
                        </div>
                    </li>
                ))}
            </ul>
            )}
        </section>
    );
}