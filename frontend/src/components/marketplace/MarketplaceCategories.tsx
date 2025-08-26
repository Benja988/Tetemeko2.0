'use client';

import React from 'react';
import Link from 'next/link';
import { products } from '@/data/products';
import { FaBoxOpen } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface Category {
  name: string;
  slug: string;
  count: number;
  image: string;
}

export default function MarketplaceCategories() {
  const categoryMap: Record<string, number> = {};
  products.forEach((product) => {
    categoryMap[product.category] = (categoryMap[product.category] || 0) + 1;
  });

  const categories: Category[] = Object.entries(categoryMap).map(
    ([name, count]) => ({
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      count,
      image: `https://picsum.photos/seed/${name.toLowerCase()}/160/100`,
    })
  );

  return (
    <section className="py-10 px-6 md:px-12 lg:px-24 bg-primary">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-white text-3xl font-bold mb-6">Categories</h2>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4">
          {categories.map((category) => (
            <motion.div
              key={category.slug}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href={`/marketplace/category/${category.slug}`}
                className="block bg-[#0D1E2F] text-white rounded-lg overflow-hidden shadow hover:shadow-lg transition focus:outline-none focus:ring-2 focus:ring-indigo-400"
                aria-label={`View ${category.name} category`}
              >
                <img
                  src={category.image}
                  alt={`${category.name} category`}
                  className="w-full h-24 object-cover"
                  loading="lazy"
                />
                <div className="p-3 text-center">
                  <div className="flex flex-col items-center space-y-1">
                    <FaBoxOpen className="text-indigo-400 text-lg" />
                    <h3 className="font-semibold text-sm">{category.name}</h3>
                    <p className="text-xs text-gray-400">{category.count} items</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
