import { apiRequest } from '@/lib/api'
import { toast } from 'sonner'

export interface Order {
  _id: string
  user: string
  items: { product: { _id: string; title: string; price: number; discount: number }; quantity: number; price: number }[]
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded'
  totalAmount: number
  shippingAddress: {
    line1: string
    city: string
    country: string
    postalCode?: string
  }
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

export const getOrders = async (page: number = 1, limit: number = 10): Promise<{ orders: Order[]; page: number; limit: number; total: number }> => {
  try {
    const res = await apiRequest<{ orders: Order[]; page: number; limit: number; total: number }>(`/orders?page=${page}&limit=${limit}`)
    return res
  } catch (e: any) {
    toast.error(e.message || 'Failed to fetch orders.')
    return { orders: [], page, limit, total: 0 }
  }
}

export const placeOrder = async (shippingAddress: { line1: string; city: string; country: string; postalCode?: string }) =>
  withToast(
    () => apiRequest<Order>('/orders', 'POST', { shippingAddress }),
    'Order placed successfully. Check your email for confirmation.',
    'Failed to place order. Check cart or shipping details.'
  )

export const updateOrderStatus = async (id: string, status: string) =>
  withToast(
    () => apiRequest<Order>(`/orders/${id}/status`, 'PUT', { status }),
    'Order status updated.',
    'Failed to update order status.'
  )