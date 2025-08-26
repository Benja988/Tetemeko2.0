'use client'

import { Users, Headphones, ShoppingCart, CreditCard, TrendingUp, TrendingDown } from 'lucide-react'
import { useState, useEffect } from 'react'

interface Stat {
  label: string
  value: number | string
  icon: React.ReactNode
  sub: string
  trend?: {
    value: number
    isPositive: boolean
  }
}

const statsData: Stat[] = [
  { 
    label: 'Total Users', 
    value: 12500, 
    icon: <Users className="h-6 w-6" />, 
    sub: 'Across all platforms',
    trend: { value: 12.5, isPositive: true }
  },
  { 
    label: 'Active Listeners', 
    value: 3200, 
    icon: <Headphones className="h-6 w-6" />, 
    sub: 'Currently streaming',
    trend: { value: 5.2, isPositive: true }
  },
  { 
    label: 'Orders', 
    value: 210, 
    icon: <ShoppingCart className="h-6 w-6" />, 
    sub: 'This week',
    trend: { value: 3.1, isPositive: false }
  },
  { 
    label: 'Revenue', 
    value: 'Kshs 12,430', 
    icon: <CreditCard className="h-6 w-6" />, 
    sub: 'Monthly earnings',
    trend: { value: 8.7, isPositive: true }
  },
]

export default function DashboardStats() {
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    // Simulate data fetching
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    
    return () => clearTimeout(timer)
  }, [])
  
  if (isLoading) {
    return (
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 animate-pulse">
            <div className="h-6 w-6 bg-gray-300 dark:bg-gray-700 rounded-full mb-4"></div>
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        ))}
      </section>
    )
  }
  
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 transition-all hover:shadow-md"
        >
          <div className="flex justify-between items-start">
            <div className={`p-2 rounded-lg ${
              index === 0 ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
              index === 1 ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
              index === 2 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' :
              'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
            }`}>
              {stat.icon}
            </div>
            
            {stat.trend && (
              <div className={`flex items-center text-xs font-medium ${
                stat.trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {stat.trend.isPositive ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                {stat.trend.value}%
              </div>
            )}
          </div>
          
          <div className="mt-4">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stat.value}
            </div>
            <div className="text-sm font-medium text-gray-900 dark:text-white mt-1">
              {stat.label}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {stat.sub}
            </div>
          </div>
        </div>
      ))}
    </section>
  )
}
