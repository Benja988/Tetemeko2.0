// Enum for author roles
export enum AuthorRole {
  AUTHOR = 'author',
}

// Readable labels for UI (used in dropdowns, filters, etc.)
export const AuthorRoleLabels: Record<AuthorRole, string> = {
  [AuthorRole.AUTHOR]: 'Author',
};

// Interface for an author object
export interface Author {
  _id: string;
  name: string;
  email?: string;
  bio?: string;
  avatar?: string;
  role?: AuthorRole;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
