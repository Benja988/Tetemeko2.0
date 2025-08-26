'use client';

import { Author } from "@/types/author";

interface ExportAuthorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  authors: Author[];
}

export function ExportAuthorsModal({ isOpen, onClose, authors }: ExportAuthorsModalProps) {
  if (!isOpen) return null;

  const handleExport = () => {
    const csvData = authors.map((a) => ({
      name: a.name,
      email: a.email ?? '',
      verified: a.isVerified ? 'Yes' : 'No',
      createdAt: new Date(a.createdAt ?? '').toISOString(),
    }));

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Name,Email,Verified,Created At']
        .concat(csvData.map((a) => `${a.name},${a.email},${a.verified},${a.createdAt}`))
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encodedUri;
    link.download = 'authors.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-md shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Export Authors</h2>
        <p className="text-sm mb-4">You are about to export {authors.length} authors to CSV.</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            Export
          </button>
        </div>
      </div>
    </div>
  );
}
