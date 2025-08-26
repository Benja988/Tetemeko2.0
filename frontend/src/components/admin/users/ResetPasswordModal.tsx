import React from "react";
import Modal from "./Modal";
import { IUser } from "@/types/user";

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: IUser | null;
  onReset: () => void;
}

export const ResetPasswordModal = ({
  isOpen,
  onClose,
  user,
  onReset,
}: ResetPasswordModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Reset Password</h2>
        <p className="mb-6">
          This will send a password reset link to{" "}
          <span className="font-semibold">{user?.email}</span>.
          Are you sure you want to proceed?
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
              onReset();
              onClose();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Send Reset Link
          </button>
        </div>
      </div>
    </Modal>
  );
};
