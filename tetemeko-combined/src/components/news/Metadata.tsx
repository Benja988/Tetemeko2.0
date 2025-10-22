

import { getNewsById } from '@/services/news/newsService';
import type { Metadata } from 'next';

interface Props {
  params: {
    slugAndId: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slugAndId } = await params;
  const id = slugAndId?.split('-').pop();

  if (!id) return { title: 'News Not Found' };

  let news;
  try {
    news = await getNewsById(id);
  } catch (error) {
    console.error('Failed to fetch news for metadata:', error);
    return { title: 'News Not Found' };
  }

  if (!news) return { title: 'News Not Found' };

  return {
    title: news.seoTitle || news.title,
    description: news.seoDescription || news.summary || news.content?.slice(0, 150),
    openGraph: {
      title: news.title,
      description: news.summary || '',
      images: [news.thumbnail || news.featuredImage || '/placeholder.jpg'],
    },
  };
}