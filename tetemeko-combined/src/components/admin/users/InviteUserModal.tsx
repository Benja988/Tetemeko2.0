import React, { useState } from "react";
import { inviteUsers } from "@/services/users"; // Import the service function

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (emails: string[]) => void;
}

export const InviteUserModal: React.FC<InviteUserModalProps> = ({
  isOpen,
  onClose,
  onInvite,
}) => {
  const [emails, setEmails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const emailList = emails
      .split(",")
      .map(email => email.trim())
      .filter(Boolean);

    if (emailList.length === 0) return;

    setIsSubmitting(true);

    try {
      await inviteUsers(emailList); // Call backend service
      onInvite(emailList);
      setEmails("");
      onClose();
    } catch (err) {
      // error toast is handled in the service
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md">
        <div className="px-4 py-3 border-b font-semibold text-lg">Invite Users</div>
        <div className="p-4">
          <label className="block text-sm font-medium mb-2">
            Email addresses (comma separated)
          </label>
          <textarea
            className="w-full border rounded px-3 py-2"
            rows={3}
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
        <div className="flex justify-end p-4 border-t gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:underline"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};
