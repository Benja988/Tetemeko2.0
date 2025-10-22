'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useState, useEffect } from 'react'

const data = [
  { day: 'Mon', users: 120 },
  { day: 'Tue', users: 200 },
  { day: 'Wed', users: 150 },
  { day: 'Thu', users: 250 },
  { day: 'Fri', users: 180 },
  { day: 'Sat', users: 300 },
  { day: 'Sun', users: 280 },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <p className="label text-gray-900 dark:text-white">{`${label} : ${payload[0].value}`}</p>
        <p className="intro text-xs text-gray-500">Active users</p>
      </div>
    )
  }
  return null
}

export default function LineChartStats() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1200)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
        <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4 animate-pulse"></div>
        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md transition-colors duration-200">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Active Users This Week</h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.3} />
          <XAxis 
            dataKey="day" 
            stroke="#6b7280" 
            fontSize={12}
          />
          <YAxis 
            stroke="#6b7280" 
            fontSize={12}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="users" 
            stroke="#8b5cf6" 
            strokeWidth={2}
            dot={{ r: 4, fill: '#8b5cf6' }}
            activeDot={{ r: 6, fill: '#7c3aed' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}