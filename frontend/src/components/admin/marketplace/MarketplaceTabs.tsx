'use client';

interface MarketplaceTabsProps {
  currentFilter: string;
  onChangeFilter: (filter: string) => void;
}

const statusOptions = ['All', 'Active', 'Inactive', 'Featured'];

export default function MarketplaceTabs({ currentFilter, onChangeFilter }: MarketplaceTabsProps) {
  return (
    <div className="flex space-x-4 mb-4">
      {statusOptions.map((status) => (
        <button
          key={status}
          onClick={() => onChangeFilter(status)}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            currentFilter === status
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {status}
        </button>
      ))}
    </div>
  );
}