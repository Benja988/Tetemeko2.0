'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getRecentNews } from '@/services/news/newsService';
import { getCategories } from '@/services/categories/categoryService';
import { News } from '@/interfaces/News';
import { Category } from '@/interfaces/Category';
import { slugify } from '@/utils/slugify';

const SecondSection: React.FC = () => {
  const [trendingStories, setTrendingStories] = useState<News[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingAndCategories = async () => {
      try {
        setIsLoading(true);
        const [news, categoryList] = await Promise.all([
          getRecentNews(8),
          getCategories('news')
        ]);

        if (news) {
          const shuffled = news.sort(() => 0.5 - Math.random());
          setTrendingStories(shuffled.slice(0, 4));
        }

        if (categoryList) {
          setCategories(categoryList);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingAndCategories();
  }, []);

  const getImage = (news: News) =>
    news.thumbnail || news.featuredImage || '/placeholder.jpg';

  const sponsoredContent = {
    title: 'Sponsored Content',
    text: 'Check out our latest promotions and deals from trusted brands.',
    link: '/sponsored',
    imageSrc: 'https://picsum.photos/600/400?random=5',
  };

  // Skeleton loader components
  const StorySkeleton = () => (
    <div className="flex flex-col h-full bg-gray-800 rounded-lg overflow-hidden animate-pulse">
      <div className="w-full aspect-[4/3] bg-gray-700"></div>
      <div className="flex flex-col justify-between flex-1 p-4">
        <div className="h-6 bg-gray-700 rounded mb-2"></div>
        <div className="h-4 bg-gray-700 rounded mb-1"></div>
        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
      </div>
    </div>
  );

  const CategorySkeleton = () => (
    <div className="h-32 sm:h-36 bg-gray-800 rounded-lg animate-pulse"></div>
  );

  if (isLoading) {
    return (
      <div className="flex flex-col gap-16 px-4 py-16 text-primaryText max-w-7xl mx-auto">
        <section className="space-y-6">
          <div className="h-10 bg-gray-800 rounded w-64 mb-6 animate-pulse"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <StorySkeleton key={i} />
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="h-10 bg-gray-800 rounded w-48 mb-6 animate-pulse"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => (
              <CategorySkeleton key={i} />
            ))}
          </div>
        </section>

        <section className="flex flex-col items-center justify-center w-full bg-gray-800 p-6 rounded-lg text-center animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-64 mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-80 mb-4"></div>
          <div className="h-10 bg-gray-700 rounded w-32 mb-4"></div>
          <div className="w-full max-w-lg h-48 bg-gray-700 rounded-lg"></div>
        </section>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-16 py-16 text-primaryText">
      {/* 🚀 Trending Stories */}
      <section className="space-y-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-3xl md:text-4xl font-bold text-white font-serif">
            Trending Stories
          </h2>
          <Link 
            href="/news" 
            className="text-secondary hover:text-primary transition-colors text-sm md:text-base flex items-center"
          >
            View all
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingStories.map((story) => (
            <Link
              key={story._id}
              href={`/news/article/${slugify(story.title)}-${story._id}`}
              className="group flex flex-col h-full bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative w-full aspect-[4/3] overflow-hidden">
                <img
                  src={getImage(story)}
                  alt={story.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="flex flex-col justify-between flex-1 p-4">
                <h3 className="text-xl font-bold text-white font-serif line-clamp-2 group-hover:text-secondary transition-colors">
                  {story.title}
                </h3>
                <p className="text-gray-300 text-sm mt-2 line-clamp-3">
                  {story.summary || story.content?.slice(0, 100) + '...'}
                </p>
                <div className="mt-3 text-xs text-gray-400">
                  {story.publishedAt && new Date(story.publishedAt).toLocaleDateString()}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 📚 Categories Section */}
      <section className="space-y-6">
        <h2 className="text-3xl md:text-4xl font-bold text-white font-serif mb-2">
          Explore Categories
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category._id}
              href={`/news/category/${category.slug}`}
            >
              <div className="group relative flex items-center justify-center h-28 sm:h-32 bg-gradient-to-br from-secondary to-primary rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300" />
                <h3 className="z-10 text-lg font-semibold text-white text-center px-2 font-serif group-hover:scale-105 transition-transform">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 💼 Sponsored Section */}
      <section className="relative w-full bg-gradient-to-r from-gray-900 to-gray-800 p-8 rounded-xl shadow-lg overflow-hidden">
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-secondary rounded-full opacity-20"></div>
        <div className="absolute -left-12 -bottom-12 w-40 h-40 bg-primary rounded-full opacity-20"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-white font-serif mb-4">
              {sponsoredContent.title}
            </h2>
            <p className="text-gray-300 mb-6 font-sans max-w-md mx-auto lg:mx-0">
              {sponsoredContent.text}
            </p>
            <Link href={sponsoredContent.link}>
              <div className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primaryDark transition-all duration-300 hover:shadow-lg">
                Learn More
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </Link>
          </div>
          
          <div className="flex-1">
            <div className="relative rounded-xl overflow-hidden shadow-lg">
              <img
                src={sponsoredContent.imageSrc}
                alt="Sponsored Content"
                className="w-full h-64 object-cover"
                loading="lazy"
              />
              <div className="absolute top-4 right-4 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
                Sponsored
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SecondSection;