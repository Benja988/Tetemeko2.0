'use client';

import React, { useState } from 'react';

type SidebarFiltersProps = {
  categories: string[];
  brands: string[];
  onFilterChange: (filters: {
    categories: string[];
    brands: string[];
    priceRange: [number, number];
  }) => void;
};

export default function SidebarFilters({ categories, brands, onFilterChange }: SidebarFiltersProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1000);

  const handleApplyFilters = () => {
    onFilterChange({
      categories: selectedCategories,
      brands: selectedBrands,
      priceRange: [minPrice, maxPrice],
    });
  };

  return (
    <aside className="w-full md:w-64 bg-primary rounded-lg p-4 text-white space-y-6 overflow-y-auto">
      <div>
        <h3 className="text-lg font-bold mb-2">Categories</h3>
        {categories.map((cat) => (
          <label key={cat} className="block">
            <input
              type="checkbox"
              checked={selectedCategories.includes(cat)}
              onChange={() =>
                setSelectedCategories((prev) =>
                  prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
                )
              }
              className="mr-2"
            />
            {cat}
          </label>
        ))}
      </div>

      <div>
        <h3 className="text-lg font-bold mb-2">Brands</h3>
        {brands.map((brand) => (
          <label key={brand} className="block">
            <input
              type="checkbox"
              checked={selectedBrands.includes(brand)}
              onChange={() =>
                setSelectedBrands((prev) =>
                  prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
                )
              }
              className="mr-2"
            />
            {brand}
          </label>
        ))}
      </div>

      <div>
        <h3 className="text-lg font-bold mb-2">Price Range ($)</h3>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            className="w-full p-1 text-black rounded"
            value={minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value))}
          />
          <span>-</span>
          <input
            type="number"
            className="w-full p-1 text-black rounded"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>
      </div>

      <button
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded"
        onClick={handleApplyFilters}
      >
        Apply Filters
      </button>
    </aside>
  );
}
