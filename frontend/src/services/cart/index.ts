import { apiRequest } from '@/lib/api'
import { toast } from 'sonner'

export interface CartItem {
  product: {
    _id: string
    title: string
    price: number
    discount: number
    stock: number
  }
  quantity: number
}

export interface Cart {
  _id: string
  user: string
  items: CartItem[]
  totalAmount: number
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

export const getCart = async (): Promise<Cart | null> => {
  try {
    const cart = await apiRequest<Cart>('/cart')
    return cart || { _id: '', user: '', items: [], totalAmount: 0, isActive: true, createdAt: '', updatedAt: '' }
  } catch (e: any) {
    toast.error(e.message || 'Failed to fetch cart.')
    return null
  }
}

export const addToCart = async (productId: string, quantity: number) =>
  withToast(
    () => apiRequest<Cart>('/cart/add', 'POST', { productId, quantity }),
    'Item added to cart.',
    'Failed to add to cart. Check product availability or stock.'
  )

export const removeFromCart = async (productId: string) =>
  withToast(
    () => apiRequest<Cart>(`/cart/remove/${productId}`, 'DELETE'),
    'Item removed from cart.',
    'Failed to remove from cart.'
  )