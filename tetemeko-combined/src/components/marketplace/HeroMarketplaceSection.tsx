'use client';

import React from 'react';
import Breadcrumbs from '@/components/Breadcrumbs';
import { motion } from 'framer-motion';

export default function HeroMarketplaceSection() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Marketplace' },
  ];

  return (
    <section className="py-20 px-6 md:px-12 lg:px-24 bg-primary text-white">
      <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center gap-10">
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 text-center md:text-left"
        >
          <Breadcrumbs items={breadcrumbItems} />

          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
            Discover Unique Products from Tetemeko Marketplace
          </h1>
          <p className="text-lg mb-8 max-w-xl mx-auto md:mx-0 text-gray-300">
            Explore our curated collection of branded merchandise, audio equipment, digital media, and more — all tailored for broadcasters and content creators.
          </p>
          <button
            type="button"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-md transition focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            Shop Now
          </button>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 max-w-md mx-auto md:max-w-full"
        >
          <img
            src="https://picsum.photos/seed/07131F/600/400"
            alt="Marketplace Hero Banner"
            className="rounded-lg shadow-lg mx-auto border-4 border-indigo-600 bg-primary"
          />
        </motion.div>
      </div>
    </section>
  );
}
