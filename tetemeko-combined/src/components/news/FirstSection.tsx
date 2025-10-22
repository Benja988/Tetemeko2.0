// src/components/news/FirstSection.tsx

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import MidCard from './MidCard';
import RelatedCard from './RelatedCard';
import Banner from './Banner';

import { News } from '@/interfaces/News';
import {
  getBreakingNews,
  getFeaturedNews,
  getRecentNews
} from '@/services/news/newsService';
import { slugify } from '@/utils/slugify';

export default function FirstSection() {
  const [breaking, setBreaking] = useState<News | null>(null);
  const [moreStories, setMoreStories] = useState<News[]>([]);
  const [featuredStories, setFeaturedStories] = useState<News[]>([]);

  useEffect(() => {
    const fetchNewsSections = async () => {
      const [breakingList, recentList, featuredList] = await Promise.all([
        getBreakingNews(),
        getRecentNews(5),
        getFeaturedNews()
      ]);

      if (breakingList?.length) {
        setBreaking(breakingList[0]);
      }

      if (recentList) {
        setMoreStories(recentList.slice(1, 4));
      }

      if (featuredList) {
        setFeaturedStories(featuredList.slice(0, 3));
      }
    };

    fetchNewsSections();
  }, []);

  if (!breaking) return null;

  const getImage = (news: News) =>
    news.thumbnail || news.featuredImage || '/placeholder.jpg';

  return (
    <div>
      {/* ✅ Banner */}
      <Banner />

      <div className="flex flex-col md:flex-row gap-6">
        {/* 📰 Breaking News Section */}
        <div className="w-full md:w-1/2 p-2 space-y-6">
          <h2 className="text-3xl font-bold text-white font-serif underline decoration-4 decoration-secondary mb-4">
            Breaking News
          </h2>

          <Link
            href={`/news/article/${slugify(breaking.title)}-${breaking._id}`}
          >
            <div className="relative group mb-6 cursor-pointer">
              <div className="relative aspect-video overflow-hidden rounded-lg mb-3 shadow-lg">
                <img
                  src={getImage(breaking)}
                  alt={breaking.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
                />
              </div>
              <h3 className="text-2xl font-bold text-white font-serif group-hover:underline group-hover:decoration-secondary transition">
                {breaking.title}
              </h3>
              <p className="text-gray-200 mt-3 font-sans">
                {breaking.summary || breaking.content?.slice(0, 120) + '...'}
              </p>
            </div>
          </Link>

          {/* 🔗 Related News */}
          <div>
            <h4 className="text-2xl font-bold mb-3 text-white font-serif underline decoration-4 decoration-secondary">
              Related News
            </h4>
            <div className="space-y-3">
              {moreStories.map((article, index) => (
                <div key={article._id}>
                  <RelatedCard
                    link={`/news/article/${slugify(article.title)}-${article._id}`}
                    text={article.title}
                    imageSrc={getImage(article)}
                    category={
                      typeof article.category === "string"
                        ? article.category
                        : article.category?.name ?? "Uncategorized"
                    }
                  />
                  {index < moreStories.length - 1 && (
                    <div className="border-t border-gray-700/50 my-2" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 📌 More Stories */}
        <div className="w-full md:w-1/4 p-2 flex flex-col gap-4">
          <h2 className="text-2xl font-bold mb-4 text-white font-serif underline decoration-4 decoration-secondary">
            More Stories
          </h2>
          {moreStories.map((card, index) => (
            <div key={card._id}>
              <MidCard
                lnk={`/news/article/${slugify(card.title)}-${card._id}`}
                imageSrc={getImage(card)}
                tag={card.tags?.[0] || 'News'}
                text={card.title}
                summary={
                  card.summary?.slice(0, 20) || card.content?.slice(0, 10) + '...'
                }
              />
              {index < moreStories.length - 1 && (
                <div className="border-t border-gray-700/50 my-2" />
              )}
            </div>
          ))}
        </div>

        {/* 🚀 Featured Stories */}
        <div className="w-full md:w-1/4 p-2 flex flex-col gap-4">
          <div className="relative aspect-video mb-4 rounded-lg overflow-hidden shadow-lg">
            <video
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 ease-in-out"
              autoPlay
              muted
              loop
            >
              <source src="/videos/video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          <h2 className="text-2xl font-bold mb-4 text-white font-serif underline decoration-4 decoration-secondary">
            Featured Stories
          </h2>
          {featuredStories.map((card, index) => (
            <Link
              key={card._id}
              href={`/news/article/${slugify(card.title)}-${card._id}`}
            >
              <div className="flex gap-4 items-start group hover:bg-opacity-90 p-2 rounded-lg transition cursor-pointer">
                <div className="w-1/3">
                  <img
                    src={getImage(card)}
                    alt={card.title}
                    className="w-full h-auto object-cover rounded-md group-hover:scale-105 transition"
                  />
                </div>
                <div className="w-2/3">
                  <h3 className="text-lg font-semibold text-white font-serif group-hover:underline group-hover:decoration-secondary transition">
                    {card.title}
                  </h3>
                  <p className="text-gray-300 mt-1 line-clamp-2 font-sans">
                    {card.summary || card.content?.slice(0, 100) + '...'}
                  </p>
                </div>
              </div>
              {index < featuredStories.length - 1 && (
                <div className="border-t border-gray-700/50 my-2" />
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
