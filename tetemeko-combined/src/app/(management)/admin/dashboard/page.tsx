// src/app/(management)/admin/dashboard/page.tsx (redesigned)
'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useAuthGuard } from '@/hooks/useAuthGuard'
import DashboardHeader from '@/components/admin/dashboard/DashboardHeader'
import DashboardStats from '@/components/admin/dashboard/DashboardStats'
import RecentActivities from '@/components/admin/dashboard/RecentActivities'
import RecentOrdersTable from '@/components/admin/dashboard/RecentOrdersTable'
import TopStationsChart from '@/components/admin/dashboard/TopStationsChart'
import QuickLinks from '@/components/admin/dashboard/QuickLinks'
import BarChartStats from '@/components/admin/dashboard/BarChartStats'
import LineChartStats from '@/components/admin/dashboard/LineChartStats'
import WelcomeBanner from '@/components/admin/dashboard/WelcomeBanner'
import DashboardGrid from '@/components/admin/dashboard/DashboardGrid'

export default function DashboardPage() {
  useAuthGuard()
  const { user, logout } = useAuth()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate initial data loading
    const timer = setTimeout(() => {
      setIsAuthenticated(true)
      setIsLoading(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])

  if (!user || !isAuthenticated || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-600 dark:text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* <DashboardHeader user={user} onLogout={logout} /> */}
      
      <main className="p-4 sm:p-6 max-w-7xl mx-auto">
        <WelcomeBanner user={user} />
        
        <QuickLinks />
        
        <DashboardStats />
        
        <DashboardGrid>
          <div className="lg:col-span-2">
            <BarChartStats />
          </div>
          <LineChartStats />
          <TopStationsChart />
          <RecentActivities />
        </DashboardGrid>
        
        <RecentOrdersTable />
      </main>
    </div>
  )
}