'use client';

import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { FiAlertTriangle, FiUser, FiCheck } from 'react-icons/fi';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  authors: Array<{ id: string; name: string }>;
  /** Called when user confirms delete */
  onConfirm: () => Promise<void>;
  /** Optional: allows parent to refresh data after delete */
  onDeleted?: () => Promise<void>;
  isLoading?: boolean;
}

export function ConfirmDeleteModal({
  isOpen,
  onClose,
  authors,
  onConfirm,
  onDeleted,
  isLoading = false,
}: ConfirmDeleteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();   // parent’s delete logic
      if (onDeleted) {
        await onDeleted(); // optional refresh (e.g. refetch authors)
      }
      onClose();
    } catch (error) {
      console.error('Error deleting authors:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
      aria-labelledby="delete-confirmation-title"
    >
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-lg bg-white shadow-xl">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-red-100 text-red-600">
                <FiAlertTriangle className="w-5 h-5" />
              </div>
              <Dialog.Title
                id="delete-confirmation-title"
                className="text-lg font-semibold text-gray-900"
              >
                Delete {authors.length > 1 ? `${authors.length} authors` : 'author'}
              </Dialog.Title>
            </div>

            {/* Description */}
            <Dialog.Description className="text-sm text-gray-600 mb-4">
              This action cannot be undone. The following author
              {authors.length > 1 ? 's' : ''} will be permanently removed:
            </Dialog.Description>

            {/* Authors list */}
            <ul className="max-h-40 overflow-y-auto mb-6 border rounded-lg divide-y">
              {authors.map((author) => (
                <li
                  key={author.id}
                  className="px-3 py-2 text-sm flex items-center gap-2"
                >
                  <FiUser className="text-gray-500 flex-shrink-0" />
                  <span className="truncate">{author.name}</span>
                </li>
              ))}
            </ul>

            {/* Footer buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                disabled={isLoading || isDeleting}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={isLoading || isDeleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-2 disabled:bg-red-400"
              >
                {isDeleting ? 'Deleting...' : (
                  <>
                    <FiCheck className="w-4 h-4" />
                    Confirm Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
