'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/interfaces/Products';
import { motion } from 'framer-motion';

type Props = {
  product: Product;
  index?: number;
  variant?: 'grid' | 'horizontal';
};

// Helper to check if product is "new" (added within the last `days`)
function isNewProduct(createdAt: string, days = 10): boolean {
  const productDate = new Date(createdAt);
  const today = new Date();
  const diffInDays = (today.getTime() - productDate.getTime()) / (1000 * 60 * 60 * 24);
  return diffInDays <= days;
}

export default function ProductCard({ product, index = 0, variant = 'grid' }: Props) {
  const isHorizontal = variant === 'horizontal';

  const containerClasses = isHorizontal
    ? 'flex-shrink-0 w-72 md:w-auto border border-indigo-700 rounded-lg shadow-sm hover:shadow-lg bg-[#142533] transition-shadow'
    : 'group bg-[#142533] rounded-xl shadow-lg border border-indigo-600 overflow-hidden hover:shadow-xl transition';

  return (
    <motion.article
      className={containerClasses}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link href={`/marketplace/products/${product.slug}`}>
        <figure className={`relative ${isHorizontal ? 'w-full h-48 overflow-hidden rounded-t-lg' : 'w-full h-44'}`}>
          <img
            src={product.image}
            alt={`Image of ${product.name}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {!isHorizontal && isNewProduct(product.createdAt) && (
            <figcaption className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-0.5 rounded">
              New
            </figcaption>
          )}
        </figure>

        <div className={`p-4 ${isHorizontal ? '' : 'flex flex-col justify-between h-44'}`}>
          <div>
            <h3 className="text-lg font-semibold text-white group-hover:underline">{product.name}</h3>
            <p className="text-sm text-gray-300 mt-1">
              {product.shortDescription || product.description.slice(0, 50) + '...'}
            </p>
          </div>

          <div className="mt-4 flex justify-between items-center text-sm">
            <span className="text-indigo-300 font-bold">${product.price.toFixed(2)}</span>
            <span className="text-yellow-400">⭐ {product.rating.toFixed(1)}</span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
