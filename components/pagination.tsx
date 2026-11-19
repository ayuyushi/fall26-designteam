'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function Pagination({ totalPages, currentPage }: { totalPages: number; currentPage: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const setPageSize = (pageSize: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', '1');
    params.set('pageSize', pageSize);
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div>
        <div>
            <h3>Notes Per Page</h3>
            <select
                defaultValue={10}
                onChange={(e) => setPageSize(e.target.value)}
            >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
            </select>
        </div>
        {currentPage > 1 && (<Link href={createPageURL(currentPage - 1)}>Previous</Link>)}
        <span> Page {currentPage} of {totalPages} </span>
        {currentPage < totalPages && (<Link href={createPageURL(currentPage + 1)}>Next</Link>)}
    </div>
  );
}
