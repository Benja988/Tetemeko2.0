'use client'

import { useState, useEffect } from 'react'

const orders = [
  { id: '#1234', customer: 'John Doe', amount: 'Kshs 15,000', status: 'Completed', date: '2023-04-15' },
  { id: '#1235', customer: 'Jane Smith', amount: 'Kshs 7,500', status: 'Pending', date: '2023-04-14' },
  { id: '#1236', customer: 'Alice Johnson', amount: 'Kshs 32,000', status: 'Shipped', date: '2023-04-14' },
  { id: '#1237', customer: 'Bob Williams', amount: 'Kshs 9,800', status: 'Processing', date: '2023-04-13' },
  { id: '#1238', customer: 'Charlie Brown', amount: 'Kshs 24,500', status: 'Completed', date: '2023-04-12' },
]

const statusColors: Record<string, string> = {
  Completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  Shipped: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  Processing: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  Cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
}

export default function RecentOrdersTable() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md transition-colors duration-200">
        <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6 animate-pulse"></div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="py-3 px-4 text-left"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div></th>
                <th className="py-3 px-4 text-left"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div></th>
                <th className="py-3 px-4 text-left"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div></th>
                <th className="py-3 px-4 text-left"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div></th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="border-t border-gray-200 dark:border-gray-700">
                  <td className="py-3 px-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div></td>
                  <td className="py-3 px-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div></td>
                  <td className="py-3 px-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div></td>
                  <td className="py-3 px-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md transition-colors duration-200 mt-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Orders</h2>
        <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
          View all orders
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700/30">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Order ID
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Customer
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Amount
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Date
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-150">
                <td className="py-3 px-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {order.id}
                </td>
                <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {order.customer}
                </td>
                <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {order.amount}
                </td>
                <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {order.date}
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}