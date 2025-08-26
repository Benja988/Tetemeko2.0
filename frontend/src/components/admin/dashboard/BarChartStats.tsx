'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts'
import { useState, useEffect } from 'react'

const data = [
  { name: 'Mon', podcasts: 4, fill: '#4f46e5' },
  { name: 'Tue', podcasts: 6, fill: '#6366f1' },
  { name: 'Wed', podcasts: 2, fill: '#8b5cf6' },
  { name: 'Thu', podcasts: 7, fill: '#7c3aed' },
  { name: 'Fri', podcasts: 5, fill: '#a855f7' },
  { name: 'Sat', podcasts: 3, fill: '#9333ea' },
  { name: 'Sun', podcasts: 8, fill: '#6d28d9' },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <p className="label text-gray-900 dark:text-white">{`${label} : ${payload[0].value}`}</p>
        <p className="intro text-xs text-gray-500">Podcasts uploaded</p>
      </div>
    )
  }
  return null
}

export default function BarChartStats() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
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
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Podcasts Uploaded This Week</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.3} />
          <XAxis 
            dataKey="name" 
            stroke="#6b7280" 
            fontSize={12}
          />
          <YAxis 
            stroke="#6b7280" 
            fontSize={12}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="podcasts" 
            radius={[4, 4, 0, 0]}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}