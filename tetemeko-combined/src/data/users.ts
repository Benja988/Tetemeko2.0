// data/users.ts
import { UserRole } from "@/types/user";

export const mockUsers = [
  {
    _id: "1",
    name: "Alice Johnson",
    email: "alice@example.com",
    role: UserRole.ADMIN,
    isActive: true,
    isVerified: true,
  },
  {
    _id: "2",
    name: "Bob Smith",
    email: "bob@example.com",
    role: UserRole.MANAGER,
    isActive: true,
    isVerified: true,
  },
  {
    _id: "3",
    name: "Charlie Brown",
    email: "charlie@example.com",
    role: UserRole.WEB_USER,
    isActive: false,
    isVerified: false,
  },
];
