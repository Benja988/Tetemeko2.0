// src/services/users/index.ts

import { apiRequest } from '@/lib/api'
import { toast } from 'sonner'

/* ---------------------------------- ENUMS ---------------------------------- */

export enum UserRole {
  WEB_USER = 'web_user',
  MANAGER = 'manager',
  ADMIN = 'admin',
}

export const UserRoleLabels: Record<UserRole, string> = {
  [UserRole.WEB_USER]: 'Web User',
  [UserRole.MANAGER]: 'Manager',
  [UserRole.ADMIN]: 'Admin',
}

/* ----------------------------- INTERFACES ----------------------------- */

export interface User {
  _id: string
  name: string
  email: string
  role: UserRole
  isVerified: boolean
  isActive: boolean
  failedLoginAttempts: number
  lockUntil?: string | Date
  createdAt: string
  updatedAt: string
  profilePictureUrl?: string
}

interface PaginatedResponse<T> {
  data: T[]
  totalUsers: number
  page: number
  totalPages: number
}

/* ------------------------- TOAST HANDLER WRAPPER ------------------------ */

const withToast = async <T>(
  fn: () => Promise<T>,
  successMsg: string,
  errorMsg: string
): Promise<T | null> => {
  try {
    const result = await fn()
    toast.success(successMsg)
    return result
  } catch (e) {
    toast.error(errorMsg)
    return null
  }
}

/* ---------------------------- USER SERVICES ----------------------------- */

// Get all users (optional role filter)
export const getUsers = async (
  page = 1,
  limit = 20,
  role?: UserRole
): Promise<{
  users: User[]
  total: number
  page: number
  totalPages: number
}> => {
  const query = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  })
  if (role) query.append('role', role)

  try {
    const response = await apiRequest<PaginatedResponse<User>>(
      `/users?${query.toString()}`
    )
    return {
      users: response.data ?? [],
      total: response.totalUsers ?? 0,
      page: response.page ?? 1,
      totalPages: response.totalPages ?? 1,
    }
  } catch (error) {
    toast.error('Failed to fetch users.')
    return { users: [], total: 0, page: 1, totalPages: 1 }
  }
}

// Search users
export const searchUsers = async (query: string): Promise<User[]> => {
  try {
    const response = await apiRequest<{ results: User[] }>(
      `/users/search?query=${encodeURIComponent(query)}`
    );
    return response.results ?? [];
  } catch (error) {
    toast.error('User search failed.');
    return [];
  }
};


// Get one user
export const getUserById = async (userId: string): Promise<User | null> => {
  return withToast(
    () => apiRequest<User>(`/users/${userId}`),
    '',
    'Failed to get user.'
  )
}

// // Create new user
// export const createUser = async (
//   newUser: Pick<User, "name" | "email" | "role">
// ): Promise<User | null> => {
//   return withToast(
//     () => apiRequest<User>("/users", "POST", newUser),
//     "User created.",
//     "Failed to create user."
//   );
// };

// Update user
export const updateUser = async (
  userId: string,
  updates: Partial<Pick<User, 'name' | 'email' | 'role' | 'isActive'>>
): Promise<User | null> => {
  return withToast(
    () => apiRequest<User>(`/users/${userId}`, 'PUT', updates),
    'User updated.',
    'Update failed.'
  )
}

export const deleteUsers = async (userIds: string[]): Promise<boolean> => {
  try {
    const results = await Promise.all(
      userIds.map((id) =>
        withToast(
          () => apiRequest(`/users/${id}`, 'DELETE'),
          'User deactivated.',
          'Failed to deactivate user.'
        )
      )
    );
    return results.every(Boolean);
  } catch {
    return false;
  }
};


// Soft delete user
export const deleteUser = async (userId: string): Promise<boolean> => {
  const result = await withToast(
    () => apiRequest(`/users/${userId}`, 'DELETE'),
    'User deactivated.',
    'Failed to deactivate user.'
  )
  return !!result
}

// Lock user
export const lockUser = async (userId: string): Promise<boolean> => {
  const result = await withToast(
    () => apiRequest(`/users/${userId}/lock`, 'POST'),
    'User locked.',
    'Failed to lock user.'
  )
  return !!result
}

// Unlock user
export const unlockUser = async (userId: string): Promise<boolean> => {
  const result = await withToast(
    () => apiRequest(`/users/${userId}/unlock`, 'POST'),
    'User unlocked.',
    'Failed to unlock user.'
  )
  return !!result
}

// Admin password reset
// export const adminResetPassword = async (userId: string): Promise<boolean> => {
//   const result = await withToast(
//     () => apiRequest(`/users/${userId}/reset-password`, 'POST'),
//     'Reset email sent.',
//     'Failed to send reset email.'
//   )
//   return !!result
// }

// Reactivate user
export const reactivateUser = async (userId: string): Promise<boolean> => {
  const result = await withToast(
    () => apiRequest(`/users/${userId}/reactivate`, 'POST'),
    'User reactivated.',
    'Failed to reactivate user.'
  )
  return !!result
}

// Promote to manager
// export const promoteToManager = async (
//   userId: string
// ): Promise<User | null> => {
//   return withToast(
//     () => apiRequest<User>(`/users/${userId}/promote`, 'POST'),
//     'User promoted.',
//     'Promotion failed.'
//   )
// }


// src/services/upload.ts
export const uploadProfilePicture = async (file: File): Promise<string | null> => {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await apiRequest<{ url: string }>(
      '/upload/profile-picture',
      'POST',
      formData
    );
    return response.url;
  } catch {
    toast.error('Image upload failed');
    return null;
  }
};

// Invite multiple users by email
export const inviteUsers = async (emails: string[]): Promise<boolean> => {
  const result = await withToast(
    () => apiRequest(`/auth/invite-manager`, 'POST', { emails }),
    'Invitations sent.',
    'Failed to send invitations.'
  );
  return !!result;
};

