'use client'

import { useState, useCallback, useEffect, Dispatch, SetStateAction } from 'react';
import FilterBar from  '@/components/filter-bar';
import type Note from '@/types/note';

const initFilter: Record<string, string> = {
  class_title: '',
  class_code:  '',
  semester: '',
  professor:  '',
  unit: ''
};

interface FilterSectionProps {
    getNoteFunction: (filters: Record<string, string>, num: number, offset: number) => any;
    setNotes: Dispatch<SetStateAction<Note[]>>;
}

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

export default function FilterSection({getNoteFunction, setNotes} : FilterSectionProps) {
    const [loading, setLoading] = useState(true)
    const [noteCount, setNoteCount] = useState<number>(0);
    const [page, setPage] = useState<number>(1);
    const [filters, setFilters] = useState(initFilter);
    const debouncedFilters = useDebounce(filters);

    const getNotes = useCallback(async() => {
    setLoading(true)

    const {data, count, error} = await getNoteFunction(filters, pageSize, (page - 1) * pageSize);

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
        <div className="filter-section">
            <p>{loading ? 'Loading ...' : `Page ${page} of ${Math.ceil(noteCount/pageSize)}`}</p>
            <button onClick={() => setPage(Math.min(Math.ceil(noteCount/pageSize), page + 1))}>+ Page</button>
            <button onClick={() => setPage(Math.max(1, page - 1))}>- Page</button>
            <FilterBar filters={filters} onChange={handleFilterChange} onReset={resetFilters} />
        </div>
    );
}