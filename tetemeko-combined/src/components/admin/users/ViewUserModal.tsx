import React, { useEffect } from "react";
import { IUser } from "@/types/user";
import { FocusTrap } from "@headlessui/react";
import Image from "next/image";

interface ViewUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: IUser | null;
}

export const ViewUserModal: React.FC<ViewUserModalProps> = ({ isOpen, onClose, user }) => {
  if (!isOpen || !user) return null;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="user-modal-title"
      onClick={onClose}
    >
      <FocusTrap>
        <div
          onClick={(e) => e.stopPropagation()}
          className="
            relative
            bg-white
            rounded-2xl
            shadow-2xl
            max-w-[90vw]
            max-h-[90vh]
            w-full
            sm:w-[800px]
            p-6
            flex
            flex-col
            border-4
            border-transparent
            bg-gradient-to-r
            from-blue-500
            via-purple-600
            to-pink-500
            bg-origin-border
            overflow-y-auto
          "
          style={{
            backgroundClip: "padding-box, border-box",
            backgroundOrigin: "padding-box, border-box",
            borderImageSlice: 1,
          }}
        >
          {/* Inner white box with padding */}
          <div className="bg-white rounded-xl p-6 flex flex-col flex-grow overflow-auto">
            <header className="flex items-center justify-between border-b border-gray-200 pb-4 mb-4">
              <h2
                id="user-modal-title"
                className="text-2xl font-semibold text-gray-900"
              >
                User Details
              </h2>
              <button
                onClick={onClose}
                aria-label="Close user details modal"
                className="text-gray-400 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </header>

            <div className="flex flex-col sm:flex-row sm:space-x-10 space-y-6 sm:space-y-0">
              {/* Avatar */}
              <div className="flex justify-center sm:justify-start flex-shrink-0">
                {user.profilePictureUrl ? (
                  <Image
                    src={user.profilePictureUrl}
                    alt={`${user.name}'s avatar`}
                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-300 shadow-md"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center text-5xl font-semibold text-blue-600 select-none border-4 border-blue-300 shadow-md">
                    {user.name?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-grow text-gray-700 text-base space-y-4">
                <div>
                  <span className="font-semibold text-gray-900">Name:</span> {user.name}
                </div>
                <div>
                  <span className="font-semibold text-gray-900">Email:</span> {user.email}
                </div>
                <div>
                  <span className="font-semibold text-gray-900">Role:</span>{" "}
                  {user.role.replace("_", " ")}
                </div>
                <div>
                  <span className="font-semibold text-gray-900">Verified:</span>{" "}
                  {user.isVerified ? "Yes" : "No"}
                </div>
                <div>
                  <span className="font-semibold text-gray-900">Status:</span>{" "}
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${user.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                      }`}
                  >
                    {user.isActive ? "Active" : "Deactivated"}
                  </span>
                </div>
                {user.createdAt && (
                  <div>
                    <span className="font-semibold text-gray-900">Created At:</span>{" "}
                    {new Date(user.createdAt).toLocaleString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                )}
                {user.updatedAt && (
                  <div>
                    <span className="font-semibold text-gray-900">Last Updated:</span>{" "}
                    {new Date(user.updatedAt).toLocaleString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                )}
              </div>
            </div>

            <footer className="mt-8 flex justify-end border-t border-gray-200 pt-4">
              <button
                onClick={onClose}
                className="inline-flex justify-center px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Close
              </button>
            </footer>
          </div>
        </div>
      </FocusTrap>
    </div>
  );
};
