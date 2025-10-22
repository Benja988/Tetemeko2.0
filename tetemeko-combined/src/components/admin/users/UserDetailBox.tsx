// components/UserDetailBox.tsx
import { IUser as User } from "@/types/user";

interface UserDetailBoxProps {
  user: User;
  onClose: () => void;
}

export default function UserDetailBox({ user, onClose }: UserDetailBoxProps) {
  return (
    <div
      className="
        border-1 border-primary
        rounded-md
        p-4
        w-80 h-80
        bg-white
        flex flex-col
        relative
        shadow
      "
    >
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-primary hover:text-primary-dark text-lg font-bold"
        aria-label="Close user detail"
      >
        ✕
      </button>
      <h2 className="text-xl font-semibold mb-3">{user.name}</h2>
      <p className="text-sm text-gray-700 mb-1">
        <strong>Email:</strong> {user.email}
      </p>
      <p className="text-sm text-gray-700 mb-1">
        <strong>Role:</strong> {user.role}
      </p>
      <p className="text-sm text-gray-700 mb-1">
        <strong>Status:</strong> {user.isActive ? "Active" : "Inactive"}
      </p>
      <p className="text-sm text-gray-700 mb-1">
        <strong>Verified:</strong> {user.isVerified ? "Yes" : "No"}
      </p>
      <p className="text-sm text-gray-700 mb-1">
        <strong>Login Attempts:</strong> {user.failedLoginAttempts ?? 0}
      </p>
      <p className="text-sm text-gray-700 mb-1">
        <strong>Locked:</strong>{" "}
        {user.lockUntil && new Date(user.lockUntil) > new Date() ? "Yes" : "No"}
      </p>

      <button>
        open
      </button>
    </div>
  );
}
