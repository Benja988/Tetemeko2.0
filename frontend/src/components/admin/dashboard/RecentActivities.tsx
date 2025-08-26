'use client'

import {
  UserIcon,
  MicIcon,
  ShoppingBagIcon,
  CreditCardIcon,
  MessageCircleIcon,
  SendIcon,
  Clock,
} from 'lucide-react'
import { useState, useEffect } from 'react'

type ActivityType = 'user' | 'podcast' | 'order' | 'payment' | 'comment' | 'send'

interface Activity {
  activity: string
  time: string
  type: ActivityType
}

const activities: Activity[] = [
  { activity: 'New user registered', time: '2 mins ago', type: 'user' },
  { activity: 'Podcast "Tech Talk" uploaded', time: '30 mins ago', type: 'podcast' },
  { activity: 'Order #1235 placed', time: '1 hour ago', type: 'order' },
  { activity: 'Payment received from user #0987', time: '3 hours ago', type: 'payment' },
  { activity: 'New comment on episode "Marketing 101"', time: '6 hours ago', type: 'comment' },
  { activity: 'Newsletter campaign sent', time: '1 day ago', type: 'send' },
]

const activityIcons: Record<ActivityType, { icon: React.ElementType; color: string }> = {
  user: { icon: UserIcon, color: 'bg-blue-500' },
  podcast: { icon: MicIcon, color: 'bg-purple-500' },
  order: { icon: ShoppingBagIcon, color: 'bg-orange-500' },
  payment: { icon: CreditCardIcon, color: 'bg-green-500' },
  comment: { icon: MessageCircleIcon, color: 'bg-yellow-500' },
  send: { icon: SendIcon, color: 'bg-pink-500' },
}

export default function RecentActivities() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md transition-colors duration-200">
        <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-6 animate-pulse"></div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md transition-colors duration-200">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Recent Activities</h2>

      <div className="space-y-4">
        {activities.slice(0, 5).map((item, idx) => {
          const { icon: Icon, color } = activityIcons[item.type]

          return (
            <div
              key={idx}
              className="flex items-start space-x-3 group p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${color} text-white`}>
                <Icon className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.activity}</p>
                <div className="flex items-center mt-1">
                  <Clock className="w-3 h-3 text-gray-400 mr-1" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">{item.time}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <button className="w-full mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline text-center">
        View all activities
      </button>
    </section>
  )
}
