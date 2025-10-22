'use client';

import { FC } from 'react';
import { Post } from '@/types'; // Assume you have a type for post
import Link from 'next/link';

interface HeroSectionProps {
  filteredPosts: Post[];
}

const HeroSection: FC<HeroSectionProps> = ({ filteredPosts }) => {
  return (
    <section className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6">
      {/* Breaking News */}
      <div className="lg:w-2/3 bg-primaryLight rounded-lg p-6">
        <h2 className="text-4xl font-bold text-primaryText">
          Breaking News: Major Event Today
        </h2>
        <p className="text-xl text-primaryText/80 mt-4">
          Stay tuned for updates as we cover the biggest event of the day.
        </p>
      </div>

      {/* Trending Stories */}
      <div className="lg:w-1/3 bg-primaryLight/90 rounded-lg p-6">
        <h3 className="text-2xl font-semibold text-primaryText mb-4">Trending Stories</h3>
        <div className="space-y-4">
          {filteredPosts.slice(0, 3).map((post) => (
            <Link key={post.id} href={`/news/${post.slug}`}>
              <div className="bg-primaryLight/50 p-4 rounded-lg shadow-sm hover:shadow-lg cursor-pointer transition-all duration-300">
                <h4 className="text-lg font-semibold text-primaryText hover:text-accent">
                  {post.title}
                </h4>
                <p className="text-sm text-primaryText/70">{post.author.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
