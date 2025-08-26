'use client';

import { Search, X } from 'lucide-react';
import { useState } from 'react';

interface UserSearchBarProps {
  onSearch: (q: string) => void;
}

export default function UserSearchBar({ onSearch }: UserSearchBarProps) {
  const [query, setQuery] = useState('');

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="relative w-full max-w-sm">
      {/* Container with flex for icons + input alignment */}
      <div className="flex items-center bg-white border border-gray-300 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
        {/* Search Icon */}
        <div className="flex items-center justify-center px-3 text-gray-400 pointer-events-none">
          <Search className="w-5 h-5" />
        </div>

        {/* Input */}
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onSearch(e.target.value);
          }}
          placeholder="Search by name or email"
          className="flex-grow py-2 pr-3 text-sm text-gray-900 placeholder-gray-400 rounded-r-lg focus:outline-none"
          aria-label="Search users by name or email"
        />

        {/* Clear Button */}
        {query && (
          <button
            onClick={handleClear}
            aria-label="Clear search input"
            className="flex items-center justify-center px-3 text-gray-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-r-lg"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
