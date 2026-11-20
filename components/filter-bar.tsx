'use client'

import { useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

function useDebounce<T>(value: T, delay: number = 400): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export default function filterBar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [paramsString, setParamsString] = useState(searchParams.toString());
  const params = new URLSearchParams(paramsString);
  const debounced = useDebounce(paramsString);

  const { replace } = useRouter();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(paramsString);
    params.set('page', '1');

    if (value && value !== '') {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    setParamsString(params.toString());
  }

  const resetFilter = () => {
    setParamsString('');
    replace(pathname);
  }

  useEffect(() => {
    if (!debounced || debounced === searchParams.toString())
      return;

    replace(`${pathname}?${paramsString}`);
  }, [debounced, searchParams, pathname, replace])

  return (
    <aside className="note-filters" aria-label="Filter notes">
      <div className="note-filters-heading">
        <h2>Filters</h2>
        <button 
          onClick={resetFilter} 
          className="notes-secondary-button note-filters-reset"
          type="button"
        >
          Reset
        </button>
      </div>

      <div className="note-filter-fields">
      <div className="note-filter-field">
        <label htmlFor="filter-class-title">Class Title</label>
        <input
          id="filter-class-title"
          type="text"
          value={params.get('class_title') ?? ''}
          onChange={(e) => updateFilter('class_title', e.target.value)}
          placeholder="Class Title..."
        />
      </div>

      <div className="note-filter-field">
        <label htmlFor="filter-class-code">Class Code</label>
        <input
          id="filter-class-code"
          type="text"
          value={params.get('class_code') ?? ''}
          onChange={(e) => updateFilter('class_code', e.target.value)}
          placeholder="Class Code..."
        />
      </div>

      <div className="note-filter-field">
        <label htmlFor="filter-semester-term">Semester</label>
        <select
          id="filter-semester-term"
          value={params.get('semester_term') ?? ''}
          onChange={(e) => updateFilter('semester_term', e.target.value)}
        >
          <option value="" disabled>Choose a term</option>
          <option value="Fall">Fall</option>
          <option value="Spring">Spring</option>
          <option value="Summer">Summer</option>
          <option value="Summer A">Summer A</option>
          <option value="Summer B">Summer B</option>
          <option value="Summer C">Summer C</option>
        </select>
      </div>

      <div className="note-filter-field">
        <label htmlFor="filter-semester-year">Year</label>
        <input
          id="filter-semester-year"
          type="text"
          value={params.get('semester_year') ?? ''}
          onChange={(e) => updateFilter('semester_year', e.target.value)}
          placeholder="Year..."
        />
      </div>

      <div className="note-filter-field">
        <label htmlFor="filter-professor">Professor</label>
        <input
          id="filter-professor"
          type="text"
          value={params.get('professor') ?? ''}
          onChange={(e) => updateFilter('professor', e.target.value)}
          placeholder="Professor..."
        />
      </div>

      <div className="note-filter-field">
        <label htmlFor="filter-unit">Unit</label>
        <input
          id="filter-unit"
          type="text"
          value={params.get('unit') ?? ''}
          onChange={(e) => updateFilter('unit', e.target.value)}
          placeholder="Unit..."
        />
      </div>
      </div>
    </aside>
  );
}