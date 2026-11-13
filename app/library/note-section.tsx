'use client'

import { useState } from 'react';
import FilterSection from '@/components/filter-section';
import type Note from '@/types/note';
import PrivateNotesList from './note-list';

interface NoteSectionProps {
    getNoteFunction: (filters: Record<string, string>, num: number, offset: number) => any;
}

export default function NoteSection({getNoteFunction} : NoteSectionProps) {
    const [notes, setNotes] = useState<Note[]>([]);

    return (
        <div className="note-list">
            <FilterSection getNoteFunction={getNoteFunction} setNotes={setNotes} />
            <PrivateNotesList notes={notes} />
        </div>
    );
}