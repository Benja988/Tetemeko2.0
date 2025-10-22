import React from 'react';

interface NewsStatsProps {
  total: number;
  published: number;
  unpublished: number;
}

const NewsStats: React.FC<NewsStatsProps> = ({ total, published, unpublished }) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
    <div className="bg-blue-50 p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-700">Total Articles</h3>
      <p className="text-2xl font-bold text-blue-600">{total}</p>
    </div>
    <div className="bg-green-50 p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-700">Published</h3>
      <p className="text-2xl font-bold text-green-600">{published}</p>
    </div>
    <div className="bg-yellow-50 p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-700">Unpublished</h3>
      <p className="text-2xl font-bold text-yellow-600">{unpublished}</p>
    </div>
  </div>
);

export default NewsStats;