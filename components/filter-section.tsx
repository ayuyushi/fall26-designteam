'use client'

import { useState, useCallback, useEffect, Dispatch, SetStateAction } from 'react';
import FilterBar from  '@/components/filter-bar';
import type Note from '@/types/note';

const DEFAULT_FILTERS: Record<string, string> = {
  class_title: '',
  class_code:  '',
  semester: '',
  professor:  '',
  unit: ''
};

const PAGE_SIZE = 5; //TODO: PLACEHOLDER & MIGHT BECOME USESTATE IN FUTURE

interface FilterSectionProps {
    getNoteFunction: (filters: Record<string, string>, num: number, offset: number) => any;
    setNotes: Dispatch<SetStateAction<Note[]>>;
}

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

export default function FilterSection({getNoteFunction, setNotes} : FilterSectionProps) {
    const [loading, setLoading] = useState(true)
    const [noteCount, setNoteCount] = useState<number>(0);
    const [page, setPage] = useState<number>(1);
    const [filters, setFilters] = useState(DEFAULT_FILTERS);
    const debouncedFilters = useDebounce(filters);

    const getNotes = useCallback(async() => {
    setLoading(true)

    const {data, count, error} = await getNoteFunction(filters, PAGE_SIZE, (page - 1) * PAGE_SIZE);

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

    const resetFilters = () => setFilters(DEFAULT_FILTERS);

    return (
        <div className="filter-section">
            <p>{loading ? 'Loading ...' : `Page ${page} of ${Math.ceil(noteCount/PAGE_SIZE)}`}</p>
            <button onClick={() => setPage(Math.min(Math.ceil(noteCount/PAGE_SIZE), page + 1))}>+ Page</button>
            <button onClick={() => setPage(Math.max(1, page - 1))}>- Page</button>
            <FilterBar filters={filters} onChange={handleFilterChange} onReset={resetFilters} />
        </div>
    );
}