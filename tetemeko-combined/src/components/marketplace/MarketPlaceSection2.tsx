'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { products } from '@/data/products';
import { Product } from '@/interfaces/Products';
import ProductCard from './ProductCard';

function shuffle<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function MarketPlaceSection2() {
  const [visibleCount] = useState(4);

  const shuffledProducts = useMemo(() => {
    const sorted = [...products].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return shuffle(sorted);
  }, []);

  const visibleProducts = shuffledProducts.slice(0, visibleCount);

  return (
    <section className="bg-primary py-16 px-4 md:px-10 font-poppins">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 border border-white rounded-xl overflow-hidden p-6 lg:p-10 gap-10">
        {/* LEFT */}
        <div className="flex flex-col justify-between space-y-6 border-b border-white pb-8 lg:pb-0 lg:border-b-0 lg:border-r lg:pr-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">Fresh Picks</h2>
            <p className="mt-3 text-sm md:text-base text-gray-300 leading-relaxed max-w-md">
              Explore a curated collection of our newest and most exciting items — hand-selected by our team to bring you the best of what’s trending.
            </p>
          </motion.div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {visibleProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Link
              href="/marketplace/products"
              className="inline-flex items-center justify-center text-indigo-400 hover:text-indigo-300 font-semibold transition underline-offset-4 hover:underline"
            >
              Browse All <FiArrowRight className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
