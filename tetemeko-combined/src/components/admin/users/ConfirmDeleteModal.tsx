// components/ConfirmDeleteModal.tsx
import { useState } from 'react';
import { deleteUser } from '@/services/users';
import Modal from './Modal';
import { toast } from 'sonner';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  userIds: string[]; // always an array, even for single user
  onDeleted?: () => void;
  message?: string;
  userNames?: string[]; // optional, to show names instead of IDs
}

export function ConfirmDeleteModal({
  isOpen,
  onClose,
  userIds,
  onDeleted,
  message,
  userNames,
}: ConfirmDeleteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      const results = await Promise.all(userIds.map(id => deleteUser(id)));
      const allSuccess = results.every(success => success);

      if (allSuccess) {
        toast.success(`${userIds.length} user(s) deleted successfully`);
        onDeleted?.();
        onClose();
      } else {
        toast.error('Failed to delete some users');
      }
    } catch (error) {
      toast.error('An error occurred while deleting');
    } finally {
      setIsDeleting(false);
    }
  };

  const count = userIds.length;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Delete">
      <p className="mb-4">
        {message ||
          (count === 1
            ? `Are you sure you want to delete ${
                userNames?.[0] || userIds[0]
              }?`
            : `Are you sure you want to delete ${count} selected users?`)}
      </p>

      {/* Show list of user names or IDs only if more than one */}
      {count > 1 && (
        <ul className="max-h-40 overflow-auto mb-4 border p-2 rounded bg-gray-50">
          {(userNames || userIds).map((item, index) => (
            <li key={userIds[index]} className="text-sm text-gray-700 break-all">
              {item}
            </li>
          ))}
        </ul>
      )}

      <div className="flex justify-end space-x-2">
        <button
          onClick={onClose}
          disabled={isDeleting}
          className="px-4 py-2 rounded border hover:bg-gray-100 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          disabled={isDeleting}
          className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </Modal>
  );
}
