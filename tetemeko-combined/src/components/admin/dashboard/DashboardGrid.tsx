'use client'

interface DashboardGridProps {
  children: React.ReactNode
}

export default function DashboardGrid({ children }: DashboardGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
      {children}
    </div>
  )
}