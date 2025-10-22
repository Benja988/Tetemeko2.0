// src/components/admin/Navbar.tsx
'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  Bell, 
  Settings, 
  LogOut, 
  User, 
  Moon, 
  Sun, 
  Menu,
  ChevronDown,
  type LucideIcon
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

interface NavbarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export default function Navbar({ sidebarOpen, setSidebarOpen }: NavbarProps) {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(3)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { user, logout } = useAuth()

  useEffect(() => {
    setMounted(true)
    // Check if dark mode is enabled
    const isDark = document.documentElement.classList.contains('dark')
    setIsDarkMode(isDark)
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  const notificationItems = [
    {
      id: 1,
      title: 'New user registered',
      description: 'A new user has joined the platform',
      time: '2 mins ago',
      icon: User,
      color: 'text-blue-500'
    },
    {
      id: 2,
      title: 'Podcast uploaded',
      description: 'New podcast "Tech Talk" has been uploaded',
      time: '30 mins ago',
      icon: Bell,
      color: 'text-purple-500'
    },
    {
      id: 3,
      title: 'Order completed',
      description: 'Order #1234 has been completed successfully',
      time: '1 hour ago',
      icon: Settings,
      color: 'text-green-500'
    }
  ]

  if (!mounted) {
    return (
      <header className="sticky top-0 z-30 bg-white dark:bg-gray-900 shadow-sm h-16 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between h-full px-4">
          <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="flex items-center space-x-4">
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-gray-900 shadow-sm h-16 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left side - Menu button and search */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors lg:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search..."
              className="w-64 pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
        </div>
        
        {/* Right side actions */}
        <div className="flex items-center space-x-3">
          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5 text-yellow-500" />
            ) : (
              <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>
          
          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowNotificationsDropdown(!showNotificationsDropdown)
                setShowProfileDropdown(false)
              }}
              className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>
            
            {showNotificationsDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50 border border-gray-200 dark:border-gray-700">
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notificationItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <div
                        key={item.id}
                        className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-full bg-gray-100 dark:bg-gray-700 ${item.color}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {item.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {item.description}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                              {item.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                  <button className="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:underline">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Settings */}
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <Settings className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
          
          {/* Profile dropdown */}
          <div className="relative">
            <button 
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => {
                setShowProfileDropdown(!showProfileDropdown)
                setShowNotificationsDropdown(false)
              }}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.name || 'Admin'}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.email || 'Administrator'}
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>
            
            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                <button className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full">
                  <User className="h-4 w-4 mr-2" />
                  Your Profile
                </button>
                <button className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </button>
                <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                <button 
                  onClick={logout}
                  className="flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 w-full"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}