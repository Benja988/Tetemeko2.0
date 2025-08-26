'use client';

import Link from 'next/link';
import Image from 'next/image';
import { News } from '@/interfaces/News';
import { FiCalendar, FiUser, FiArrowRight } from 'react-icons/fi';
import { slugify } from '@/utils/slugify';

interface NewsCardProps {
  news: News;
}

export default function NewsCard({ news }: NewsCardProps) {
  return (
    <article className="bg-[#062746] rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 border border-[hsl(210,63%,12%)]">
      <Link href={`/news/article/${slugify(news.title)}-${news._id}`} className="block">
        {news.featuredImage && (
          <div className="relative h-48 overflow-hidden">
            <Image
              src={news.featuredImage}
              alt={news.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        )}

        <div className="p-6">
          <h2 className="text-xl font-semibold text-white mb-3 line-clamp-2">
            {news.title}
          </h2>
          <p className="text-gray-300 text-sm mb-4 line-clamp-3">
            {news.summary || news.content.replace(/<[^>]*>/g, '').substring(0, 120)}...
          </p>

          <div className="flex items-center justify-between text-sm text-gray-400">
            <div className="flex items-center">
              <FiUser className="mr-1" size={14} />
              <span>{typeof news.author === 'string' ? news.author : news.author?.name}</span>
            </div>
            {news.publishedAt && (
              <div className="flex items-center">
                <FiCalendar className="mr-1" size={14} />
                <span>{new Date(news.publishedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}</span>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-[hsl(210,63%,12%)]">
            <span className="text-blue-300 font-medium text-sm flex items-center">
              Read More
              <FiArrowRight className="ml-1" size={14} />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
