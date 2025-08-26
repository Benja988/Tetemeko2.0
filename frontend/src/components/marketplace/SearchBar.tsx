'use client';

import React from 'react';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

export default function SearchBar({ searchQuery, setSearchQuery }: SearchBarProps) {
  return (
    <div className="mb-6">
      <input
        type="text"
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-xl shadow focus:outline-none focus:ring focus:border-blue-300 text-white bg-secondary"
      />
    </div>
  );
}
