'use client'

import Link from 'next/link'
import { Users, PlusCircle, BarChart3, Mic, Newspaper, ShoppingBag } from 'lucide-react'

const quickLinks = [
  {
    href: '/admin/dashboard/users',
    icon: <Users className="h-5 w-5" />,
    label: 'Manage Users',
    description: 'View and manage user accounts',
    color: 'from-blue-500 to-blue-600'
  },
  {
    href: '/admin/dashboard/podcasts/create',
    icon: <Mic className="h-5 w-5" />,
    label: 'Upload Podcast',
    description: 'Create a new podcast episode',
    color: 'from-purple-500 to-purple-600'
  },
  {
    href: '/admin/dashboard/news/create',
    icon: <Newspaper className="h-5 w-5" />,
    label: 'Create News',
    description: 'Publish a news article',
    color: 'from-green-500 to-green-600'
  },
  {
    href: '/admin/dashboard/marketplace/create',
    icon: <ShoppingBag className="h-5 w-5" />,
    label: 'Add Product',
    description: 'List a new marketplace item',
    color: 'from-orange-500 to-orange-600'
  },
  {
    href: '/admin/dashboard/analytics',
    icon: <BarChart3 className="h-5 w-5" />,
    label: 'View Analytics',
    description: 'See platform performance metrics',
    color: 'from-red-500 to-red-600'
  },
]

export default function QuickLinks() {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {quickLinks.map((link, idx) => (
          <Link
            key={idx}
            href={link.href}
            className={`bg-gradient-to-r ${link.color} rounded-xl p-4 text-white shadow transition-all hover:shadow-lg hover:-translate-y-0.5`}
          >
            <div className="flex items-center justify-between mb-2">
              {link.icon}
              <PlusCircle className="h-4 w-4 opacity-80" />
            </div>
            <h3 className="font-medium text-sm mb-1">{link.label}</h3>
            <p className="text-xs opacity-80">{link.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}