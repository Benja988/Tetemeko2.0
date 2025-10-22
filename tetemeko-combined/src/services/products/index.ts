import { apiRequest } from '@/lib/api'
import { toast } from 'sonner'

export interface Product {
  _id: string
  title: string
  slug: string
  description: string
  images: string[]
  price: number
  discount: number
  stock: number
  category: string
  categoryType: 'marketplace'
  tags: string[]
  seller: string
  status: 'active' | 'inactive'
  isFeatured: boolean
  createdBy: string
  updatedBy?: string
  createdAt: string
  updatedAt: string
}

export interface ProductFilter {
  category?: string
  store?: string
  featured?: boolean
  page?: number
  limit?: number
  query?: string     
  status?: 'active' | 'inactive'
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

// Get all products with filters and pagination
export const getProducts = async (filters: ProductFilter = {}): Promise<{ products: Product[]; page: number; limit: number; total: number }> => {
  try {
    const query = new URLSearchParams()
    if (filters.category) query.append('category', filters.category)
    if (filters.store) query.append('store', filters.store)
    if (filters.featured !== undefined) query.append('featured', String(filters.featured))
    if (filters.page) query.append('page', String(filters.page))
    if (filters.limit) query.append('limit', String(filters.limit))

    const res = await apiRequest<{ products: Product[]; page: number; limit: number; total: number }>(`/products?${query.toString()}`)
    return res
  } catch (e: any) {
    toast.error(e.message || 'Failed to fetch products.')
    return { products: [], page: 1, limit: 10, total: 0 }
  }
}

// Get single product
export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    return await apiRequest<Product>(`/products/${id}`)
  } catch (e: any) {
    toast.error(e.message || 'Failed to fetch product.')
    return null
  }
}

// Create product with image upload
export const createProduct = async (
  data: Partial<Product>,
  files?: File[]
): Promise<Product | null> => {
  const formData = new FormData()

  Object.entries(data).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((val, index) => formData.append(`${key}[${index}]`, val))
    } else if (value !== undefined && value !== null) {
      formData.append(key, String(value))
    }
  })

  if (files) {
    files.forEach(file => formData.append('images', file))
  }

  return withToast(
    () => apiRequest<Product>('/products', 'POST', formData),
    'Product created successfully.',
    'Failed to create product.'
  )
}


// Update product with image upload
export const updateProduct = async (id: string, data: Partial<Product>, files?: File[]): Promise<Product | null> => {
  const formData = new FormData()
  Object.entries(data).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((val, index) => formData.append(`${key}[${index}]`, val))
    } else if (value !== undefined) {
      formData.append(key, String(value))
    }
  })
  if (files) {
    files.forEach(file => formData.append('images', file))
  }

  return withToast(
    () => apiRequest<Product>(`/products/${id}`, 'PATCH', formData),
    'Product updated successfully.',
    'Failed to update product.'
  )
}

// Delete product
export const deleteProduct = async (id: string): Promise<boolean> => {
  const result = await withToast(
    async () => {
      await apiRequest(`/products/${id}`, 'DELETE')
      return true
    },
    'Product deleted successfully.',
    'Failed to delete product.'
  )
  return result ?? false
}

// Search products
export const searchProducts = async (query: string): Promise<Product[]> => {
  if (!query.trim()) {
    toast.error('Search query cannot be empty.')
    return []
  }
  try {
    return await apiRequest<Product[]>(`/products/search?query=${encodeURIComponent(query)}`)
  } catch (e: any) {
    toast.error(e.message || 'Failed to search products.')
    return []
  }
}