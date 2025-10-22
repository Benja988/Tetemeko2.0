// src/services/authors/index.ts

import { apiRequest } from '@/lib/api'
import { toast } from 'sonner'

/* ---------------------------------- ENUMS ---------------------------------- */

export enum AuthorRole {
  AUTHOR = 'author',
}

export const AuthorRoleLabels: Record<AuthorRole, string> = {
  [AuthorRole.AUTHOR]: 'Author',
}

/* ----------------------------- INTERFACES ----------------------------- */

export interface Author {
  _id: string
  name: string
  email?: string
  bio?: string
  avatar?: string
  role: AuthorRole
  isVerified: boolean
  createdAt: string
  updatedAt: string
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
  } catch (e: any) {
    toast.error(e.message || errorMsg)
    return null
  }
}

/* ---------------------------- AUTHOR SERVICES ----------------------------- */

// Get all authors
export const getAuthors = async (): Promise<Author[]> => {
  try {
    const res = await apiRequest<{ authors: Author[], pagination: any }>('/authors');
    return res.authors;
  } catch (e: any) {
    toast.error(e.message || 'Failed to fetch authors.')
    return []
  }
}


// Get single author
export const getAuthorById = async (id: string): Promise<Author | null> => {
  try {
    return await apiRequest<Author>(`/authors/${id}`)
  } catch (e: any) {
    toast.error(e.message || 'Failed to fetch author.')
    return null
  }
}

// Create author
export const createAuthor = async (data: Partial<Author>): Promise<Author | null> =>
  withToast(
    () => apiRequest<Author>('/authors', 'POST', data),
    'Author created successfully.',
    'Failed to create author.'
  )

  // Search authors by query string (name or email)
export const searchAuthors = async (query: string): Promise<Author[]> => {
  if (!query.trim()) {
    toast.error('Search query cannot be empty.')
    return []
  }

  try {
    return await apiRequest<Author[]>(`/authors/search?query=${encodeURIComponent(query)}`)
  } catch (e: any) {
    toast.error(e.message || 'Failed to search authors.')
    return []
  }
}


// Update author
export const updateAuthor = async (
  id: string,
  data: Partial<Author>
): Promise<Author | null> =>
  withToast(
    () => apiRequest<Author>(`/authors/${id}`, 'PATCH', data),
    'Author updated successfully.',
    'Failed to update author.'
  )

// Delete author
export const deleteAuthor = async (id: string): Promise<boolean> => {
  const result = await withToast(
    async () => {
      await apiRequest(`/authors/${id}`, 'DELETE')
      return true
    },
    'Author deleted successfully.',
    'Failed to delete author.'
  )

  return result ?? false // Ensure you always return a boolean
}


// Verify author
export const verifyAuthor = async (id: string): Promise<Author | null> =>
  withToast(
    () => apiRequest<Author>(`/authors/${id}/verify`, 'PATCH'),
    'Author verified successfully.',
    'Failed to verify author.'
  )
