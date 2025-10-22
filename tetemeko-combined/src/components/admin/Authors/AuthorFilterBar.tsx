'use client';

import { useCallback } from 'react';
import type { AuthorFilter } from './AuthorsPageLayout';

interface AuthorFilterBarProps {
  onFilter: (role: AuthorFilter) => void;
  currentFilter?: AuthorFilter;
  isLoading?: boolean;
}

export default function AuthorFilterBar({
  onFilter,
  currentFilter = '',
  isLoading = false,
}: AuthorFilterBarProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onFilter(e.target.value as AuthorFilter);
    },
    [onFilter]
  );

  return (
    <select
      value={currentFilter}
      onChange={handleChange}
      disabled={isLoading}
      className="border border-gray-200 rounded-lg px-4 py-2 text-sm 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                transition-all duration-200 min-w-[180px]"
      aria-label="Filter authors by role"
      aria-disabled={isLoading}
    >
      <option value="">All</option>
      <option value="author">Authors</option>
      <option value="contributor">Contributors</option>
      <option value="editor">Editors</option>
      <option value="unverified">Unverified</option>
      <option value="verified">Verified</option>
    </select>
  );
}
