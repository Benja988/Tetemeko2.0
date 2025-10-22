// src/app/(user)/news/article/[slugAndId]/page.tsx
import { getNewsById } from '@/services/news/newsService';
import { getRecentNewsServer, getAllNewsServer } from '@/services/news/newsService';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ArticleClient from '@/components/news/ArticleClient';
import ArticleLoading from '@/components/news/ArticleLoading';
import { News } from '@/interfaces/News';

type ArticlePageProps = {
  params: { slugAndId: string };
};

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slugAndId } = params;
  const id = slugAndId?.split('-').pop();
  if (!id) return notFound();

  const news = await getNewsById(id);
  if (!news) return notFound();

  const related = (await getRecentNewsServer(6)) ?? [];

  const wordCount = news.content?.split(/\s+/).length || 200;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <>
      <Navbar />
      <Suspense fallback={<ArticleLoading />}>
        <ArticleClient
          news={news}
          related={related}
          readingTime={readingTime}
          slugAndId={slugAndId}
        />
      </Suspense>
      <Footer />
    </>
  );
}

export async function generateStaticParams() {
  const response = await getAllNewsServer();
  const allNews: News[] = response?.news ?? [];

  return allNews.map((news) => ({
    slugAndId: `${news.title.replace(/\s+/g, '-').toLowerCase()}-${news._id}`,
  }));
}
