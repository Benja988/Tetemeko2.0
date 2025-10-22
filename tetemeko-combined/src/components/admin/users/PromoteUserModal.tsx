import React from "react";
import Modal from "./Modal";
import { IUser } from "@/types/user";

interface PromoteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: IUser | null;
  onPromote: () => void;
}

export const PromoteUserModal = ({
  isOpen,
  onClose,
  user,
  onPromote,
}: PromoteUserModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Promote User</h2>
        <p className="mb-6">
          Are you sure you want to promote{" "}
          <span className="font-semibold">{user?.name}</span> to a higher role?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onPromote();
              onClose();
            }}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Promote
          </button>
        </div>
      </div>
    </Modal>
  );
};
