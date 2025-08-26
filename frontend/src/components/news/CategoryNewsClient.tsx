'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { News } from '@/interfaces/News';
import NewsCard from '@/components/news/NewsCard';
import { getNewsByCategory } from '@/services/news/newsService';

export default function CategoryNewsClient({ category }: { category: string }) {
  const searchParams = useSearchParams();
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  const page = parseInt(searchParams.get('page') || '1', 10);

  useEffect(() => {
    async function fetchNews() {
      try {
        setLoading(true);
        const response = await getNewsByCategory(category, page, 6);
        setNews(response?.news ?? []);
      } catch (error) {
        console.error('Failed to fetch category news:', error);
        setNews([]);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, [category, page]);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 capitalize">{category} News</h1>

      {loading ? (
        <p>Loading...</p>
      ) : news.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item) => (
            <NewsCard key={item._id} news={item} />
          ))}
        </div>
      ) : (
        <p>No articles found.</p>
      )}
    </main>
  );
}
