'use client';

import { FiUsers, FiCheckCircle, FiClock } from 'react-icons/fi';

interface AuthorStatsProps {
  total: number;
  verified: number;
  unverified: number;
  className?: string;
}

export function AuthorStats({ total, verified, unverified, className = '' }: AuthorStatsProps) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="flex items-center gap-2 text-gray-700">
        <FiUsers className="text-gray-500" />
        <span className="text-sm font-medium">
          Total: <span className="font-bold">{total}</span>
        </span>
      </div>

      <div className="flex items-center gap-2 text-green-700">
        <FiCheckCircle className="text-green-500" />
        <span className="text-sm font-medium">
          Verified: <span className="font-bold">{verified}</span>
        </span>
      </div>

      <div className="flex items-center gap-2 text-yellow-700">
        <FiClock className="text-yellow-500" />
        <span className="text-sm font-medium">
          Pending: <span className="font-bold">{unverified}</span>
        </span>
      </div>
    </div>
  );
}