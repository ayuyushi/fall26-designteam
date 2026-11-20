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
    <aside className="w-64 p-4 border-r bg-white flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-lg">Filters</h2>
        <button 
          onClick={resetFilter} 
          className="text-sm text-blue-600 hover:underline"
        >
          Reset
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Class Title</label>
        <input
          type="text"
          value={params.get('class_title') ?? ''}
          onChange={(e) => updateFilter('class_title', e.target.value)}
          placeholder="Class Title..."
          className="w-full px-3.5 py-2 border rounded-md text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Class Code</label>
        <input
          type="text"
          value={params.get('class_code') ?? ''}
          onChange={(e) => updateFilter('class_code', e.target.value)}
          placeholder="Class Code..."
          className="w-full px-3.5 py-2 border rounded-md text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Semester</label>
        <select
          value={params.get('semester_term') ?? ''}
          onChange={(e) => updateFilter('semester_term', e.target.value)}
          className="w-full px-3 py-2 border rounded-md text-sm"
        >
          <option value="" disabled> Choose a term </option>
          <option value="Fall">Fall</option>
          <option value="Spring">Spring</option>
          <option value="Summer">Summer</option>
          <option value="Summer A">Summer A</option>
          <option value="Summer B">Summer B</option>
          <option value="Summer C">Summer C</option>
        </select>
        <input
          type="text"
          value={params.get('semester_year') ?? ''}
          onChange={(e) => updateFilter('semester_year', e.target.value)}
          placeholder="Year..."
          className="w-full px-3.5 py-2 border rounded-md text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Professor</label>
        <input
          type="text"
          value={params.get('professor') ?? ''}
          onChange={(e) => updateFilter('professor', e.target.value)}
          placeholder="Professor..."
          className="w-full px-3.5 py-2 border rounded-md text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Unit</label>
        <input
          type="text"
          value={params.get('unit') ?? ''}
          onChange={(e) => updateFilter('unit', e.target.value)}
          placeholder="Unit..."
          className="w-full px-3.5 py-2 border rounded-md text-sm"
        />
      </div>
    </aside>
  );
}