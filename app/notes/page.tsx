'use client'

import Link from 'next/link';
import { useState, useCallback, useEffect } from 'react';
import { getPublicNotes } from '@/services/note-data';
import FilterBar from  '@/components/filter-bar';
import PublicNotesList from './note-list';
import type Note from '@/types/note';

const initFilter = {
  class_title: '',
  class_code:  '',
  semester: '',
  professor:  '',
  unit: ''
};

const pageSize = 5; //TODO: PLACEHOLDER & MIGHT BECOME USESTATE IN FUTURE

function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export default function NotesPage() {
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteCount, setNoteCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [filters, setFilters] = useState(initFilter);
  const debouncedFilters = useDebounce(filters);

  const getNotes = useCallback(async() => {
    setLoading(true)

    const {data, count, error} = await getPublicNotes(filters, pageSize, (page - 1) * pageSize);

    if (error) {
      console.error('Failed to load notes:', error);
      throw new Error('Failed to load notes.');
    }
    if (!data) {
      throw new Error('Failed to load notes: the query returned no data.');
    }

    setNotes(data);
    setNoteCount(count ?? 0);

    setLoading(false)
    }, [debouncedFilters, page]);

  useEffect(() => {
    if (!debouncedFilters) 
      return;

    getNotes();
  }, [debouncedFilters, page, getNotes])
  
  const handleFilterChange = (key: string, value: string) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => setFilters(initFilter);

  return (
    <main className="site-page">
      <header className="site-header">
        <Link className="site-header-link" href="/">Home</Link>
        <p>ChompIn</p>
        <Link className="site-header-link" href="/account">Profile</Link>
      </header>
      <section className="site-content notes-page-content">
        <div className="account-intro notes-intro">
          <p className="site-eyebrow">Explore and share</p>
          <h1>Search notes</h1>
          <p>Browse notes shared by the ChompIn community.</p>
        </div>
        <section className="notes-section" aria-labelledby="public-notes-title">
          <div className="notes-section-heading">
            <p className="site-eyebrow">View public content here</p>
            <h2 id="public-notes-title">Public notes</h2>
          </div>
          <p>{loading ? 'Loading ...' : `Page ${page} of ${Math.ceil(noteCount/pageSize)}`}</p>
          <button onClick={() => setPage(Math.min(Math.ceil(noteCount/pageSize), page + 1))}>+ Page</button>
          <button onClick={() => setPage(Math.max(1, page - 1))}>- Page</button>
          <FilterBar filters={filters} onChange={handleFilterChange} onReset={resetFilters} />
          <PublicNotesList notes={notes} />
        </section>
      </section>
    </main>
  );
}