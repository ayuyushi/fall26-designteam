'use client'

import { useState } from 'react';
import { getFileUrl } from '@/services/file-data';
import File from "@/types/file";

type FileListProps = {
    files: File[];
};

export default function FileList({ files }: FileListProps) {
    const [busyFileId, setBusyFileId] = useState<string | null>(null);

    async function downloadFile(noteId: string, fileId: string) {
        setBusyFileId(fileId);
        try {
            const { url , error} = await getFileUrl(noteId, fileId);
            if (error || !url) {
                window.alert(error ?? 'Could not download the file.');
                return;
            }
            window.location.assign(url);
        } catch (error) {
            console.error('Could not download the file:', error);
            window.alert('Could not download the file.');
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
                    </li>
                ))}
            </ul>
        </section>
    );
}