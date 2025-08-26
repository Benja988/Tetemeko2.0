'use client';

import { useMemo, useEffect, useState } from 'react';
import UserRow from './UserRow';
import { IUser } from '@/types/user';
import { useDebounce } from '@/hooks/useDebounce';

interface UserTableProps {
  users: IUser[];
  search: string;
  filter: string;
  selectedUserIds: string[];
  onToggleSelectAll: () => void;
  onSelectUsers: (ids: string[]) => void;
  onBulkDelete?: (ids: string[]) => void; // Optional bulk delete handler
}

export default function UserTable({
  users,
  search,
  filter,
  selectedUserIds,
  onToggleSelectAll,
  onSelectUsers,
  onBulkDelete,
}: UserTableProps) {
  const debouncedSearch = useDebounce(search, 300);
  const [sortKey, setSortKey] = useState<'name' | 'email' | 'createdAt' | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const isSearching = !!debouncedSearch.trim();

  // Filtering users by search and filter props
  const filteredUsers = useMemo(() => {
    if (!Array.isArray(users)) return [];

    // If searching, assume backend returns filtered users already
    const baseUsers = isSearching
      ? users
      : users.filter((user) => {
          const searchTerm = debouncedSearch.toLowerCase();
          const matchesSearch =
            user.name?.toLowerCase().includes(searchTerm) ||
            user.email?.toLowerCase().includes(searchTerm);
          return matchesSearch;
        });

    // Client-side filter by role/status/verification
    return baseUsers.filter((user) => {
      const matchesFilter =
        {
          admin: user.role === 'admin',
          manager: user.role === 'manager',
          web_user: user.role === 'web_user',
          active: user.isActive,
          inactive: !user.isActive,
          verified: user.isVerified,
          unverified: !user.isVerified,
          all: true,
          '': true,
        }[filter] ?? true;

      return matchesFilter;
    });
  }, [users, debouncedSearch, filter]);

  // Sort filtered users by the selected column and order
  const sortedUsers = useMemo(() => {
    const usersCopy = [...filteredUsers];
    if (!sortKey) return usersCopy;
    return usersCopy.sort((a, b) => {
      let valA: string | number = '';
      let valB: string | number = '';

      if (sortKey === 'createdAt') {
        valA = new Date(a.createdAt).getTime();
        valB = new Date(b.createdAt).getTime();
      } else {
        valA = (a[sortKey] ?? '').toString().toLowerCase();
        valB = (b[sortKey] ?? '').toString().toLowerCase();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredUsers, sortKey, sortOrder]);

  // Pagination calculations
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedUsers.slice(start, start + itemsPerPage);
  }, [sortedUsers, currentPage]);

  // Inform parent when selection changes
  useEffect(() => {
    onSelectUsers(selectedUserIds);
  }, [selectedUserIds, onSelectUsers]);

  // Reset page when users/filter/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, filter, users]);

  const handleCheckboxChange = (userId: string, checked: boolean) => {
    if (checked) {
      onSelectUsers([...selectedUserIds, userId]);
    } else {
      onSelectUsers(selectedUserIds.filter((id) => id !== userId));
    }
  };

  const allSelected =
    paginatedUsers.length > 0 &&
    paginatedUsers.every((user) => selectedUserIds.includes(user._id));
  const someSelected = paginatedUsers.some((user) =>
    selectedUserIds.includes(user._id)
  );

  // Sorting handler
  const handleSort = (key: 'name' | 'email' | 'createdAt') => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  // Highlight search match helper
  const highlight = (text: string, search: string) => {
    if (!search) return text;
    const regex = new RegExp(`(${search})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
  };

  return (
    <>
      {/* Bulk action bar */}
      {selectedUserIds.length > 0 && (
        <div className="p-3 bg-blue-50 text-sm text-blue-700 flex justify-between items-center rounded-t-md">
          <span>{selectedUserIds.length} selected</span>
          {onBulkDelete && (
            <button
              onClick={() => onBulkDelete(selectedUserIds)}
              className="text-red-600 hover:underline"
              type="button"
            >
              Delete Selected
            </button>
          )}
        </div>
      )}

      <div className="w-full overflow-x-auto rounded-lg shadow-lg bg-white">
        <table className="min-w-full border-collapse text-gray-700">
          <thead className="bg-gray-50 sticky top-0 z-20 border-b border-gray-200">
            <tr className="text-xs font-semibold uppercase tracking-wide text-gray-600">
              <th className="p-3 text-left w-12">
                <input
                  type="checkbox"
                  aria-label="Select all users"
                  className="custom-checkbox"
                  checked={allSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = !allSelected && someSelected;
                  }}
                  onChange={() => onToggleSelectAll()}
                />
              </th>
              <th className="p-3 text-left whitespace-nowrap">Profile</th>
              <th
                className="p-3 text-left whitespace-nowrap cursor-pointer select-none"
                onClick={() => handleSort('name')}
              >
                Name{' '}
                {sortKey === 'name' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th
                className="p-3 text-left whitespace-nowrap hidden sm:table-cell cursor-pointer select-none"
                onClick={() => handleSort('email')}
              >
                Email{' '}
                {sortKey === 'email' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th className="p-3 text-left whitespace-nowrap hidden md:table-cell">
                Role
              </th>
              <th className="p-3 text-left whitespace-nowrap hidden md:table-cell">
                Status
              </th>
              <th className="p-3 text-left whitespace-nowrap hidden lg:table-cell">
                Verified
              </th>
              <th className="p-3 text-left whitespace-nowrap hidden lg:table-cell">
                Locked
              </th>
              <th
                className="p-3 text-left whitespace-nowrap hidden xl:table-cell cursor-pointer select-none"
                onClick={() => handleSort('createdAt')}
              >
                Created At{' '}
                {sortKey === 'createdAt' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th className="p-3 text-left whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.length === 0 ? (
              <tr>
                <td
                  colSpan={10}
                  className="py-8 text-center text-gray-500 font-medium select-none"
                >
                  No users found.
                </td>
              </tr>
            ) : (
              paginatedUsers.map((user, index) => (
                <UserRow
                  key={user._id}
                  user={{
                    ...user,
                    name: highlight(user.name ?? '', debouncedSearch),
                    email: highlight(user.email ?? '', debouncedSearch),
                  }}
                  isSelected={selectedUserIds.includes(user._id)}
                  onCheckboxChange={handleCheckboxChange}
                  rowClassName={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  // dangerouslySetInnerHTML={false} // Pass this flag if UserRow handles highlight rendering
                />
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center px-4 py-3 border-t border-gray-200">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="text-sm text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="text-sm text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
}
