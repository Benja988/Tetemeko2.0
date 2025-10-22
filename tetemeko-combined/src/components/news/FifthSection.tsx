'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { News } from '@/interfaces/News';
import { getNewsByCategory } from '@/services/news/newsService';
import { slugify } from '@/utils/slugify';
import { FiArrowRight, FiCalendar, FiUser } from 'react-icons/fi';

export default function FifthSection() {
  const [technologyStories, setTechnologyStories] = useState<News[]>([]);
  const [businessStories, setBusinessStories] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        setLoading(true);
        const [techRes, businessRes] = await Promise.all([
          getNewsByCategory('technology', 1, 4),
          getNewsByCategory('business', 1, 4),
        ]);

        if (techRes?.news) {
          setTechnologyStories(techRes.news);
        }

        if (businessRes?.news) {
          setBusinessStories(businessRes.news);
        }
      } catch (error) {
        console.error('Error fetching stories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, []);

  const getImage = (news: News) =>
    news.thumbnail || news.featuredImage || '/placeholder.jpg';

  const StoryCard = ({ story, category }: { story: News; category: string }) => (
    <Link
      href={`/news/article/${slugify(story.title)}-${story._id}`}
      key={story._id}
      className="block group"
    >
      <div className="relative flex items-start overflow-hidden rounded-xl bg-[#062746] p-5 shadow-lg transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px] border border-[hsl(210,63%,12%)]">
        <div className="relative w-20 h-20 flex-shrink-0 mr-4 rounded-lg overflow-hidden">
          <Image
            src={getImage(story)}
            alt={story.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="80px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors line-clamp-2 mb-2">
            {story.title}
          </h3>
          
          <p className="text-gray-300 text-sm line-clamp-2 mb-3">
            {story.summary || story.content?.replace(/<[^>]*>/g, '').slice(0, 100) + '...'}
          </p>
          
          <div className="flex items-center text-xs text-gray-400 space-x-3">
            {story.author && (
              <div className="flex items-center">
                <FiUser className="mr-1" size={12} />
                <span>{typeof story.author === 'string' ? story.author : story.author?.name}</span>
              </div>
            )}
            
            {story.publishedAt && (
              <div className="flex items-center">
                <FiCalendar className="mr-1" size={12} />
                <span>
                  {new Date(story.publishedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
            )}
          </div>
        </div>
        
        <FiArrowRight className="ml-2 text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0" />
      </div>
    </Link>
  );

  const SectionSkeleton = () => (
    <div className="space-y-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-start bg-[#062746] p-5 rounded-xl border border-[hsl(210,63%,12%)] animate-pulse">
          <div className="w-20 h-20 bg-[hsl(210,63%,12%)] rounded-lg mr-4"></div>
          <div className="flex-1">
            <div className="h-5 bg-[hsl(210,63%,12%)] rounded mb-3 w-3/4"></div>
            <div className="h-4 bg-[hsl(210,63%,12%)] rounded mb-2 w-full"></div>
            <div className="h-4 bg-[hsl(210,63%,12%)] rounded mb-3 w-2/3"></div>
            <div className="h-3 bg-[hsl(210,63%,12%)] rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section className="px-4 py-20 bg-[hsl(210,63%,7%)]">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Featured Stories
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover the latest news and insights from technology and business sectors
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* 🔌 Technology Section */}
          <div>
            <div className="flex items-center mb-8">
              <div className="w-3 h-10 bg-blue-500 rounded-full mr-4"></div>
              <h3 className="text-2xl md:text-3xl font-bold text-white">
                Technology
              </h3>
              <Link 
                href="/news/category/technology" 
                className="ml-auto text-blue-300 hover:text-white text-sm flex items-center transition-colors"
              >
                View all
                <FiArrowRight className="ml-1" />
              </Link>
            </div>

            <div className="space-y-6">
              {loading ? (
                <SectionSkeleton />
              ) : (
                technologyStories.map((story) => (
                  <StoryCard key={story._id} story={story} category="technology" />
                ))
              )}
            </div>
          </div>

          {/* 💼 Business Section */}
          <div>
            <div className="flex items-center mb-8">
              <div className="w-3 h-10 bg-green-500 rounded-full mr-4"></div>
              <h3 className="text-2xl md:text-3xl font-bold text-white">
                Business
              </h3>
              <Link 
                href="/news/category/business" 
                className="ml-auto text-blue-300 hover:text-white text-sm flex items-center transition-colors"
              >
                View all
                <FiArrowRight className="ml-1" />
              </Link>
            </div>

            <div className="space-y-6">
              {loading ? (
                <SectionSkeleton />
              ) : (
                businessStories.map((story) => (
                  <StoryCard key={story._id} story={story} category="business" />
                ))
              )}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 pt-12 border-t border-[hsl(210,63%,12%)]">
          <h3 className="text-2xl font-bold text-white mb-4">
            Stay Updated with More Stories
          </h3>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Explore our complete collection of news articles across all categories
          </p>
          <Link
            href="/news"
            className="inline-flex items-center px-8 py-3 bg-[#0d3a66] text-white rounded-lg hover:bg-[#124a80] transition-colors font-semibold"
          >
            Browse All News
            <FiArrowRight className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}