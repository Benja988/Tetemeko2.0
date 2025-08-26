import { apiRequest } from '@/lib/api'
import { toast } from 'sonner'

export interface Store {
  _id: string
  name: string
  description?: string
  owner: string
  logo?: string
  address: {
    line1: string
    city: string
    state?: string
    country: string
    postalCode?: string
  }
  isVerified: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}

const withToast = async <T>(fn: () => Promise<T>, successMsg: string, errorMsg: string): Promise<T | null> => {
  try {
    const result = await fn()
    toast.success(successMsg)
    return result
  } catch (e: any) {
    toast.error(e.message || errorMsg)
    return null
  }
}

export const getStores = async (page: number = 1, limit: number = 10): Promise<{ stores: Store[]; page: number; limit: number; total: number }> => {
  try {
    const res = await apiRequest<{ stores: Store[]; page: number; limit: number; total: number }>(`/stores?page=${page}&limit=${limit}`)
    return res
  } catch (e: any) {
    toast.error(e.message || 'Failed to fetch stores.')
    return { stores: [], page, limit, total: 0 }
  }
}

export const createStore = async (data: Partial<Store>, logo?: File): Promise<Store | null> => {
  const formData = new FormData()
  Object.entries(data).forEach(([key, value]) => {
    if (key === 'address' && value) {
      Object.entries(value).forEach(([addrKey, addrValue]) => {
        if (addrValue) formData.append(`address[${addrKey}]`, String(addrValue))
      })
    } else if (value !== undefined) {
      formData.append(key, String(value))
    }
  })
  if (logo) {
    formData.append('logo', logo)
  }

  return withToast(
    () => apiRequest<Store>('/stores', 'POST', formData),
    'Store created successfully.',
    'Failed to create store.'
  )
}

export const updateStore = async (id: string, data: Partial<Store>, logo?: File): Promise<Store | null> => {
  const formData = new FormData()
  Object.entries(data).forEach(([key, value]) => {
    if (key === 'address' && value) {
      Object.entries(value).forEach(([addrKey, addrValue]) => {
        if (addrValue) formData.append(`address[${addrKey}]`, String(addrValue))
      })
    } else if (value !== undefined) {
      formData.append(key, String(value))
    }
  })
  if (logo) {
    formData.append('logo', logo)
  }

  return withToast(
    () => apiRequest<Store>(`/stores/${id}`, 'PUT', formData),
    'Store updated successfully.',
    'Failed to update store.'
  )
}

export const deleteStore = async (id: string): Promise<boolean | null> =>
  withToast(
    async () => {
      await apiRequest(`/stores/${id}`, 'DELETE')
      return true
    },
    'Store deleted successfully.',
    'Failed to delete store.'
  )
