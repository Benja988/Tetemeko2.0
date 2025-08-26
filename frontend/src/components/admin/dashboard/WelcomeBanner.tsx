'use client'

import { useState, useEffect } from 'react'

interface WelcomeBannerProps {
  user: {
    name: string
    role?: string
  }
}

export default function WelcomeBanner({ user }: WelcomeBannerProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // Update every minute
    
    return () => clearInterval(timer)
  }, [])
  
  const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const formattedDate = currentTime.toLocaleDateString([], { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
  
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Welcome back, {user.name || 'Admin'}!
          </h1>
          <p className="opacity-90">Here's what's happening with your platform today.</p>
          <p className="text-sm opacity-80 mt-2">{formattedDate} • {formattedTime}</p>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            <span>System status: Operational</span>
          </div>
        </div>
      </div>
    </div>
  )
}