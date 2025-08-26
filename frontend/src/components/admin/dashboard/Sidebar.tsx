// src/components/admin/Sidebar.tsx
'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  User,
  Radio,
  Newspaper,
  FileText,
  Mic,
  Tag,
  ShoppingBag,
  Package,
  ShoppingCart,
  Megaphone,
  Settings,
  Layout,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  LogOut,
  HelpCircle,
  Search,
  BarChart3,
  type LucideIcon
} from 'lucide-react'
import { navItems, type NavItem } from '@/data/sidebar'
import { useAuth } from '@/context/AuthContext'

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({})
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const pathname = usePathname()
  const sidebarRef = useRef<HTMLDivElement>(null)
  const { user, logout } = useAuth()

  // Initialize submenus
  useEffect(() => {
    const initialSubmenus: Record<string, boolean> = {}
    navItems.forEach((item) => {
      if (item.subItems) {
        initialSubmenus[item.label] = item.subItems.some(
          (sub) => pathname === sub.href
        )
      }
    })
    setOpenSubmenus(initialSubmenus)
    setMounted(true)
  }, [pathname])

  const toggleSubmenu = useCallback((label: string) => {
    setOpenSubmenus((prev) => ({ ...prev, [label]: !prev[label] }))
  }, [])

  // Close sidebar when clicking outside or pressing Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, setIsOpen])

  const iconMap: Record<string, LucideIcon> = {
    Dashboard: LayoutDashboard,
    Users: Users,
    'Registered Users': User,
    Authors: User,
    Stations: Radio,
    News: Newspaper,
    'All News': FileText,
    'Create News': FileText,
    Podcasts: Mic,
    'All Podcasts': Mic,
    'Create Podcast': Mic,
    Categories: Tag,
    Marketplace: ShoppingBag,
    'All Products': Package,
    'Add Product': Package,
    Orders: ShoppingCart,
    Ads: Megaphone,
    'All Ads': Megaphone,
    'Create Ad': Megaphone,
    'Ad Campaigns': BarChart3,
    Settings: Settings,
    General: Settings,
    Appearance: Layout,
  }

  const getIcon = (label: string) => {
    const IconComponent = iconMap[label] || HelpCircle
    return <IconComponent className="w-5 h-5 flex-shrink-0" />
  }

  const isCollapsed = collapsed && !isHovering

  // Filter nav items based on search query
  const filteredNavItems = searchQuery
    ? navItems.filter(item =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subItems?.some(sub =>
          sub.label.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : navItems

  if (!mounted) {
    return (
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 lg:static lg:inset-0">
        <div className="flex items-center justify-between p-4 h-16">
          <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col border-r transition-all duration-300 ease-in-out
          bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-200 dark:border-gray-800
          ${isOpen ? 'translate-x-0 shadow-2xl w-64' : '-translate-x-full w-0'}
          lg:translate-x-0 lg:static lg:inset-0
          ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
        `}
        role="navigation"
        aria-label="Admin Sidebar"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b h-16 dark:border-gray-800">
          {!isCollapsed ? (
            <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
              <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Tetemeko</h2>
              <span className="text-xs px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                v1.0.0
              </span>
            </div>
          ) : (
            <div className="w-8 h-8 flex items-center justify-center bg-blue-600 rounded-lg">
              <span className="text-xl font-bold text-white">T</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors hidden lg:block"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors lg:hidden"
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Search bar */}
        {!isCollapsed && (
          <div className="p-4 border-b dark:border-gray-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search navigation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>
        )}

        {/* User Profile */}
        {!isCollapsed && user && (
          <div className="p-4 border-b dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-white truncate">{user.name || 'Admin User'}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user.email || 'Administrator'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {filteredNavItems.length > 0 ? (
              filteredNavItems.map((item) => {
                const isActive = pathname === item.href
                const hasActiveChild = item.subItems?.some(
                  (sub) => pathname === sub.href
                )
                const Icon = getIcon(item.label)

                if (isCollapsed) {
                  return (
                    <li key={item.href}>
                      <Link href={item.href} prefetch onClick={() => setIsOpen(false)}>
                        <div
                          className={`
                            w-full h-10 flex items-center justify-center rounded-lg
                            transition-colors relative group cursor-pointer
                            ${isActive ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' : 
                              'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300'}
                          `}
                        >
                          {Icon}
                          {isActive && (
                            <span className="absolute left-0 w-1 h-6 bg-blue-600 dark:bg-blue-400 rounded-r-full" />
                          )}
                          <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                            {item.label}
                          </span>
                        </div>
                      </Link>
                    </li>
                  )
                }

                return (
                  <li key={item.href}>
                    <div
                      className={`
                        flex items-center justify-between rounded-lg
                        transition-colors
                        ${isActive || hasActiveChild
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'}
                      `}
                    >
                      <Link href={item.href} prefetch onClick={() => setIsOpen(false)} className="flex-grow">
                        <div
                          className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium cursor-pointer"
                        >
                          {Icon}
                          <span className="text-left">{item.label}</span>
                        </div>
                      </Link>
                      {item.subItems && (
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            toggleSubmenu(item.label)
                          }}
                          className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                          aria-label={`Toggle ${item.label} submenu`}
                        >
                          {openSubmenus[item.label] ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>
                    {item.subItems && openSubmenus[item.label] && (
                      <div className="ml-8 mt-1 space-y-1 overflow-hidden">
                        {item.subItems.map((sub) => {
                          const isSubActive = pathname === sub.href
                          return (
                            <Link key={sub.href} href={sub.href} prefetch onClick={() => setIsOpen(false)}>
                              <div
                                className={`
                                  flex items-center gap-3 px-3 py-2 text-sm rounded-md cursor-pointer
                                  transition-colors
                                  ${isSubActive
                                    ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-medium'
                                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'}
                                `}
                              >
                                {getIcon(sub.label)}
                                <span>{sub.label}</span>
                              </div>
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </li>
                )
              })
            ) : (
              <li className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 text-center">
                No results found
              </li>
            )}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t dark:border-gray-800">
          {!isCollapsed ? (
            <div className="space-y-2">
              <button
                className="flex items-center gap-3 px-3 py-2 w-full rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300 text-sm font-medium"
              >
                <HelpCircle className="h-4 w-4" />
                <span>Help & Support</span>
              </button>
              <button
                onClick={logout}
                className="flex items-center gap-3 px-3 py-2 w-full rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-red-600 dark:text-red-400 text-sm font-medium"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <button
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300 group relative"
                aria-label="Help & Support"
              >
                <HelpCircle className="h-4 w-4" />
                <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                  Help & Support
                </span>
              </button>
              <button
                onClick={logout}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-red-600 dark:text-red-400 group relative"
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4" />
                <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                  Sign Out
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`
          fixed top-4 left-4 z-40 p-2 rounded-lg shadow-md transition-colors
          bg-white dark:bg-gray-800 text-gray-700 dark:text-white border border-gray-200 dark:border-gray-700
          hover:bg-gray-50 dark:hover:bg-gray-700
          lg:hidden
        `}
        aria-label="Open sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>
    </>
  )
}
