'use client';

import type { AuthorFilter } from './AuthorsPageLayout';

interface AuthorTabsProps {
  activeFilter: AuthorFilter;
  setFilter: (filter: AuthorFilter) => void;
}

const tabs = [
  { label: 'All Authors', value: '' },
  { label: 'Pending Verification', value: 'unverified' },
  { label: 'Verified', value: 'verified' },
];

export default function AuthorTabs({ activeFilter, setFilter }: AuthorTabsProps) {
  return (
    <div className="flex border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => setFilter(tab.value as AuthorFilter)}
          className={`px-4 py-2 text-sm font-medium relative ${
            activeFilter === tab.value
              ? 'text-blue-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
