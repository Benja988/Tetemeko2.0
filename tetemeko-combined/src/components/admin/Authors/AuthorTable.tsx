'use client';

import { Author } from '@/types/author';
// import { formatDate } from '@/lib/utils';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Image from 'next/image';

interface AuthorTableProps {
  authors: Author[];
  isLoading: boolean;
  selectedAuthorIds: string[];
  onSelectAuthor: (id: string) => void;
  onToggleSelectAll: () => void;
}

export default function AuthorTable({
  authors,
  isLoading,
  selectedAuthorIds,
  onSelectAuthor,
  onToggleSelectAll,
}: AuthorTableProps) {
  const allSelected = authors.length > 0 && selectedAuthorIds.length === authors.length;

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead>
            <tr>
              {[...Array(7)].map((_, i) => (
                <th key={i} className="p-4 text-left">
                  <Skeleton height={20} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr key={i}>
                {[...Array(7)].map((_, j) => (
                  <td key={j} className="p-4">
                    <Skeleton height={20} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full table-auto border-collapse">
        <thead className="bg-gray-50 text-gray-600 text-sm">
          <tr>
            <th className="p-4 w-12">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={allSelected}
                onChange={onToggleSelectAll}
                aria-label="Select all authors"
              />
            </th>
            <th className="p-4 text-left">Name</th>
            <th className="p-4 text-left">Email</th>
            <th className="p-4 text-left">Bio</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-left">Created</th>
            <th className="p-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {authors.map((author) => (
            <tr key={author._id} className="hover:bg-gray-50">
              <td className="p-4">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={selectedAuthorIds.includes(author._id)}
                  onChange={() => onSelectAuthor(author._id)}
                  aria-label={`Select ${author.name}`}
                />
              </td>
              <td className="p-4">
                <div className="flex items-center gap-3">
                  {author.avatar ? (
                    <Image
                      src={author.avatar}
                      width={40}
                      height={40}
                      alt={`${author.name} avatar`}
                      className="w-10 h-10 rounded-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                      {author.name?.charAt(0).toUpperCase() ?? '?'}
                    </div>
                  )}
                  <span className="font-medium text-gray-800">{author.name}</span>
                </div>
              </td>
              <td className="p-4 text-gray-600">{author.email || '—'}</td>
              <td className="p-4 text-gray-600 max-w-xs truncate">
                {author.bio || '—'}
              </td>
              <td className="p-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  author.isVerified 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {author.isVerified ? 'Verified' : 'Pending'}
                </span>
              </td>
              <td className="p-4 text-gray-600">
                {/* {author.createdAt ? formatDate(author.createdAt) : '—'} */}
              </td>
              <td className="p-4">
                <button 
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  onClick={() => onSelectAuthor(author._id)}
                >
                  {selectedAuthorIds.includes(author._id) ? 'Deselect' : 'Select'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {authors.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          No authors found. Try adjusting your search or filters.
        </div>
      )}
    </div>
  );
}