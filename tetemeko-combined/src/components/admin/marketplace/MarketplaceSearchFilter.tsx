'use client';

interface MarketplaceSearchFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export default function MarketplaceSearchFilter({ searchTerm, onSearchChange }: MarketplaceSearchFilterProps) {
  return (
    <div className="relative mb-4">
      <input
        type="text"
        placeholder="Search products by title or category..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {searchTerm && (
        <button
          className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
          onClick={() => onSearchChange('')}
        >
          Clear
        </button>
      )}
    </div>
  );
}