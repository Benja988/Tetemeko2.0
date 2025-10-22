'use client'

import { Radio, Tv, Users } from 'lucide-react'
import { useState, useEffect } from 'react'

const stations = [
  { name: 'Radio Piny Luo', listeners: 1200, icon: <Radio className="w-5 h-5" />, growth: 12 },
  { name: 'Tetemeko TV', listeners: 900, icon: <Tv className="w-5 h-5" />, growth: 8 },
  { name: 'Tetemeko Radio', listeners: 600, icon: <Radio className="w-5 h-5" />, growth: -3 },
  { name: 'Luo FM', listeners: 450, icon: <Radio className="w-5 h-5" />, growth: 5 },
  { name: 'Joluo News', listeners: 300, icon: <Tv className="w-5 h-5" />, growth: 15 },
]

export default function TopStationsChart() {
  const [isLoading, setIsLoading] = useState(true)
  const maxListeners = Math.max(...stations.map((s) => s.listeners))

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 900)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md transition-colors duration-200">
        <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-6 animate-pulse"></div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index}>
              <div className="flex justify-between mb-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full animate-pulse"></div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md transition-colors duration-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Top Stations</h2>
        <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
          View all
        </button>
      </div>
      
      <div className="space-y-6">
        {stations.map((station) => (
          <div key={station.name}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  {station.icon}
                </div>
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">{station.name}</span>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <Users className="w-3 h-3 mr-1" />
                    {station.listeners.toLocaleString()} listeners
                  </div>
                </div>
              </div>
              <div className={`text-xs font-medium ${station.growth >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {station.growth >= 0 ? '+' : ''}{station.growth}%
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-700"
                style={{ width: `${(station.listeners / maxListeners) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
