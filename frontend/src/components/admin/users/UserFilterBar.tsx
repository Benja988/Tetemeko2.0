'use client';

import { ChevronDown } from 'lucide-react'; // Optional: install lucide-react for icons
import { useState } from 'react';

export default function UserFilterBar({ onFilter }: { onFilter: (role: string) => void }) {
  const [selected, setSelected] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelected(value);
    onFilter(value);
  };

  return (
    <div className="flex items-center gap-3 mb-4">
      <label htmlFor="role-filter" className="text-sm font-medium text-gray-700">
        Filter by Role:
      </label>

      <div className="relative w-48">
        <select
          id="role-filter"
          value={selected}
          onChange={handleChange}
          className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 pr-10 text-sm text-gray-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          {/* <option value="manager">Manager</option> */}
          <option value="web_user">Web User</option>
        </select>

        {/* Chevron Icon */}
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
      </div>
    </div>
  );
}
