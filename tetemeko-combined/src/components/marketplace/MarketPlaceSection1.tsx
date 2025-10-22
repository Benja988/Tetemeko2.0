'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import { products } from '@/data/products';
import { Product } from '@/interfaces/Products';
import MarketplaceCategories from './MarketplaceCategories';
import ProductCard from './ProductCard';

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function MarketPlaceSection1() {
  const featuredProducts = useMemo(() => {
    const featured = products.filter(p => p.isFeatured);
    return shuffleArray(featured).slice(0, 5);
  }, []);

  return (
    <>
      <MarketplaceCategories />

      <section className="py-16 px-6 md:px-12 lg:px-24 bg-primary">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6 border-b border-indigo-700 pb-2">
            <h2 className="text-3xl font-bold text-white">Featured Products</h2>
            <Link
              href="/marketplace/featured"
              className="inline-flex items-center text-indigo-300 hover:text-indigo-100 font-semibold transition-colors"
            >
              Show More <FiArrowRight className="ml-2" size={20} />
            </Link>
          </div>

          <div
            className="flex overflow-x-auto space-x-4 px-2 sm:grid sm:grid-cols-2 sm:gap-6 sm:space-x-0 sm:px-0
            md:grid-cols-3 lg:grid-cols-5 scrollbar-thin scrollbar-thumb-indigo-600 scrollbar-track-indigo-900"
          >
            {featuredProducts.map((product) => (
              <div key={product.id} className="w-72 md:w-auto flex-shrink-0">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
