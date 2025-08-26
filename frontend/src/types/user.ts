// src/types/user.ts

export enum UserRole {
  ADMIN = "admin",
  MANAGER = "manager",
  WEB_USER = "web_user",
}

// Main user interface aligned with backend
export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  isVerified: boolean;
  failedLoginAttempts: number; // Ensure this is always a number
  lockUntil?: string | Date;   // Optional in case user is not locked
  createdAt: string;
  updatedAt: string;

  profilePictureUrl?: string;
}

// Props for the user table component
export interface UserTableProps {
  users: IUser[];
  search: string;
  filter: string;
}
