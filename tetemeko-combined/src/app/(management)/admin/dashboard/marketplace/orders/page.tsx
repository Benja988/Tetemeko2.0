'use client';

import { getOrders, Order, updateOrderStatus } from '@/services/orders';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await getOrders(pagination.page, pagination.limit);
      setOrders(response.orders);
      setPagination({ page: response.page, limit: response.limit, total: response.total });
    } catch (e: any) {
      toast.error(e.message || 'Failed to fetch orders.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [pagination.page]);

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      await updateOrderStatus(orderId, status);
      fetchOrders();
    } catch (e: any) {
      toast.error(e.message || 'Failed to update order status.');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Manage Orders</h1>

      {isLoading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-white">
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
              <tr>
                <th className="p-3">Order ID</th>
                <th className="p-3">User</th>
                <th className="p-3">Total Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Payment Status</th>
                <th className="p-3">Shipping Address</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-t text-sm hover:bg-gray-50 transition-all">
                  <td className="p-3">{order._id}</td>
                  <td className="p-3">{order.user}</td>
                  <td className="p-3">${order.totalAmount.toFixed(2)}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium ${
                        order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : order.status === 'paid'
                          ? 'bg-blue-100 text-blue-800'
                          : order.status === 'shipped'
                          ? 'bg-purple-100 text-purple-800'
                          : order.status === 'delivered'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium ${
                        order.paymentStatus === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : order.paymentStatus === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : order.paymentStatus === 'failed'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="p-3">
                    {order.shippingAddress.line1}, {order.shippingAddress.city}, {order.shippingAddress.country}
                    {order.shippingAddress.postalCode && `, ${order.shippingAddress.postalCode}`}
                  </td>
                  <td className="p-3">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pagination.total > pagination.limit && (
        <div className="mt-4 flex justify-between">
          <button
            disabled={pagination.page === 1}
            onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
          </span>
          <button
            disabled={pagination.page * pagination.limit >= pagination.total}
            onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}