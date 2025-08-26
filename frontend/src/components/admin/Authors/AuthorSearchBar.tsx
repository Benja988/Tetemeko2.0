'use client';

import { useState, useCallback } from 'react';
import { FiSearch } from 'react-icons/fi';

interface AuthorSearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export default function AuthorSearchBar({
  onSearch,
  isLoading = false,
  placeholder = 'Search authors...',
}: AuthorSearchBarProps) {
  const [input, setInput] = useState('');

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSearch(input.trim());
  }, [input, onSearch]);

  return (
    <form 
      onSubmit={handleSubmit}
      className="relative w-full max-w-md"
      role="search"
      aria-label="Authors search"
    >
      <input
        type="search"
        placeholder={placeholder}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full border border-gray-200 rounded-lg px-4 py-2 pr-10 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  transition-all duration-200"
        disabled={isLoading}
        aria-disabled={isLoading}
        aria-busy={isLoading}
      />
      <button 
        type="submit" 
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600
                  focus:outline-none focus:text-blue-600"
        disabled={isLoading}
        aria-label="Search"
      >
        <FiSearch className="w-5 h-5" />
      </button>
    </form>
  );
}