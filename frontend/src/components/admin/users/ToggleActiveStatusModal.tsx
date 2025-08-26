import React from "react";
import Modal from "./Modal";
import { IUser } from "@/types/user";

interface ToggleActiveStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: IUser | null;
  onToggle: () => void;
}

export const ToggleActiveStatusModal = ({
  isOpen,
  onClose,
  user,
  onToggle,
}: ToggleActiveStatusModalProps) => {
  const action = user?.isActive ? "Deactivate" : "Activate";

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          {action} User
        </h2>
        <p className="mb-6">
          Are you sure you want to {action.toLowerCase()}{" "}
          <span className="font-semibold">{user?.name}</span>?
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
              onToggle();
              onClose();
            }}
            className={`px-4 py-2 text-white rounded ${
              user?.isActive
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {action}
          </button>
        </div>
      </div>
    </Modal>
  );
};
