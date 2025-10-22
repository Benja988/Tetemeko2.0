'use client';

import { Dialog } from '@headlessui/react';
import { useState } from 'react';
import { FiCheck, FiUserCheck } from 'react-icons/fi';

interface BatchVerifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  count: number;
  onConfirm: () => Promise<void>;
  isLoading?: boolean;
}

export function BatchVerifyModal({
  isOpen,
  onClose,
  count,
  onConfirm,
  isLoading = false,
}: BatchVerifyModalProps) {
  const [isVerifying, setIsVerifying] = useState(false);

  const handleConfirm = async () => {
    setIsVerifying(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-lg bg-white shadow-xl">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                <FiUserCheck className="w-5 h-5" />
              </div>
              <Dialog.Title className="text-lg font-semibold text-gray-900">
                Verify {count} Author{count !== 1 ? 's' : ''}
              </Dialog.Title>
            </div>

            <Dialog.Description className="text-sm text-gray-600 mb-6">
              Are you sure you want to verify {count} selected author{count !== 1 ? 's' : ''}? 
              This will mark them as verified in the system.
            </Dialog.Description>

            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                disabled={isLoading || isVerifying}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={isLoading || isVerifying}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2 disabled:bg-blue-400"
              >
                {isVerifying ? (
                  'Verifying...'
                ) : (
                  <>
                    <FiCheck className="w-4 h-4" />
                    Confirm Verification
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