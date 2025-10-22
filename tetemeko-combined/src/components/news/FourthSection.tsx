'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { News } from '@/interfaces/News';
import { getNewsByCategory } from '@/services/news/newsService';
import { slugify } from '@/utils/slugify';

export default function FourthSection() {
  const [opinionStories, setOpinionStories] = useState<News[]>([]);
  const [lifestyleStories, setLifestyleStories] = useState<News[]>([]);

  useEffect(() => {
    const fetchSections = async () => {
      const [opinionRes, lifestyleRes] = await Promise.all([
        getNewsByCategory('opinion', 1, 3), // Fetch 3 stories for Opinions
        getNewsByCategory('lifestyle', 1, 3), // Fetch 3 stories for Lifestyle
      ]);

      if (opinionRes?.news) {
        setOpinionStories(opinionRes.news);
      }

      if (lifestyleRes?.news) {
        setLifestyleStories(lifestyleRes.news);
      }
    };

    fetchSections();
  }, []);

  const getImage = (news: News) =>
    news.thumbnail || news.featuredImage || '/placeholder.jpg';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 px-4 py-16 text-primaryText">
      {/* 💬 Opinion Section */}
      <div>
        <h2 className="text-3xl font-bold text-white font-serif underline decoration-4 decoration-secondary mb-6">
          Opinions
        </h2>

        <div className="space-y-8">
          {/* Main Feature Card */}
          {opinionStories[0] && (
            <Link href={`/news/article/${slugify(opinionStories[0].title)}-${opinionStories[0]._id}`}>
              <div className="relative group rounded-lg shadow-lg overflow-hidden">
                <img
                  src={getImage(opinionStories[0])}
                  alt={opinionStories[0].title}
                  className="w-full h-72 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                  <h3 className="text-2xl font-bold text-white font-serif">
                    {opinionStories[0].title}
                  </h3>
                  <p className="text-white mt-2 line-clamp-2">
                    {opinionStories[0].summary || opinionStories[0].content?.slice(0, 120) + '...'}
                  </p>
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-xl font-semibold">📖 Read More</p>
                </div>
              </div>
            </Link>
          )}

          {/* Supporting Articles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {opinionStories.slice(1).map((story) => (
              <Link
                href={`/news/article/${slugify(story.title)}-${story._id}`}
                key={story._id}
              >
                <div className="group relative overflow-hidden rounded-lg shadow-lg">
                  <img
                    src={getImage(story)}
                    alt={story.title}
                    className="w-full h-44 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
                    <h3 className="text-lg font-bold text-white font-serif">
                      {story.title}
                    </h3>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-lg font-semibold">📖 Read More</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 🌟 Lifestyle Section */}
      <div>
        <h2 className="text-3xl font-bold text-white font-serif underline decoration-4 decoration-secondary mb-6">
          Lifestyle
        </h2>

        <div className="space-y-8">
          {/* Main Feature Card */}
          {lifestyleStories[0] && (
            <Link href={`/news/article/${slugify(lifestyleStories[0].title)}-${lifestyleStories[0]._id}`}>
              <div className="relative group rounded-lg shadow-lg overflow-hidden">
                <img
                  src={getImage(lifestyleStories[0])}
                  alt={lifestyleStories[0].title}
                  className="w-full h-72 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                  <h3 className="text-2xl font-bold text-white font-serif">
                    {lifestyleStories[0].title}
                  </h3>
                  <p className="text-white mt-2 line-clamp-2">
                    {lifestyleStories[0].summary || lifestyleStories[0].content?.slice(0, 120) + '...'}
                  </p>
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-xl font-semibold">📖 Read More</p>
                </div>
              </div>
            </Link>
          )}

          {/* Supporting Articles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {lifestyleStories.slice(1).map((story) => (
              <Link
                href={`/news/article/${slugify(story.title)}-${story._id}`}
                key={story._id}
              >
                <div className="group relative overflow-hidden rounded-lg shadow-lg">
                  <img
                    src={getImage(story)}
                    alt={story.title}
                    className="w-full h-44 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
                    <h3 className="text-lg font-bold text-white font-serif">
                      {story.title}
                    </h3>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-lg font-semibold">📖 Read More</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}