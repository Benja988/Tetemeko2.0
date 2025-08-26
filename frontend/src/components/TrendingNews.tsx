'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FiCalendar, FiClock, FiArrowRight } from 'react-icons/fi';
import { News } from '@/interfaces/News';
import { getRecentNews, getFeaturedNews } from '@/services/news/newsService';
import { slugify } from '@/utils/slugify';
import { getCategories } from '@/services/categories/categoryService';

type NewsCardProps = {
  item: News;
  isFeatured: boolean;
  index: number;
  
};

const NewsCard = React.memo(({ item, isFeatured, index }: NewsCardProps) => {
  const getImage = (news: News) =>
    news.thumbnail || news.featuredImage || '/placeholder.jpg';

  return (
    <div
      key={item._id}
      className={`border-b border-gray-800 ${!isFeatured ? (index % 2 === 0 ? 'bg-[#121923]' : 'bg-[#0D121C]') : ''}`}
    >
      <Link href={`/news/article/${slugify(item.title)}-${item._id}`} className="group block p-6">
        <div className="flex gap-4">
          <div className="flex-shrink-0 relative w-20 h-20 rounded-md overflow-hidden border border-gray-800">
            <Image
              src={getImage(item)}
              alt={item.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform"
            />
          </div>
          <div>
            <span className="inline-block px-2 py-0.5 text-xs font-medium bg-gray-800 text-gray-300 rounded mb-2">
              {/* {typeof item.category === 'string' ? item.category : item.category?.name ?? 'Uncategorized'} */}
            </span>
            <h4 className="text-sm font-bold text-white mb-1 line-clamp-2 group-hover:text-blue-400 transition-colors">
              {item.title}
            </h4>
            <div className="flex items-center gap-2 text-gray-400 text-xs">
              <span>
                {item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                  : 'Unknown Date'}
              </span>
              <span>•</span>
              <span>{item.readingTime || '5 min read'}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
});

export default function TrendingNews() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [newsItems, setNewsItems] = useState<News[]>([]);
  // const [categories, setCategories] = useState<string[]>(['All']);
  const [categories, setCategories] = useState<string[]>([]);


  useEffect(() => {
    const fetchNewsAndCategories = async () => {
      const [recentRes, featuredRes, categoryList] = await Promise.all([
        getRecentNews(5),
        getFeaturedNews(),
        getCategories('news')
      ]);

      const allNews = [
        ...(recentRes || []),
        ...(featuredRes || []).filter(
          (item) => !recentRes?.some((recent) => recent._id === item._id)
        ),
      ].slice(0, 5);

      setNewsItems(allNews);

      // Build ID → Name map
      if (categoryList) {
        const names = categoryList.map((cat: any) => cat.name);
        setCategories(["All", ...names]);
      }
    };

    fetchNewsAndCategories();
  }, []);

  const filteredNews = activeCategory === 'All'
    ? newsItems
    : newsItems.filter(
      (item) => (typeof item.category === 'string' ? item.category : item.category?.name) === activeCategory
    );

  const getImage = (news: News) =>
    news.thumbnail || news.featuredImage || '/placeholder.jpg';

  return (
    <section className="relative w-full py-20 bg-[#0A0F16] text-white overflow-hidden">
      {/* Newspaper texture background */}
      <div className="absolute inset-0 bg-[url('/newspaper-texture.png')] opacity-10 mix-blend-overlay" />

      {/* Animated ink splatters */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 0.03, scale: 1 }}
          transition={{ duration: 1 }}
          className="absolute bg-blue-800 rounded-full filter blur-xl"
          style={{
            width: `${200 + Math.random() * 200}px`,
            height: `${200 + Math.random() * 200}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-wider text-blue-400 bg-blue-900/30 rounded-full mb-4 uppercase border border-blue-900/50">
            Breaking Stories
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
            Trending News
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Stay updated with the latest happenings across East Africa
          </p>
        </div>

        {/* Newspaper Fold Effect */}
        <div className="relative bg-[#121923] border border-gray-800 rounded-lg overflow-hidden shadow-2xl">
          {/* Newspaper Header */}
          <div className="border-b border-gray-800 p-4 bg-[#0D121C] flex justify-between items-center">
            <div className="text-sm text-gray-400">
              DAILY EDITION • {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
            <div className="text-xs bg-red-600 text-white px-2 py-1 rounded">LIVE UPDATES</div>
          </div>

          {/* Category Tabs */}
          <div className="flex overflow-x-auto border-b border-gray-800">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeCategory === category ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-white'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Newspaper Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
            {/* Featured Left Column */}
            <div className="lg:col-span-2 border-r border-gray-800">
              {filteredNews.filter((item) => item.isFeatured).map((item) => (
                <div key={item._id} className="border-b border-gray-800">
                  <div className="p-6">
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-900/30 text-blue-400 rounded mb-4">
                      {/* {typeof item.category === "string"
  ? item.category 
  : item.category?.name ?? "Uncategorized"} */}

                    </span>

                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
                      {item.title}
                    </h3>

                    <div className="relative h-64 md:h-96 w-full mb-6 rounded-lg overflow-hidden">
                      <Image
                        src={getImage(item)}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>

                    <p className="text-gray-300 mb-6 text-lg">
                      {item.summary || item.content?.slice(0, 150) + "..."}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-gray-400 text-sm">
                        <div className="flex items-center gap-1">
                          <FiCalendar size={14} />
                          <span>
                            {item.createdAt
                              ? new Date(item.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                              : "Unknown Date"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FiClock size={14} />
                          <span>{item.readingTime || "5 min read"}</span>
                        </div>
                      </div>

                      <Link
                        href={`/news/article/${slugify(item.title)}-${item._id}`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Read full story{" "}
                        <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}

            </div>

            {/* Right Column - News List */}
            <div className="lg:col-span-1">
              <div className="p-4 border-b border-gray-800 bg-[#0D121C]">
                <h4 className="font-bold text-white">Latest Updates</h4>
              </div>
              {filteredNews.filter((item) => !item.isFeatured).map((item, index) => (
                <NewsCard key={item._id} item={item} isFeatured={false} index={index} />
              ))}
            </div>
          </div>

          {/* Newspaper Footer */}
          <div className="p-4 bg-[#0D121C] text-center text-xs text-gray-500 border-t border-gray-800">
            Continue reading on page 2 →
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-16">
          <Link href="/news">
            <button className="inline-flex items-center px-6 py-3 border border-gray-700 hover:border-blue-500 text-sm font-medium rounded-full text-white bg-gray-800/50 hover:bg-gray-700/50 transition-all group">
              View All News Articles
              <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}