'use client';

import React from 'react';

type CategoryFilterProps = {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
};

export default function CategoryFilter({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <div className="mb-8 flex flex-wrap gap-4 justify-center">
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat;
        return (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`px-5 py-2 rounded-md border font-medium transition ${
              isSelected
                ? 'bg-indigo-600 border-indigo-600 text-white'
                : 'border-gray-300 text-gray-700 hover:bg-indigo-100'
            }`}
            aria-pressed={isSelected}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
