'use client';

import { News } from '@/interfaces/News';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import ReadingProgressBar from '../ui/ReadingProgressBar';
import ShareButtons from '../ui/ShareButtons';
import PRelatedArticles from './PageRelatedArticles';

interface ArticleClientProps {
  news: News;
  related: News[];
  readingTime: number;
  slugAndId: string;
}

export default function ArticleClient({ news, related, readingTime, slugAndId }: ArticleClientProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    setIsBookmarked(bookmarks.includes(news._id));
  }, [news._id]);

 

  const toggleBookmark = () => {
    try {
      const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
      let newBookmarks;

      if (isBookmarked) {
        newBookmarks = bookmarks.filter((id: string) => id !== news._id);
      } else {
        newBookmarks = [...bookmarks, news._id];
      }

      localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    }
  };

  const publishDate = news.publishedAt ? new Date(news.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'Not published yet';

  // Generate SEO-friendly URL
  const generateArticleUrl = (article: News) => {
    const slug = article.seoTitle
      ? article.seoTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      : article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return `/news/article/${slug}-${article._id}`;
  };

  return (
    <>
      <ReadingProgressBar />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-0 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
          <ol className="flex space-x-2">
            <li>
              <a href="/" className="hover:text-blue-600 transition-colors">Home</a>
            </li>
            <li className="before:content-['/'] before:mr-2">
              <a href="/news" className="hover:text-blue-600 transition-colors">News</a>
            </li>
            <li className="before:content-['/'] before:mr-2">
              <a
                href={`/news/category/${typeof news.category === "string"
                    ? news.category
                    : news.category?.slug ?? "uncategorized"
                  }`}
                className="hover:text-blue-600 transition-colors capitalize"
              >
                {typeof news.category === "string"
                  ? news.category
                  : news.category?.name ?? "Uncategorized"}
              </a>
            </li>
            <li
              className="before:content-['/'] before:mr-2 text-gray-200 truncate max-w-xs"
              aria-current="page"
            >
              {typeof news.category === "string"
                ? news.category
                : news.category?.name ?? "Uncategorized"}
            </li>
          </ol>
        </nav>


        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-300 mb-4 leading-tight">
            {news.title}
          </h1>

          {news.summary && (
            <p className="text-xl text-gray-300 mb-6 leading-relaxed">
              {news.summary}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-200">
                <time dateTime={news.publishedAt}>{publishDate}</time>
                <span className="mx-2">•</span>
                <span>{readingTime} min read</span>
                {news.viewsCount > 0 && (
                  <>
                    <span className="mx-2">•</span>
                    <span>{news.viewsCount} views</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={toggleBookmark}
                className={`p-2 rounded-full transition-colors ${isBookmarked ? 'text-yellow-500 bg-yellow-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
                aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d={isBookmarked
                    ? "M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"
                    : "M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"
                  } />
                </svg>
              </button>

              <button
                onClick={() => setShowShareOptions(!showShareOptions)}
                className="p-2 rounded-full text-gray-200 hover:text-gray-300 hover:bg-gray-100 transition-colors"
                aria-label="Share article"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
              </button>
            </div>
          </div>

          {showShareOptions && (
            <div className="mb-6 animate-fadeIn">
              <ShareButtons
                url={isClient ? window.location.href : ''}
                title={news.title}
                description={news.summary || news.content.substring(0, 150)}
              />
            </div>
          )}

          {/* Featured Image */}
          {(news.thumbnail || news.featuredImage) && (
            <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] rounded-xl overflow-hidden shadow-lg mb-6">
              <Image
                src={news.thumbnail || news.featuredImage || '/placeholder.jpg'}
                alt={news.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              />
              {news.featuredImage && (
                <div className="absolute bottom-0 right-0 bg-black bg-opacity-60 text-white text-xs p-2">
                  Credit: {news.featuredImage}
                </div>
              )}
            </div>
          )}
        </header>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none text-white">
          <div
            className="article-content"
            dangerouslySetInnerHTML={{ __html: news.content }}
          />
        </div>

        {/* Article Tags */}
        {news.tags && news.tags.length > 0 && (
          <div className="mt-10 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-300 mb-3">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {news.tags.map((tag, index) => (
                <a
                  key={index}
                  href={`/news/tag/${tag}`}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                >
                  #{tag}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Share Section at Bottom */}
        <div className="mt-10 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-400 mb-4">Share this article</h3>
          <ShareButtons
            url={isClient ? window.location.href : ''}
            title={news.title}
            description={news.summary || news.content.substring(0, 150)}
            variant="large"
          />
        </div>
      </article>

      {/* Related Articles */}
      <PRelatedArticles articles={related} currentArticleId={news._id} />
    </>
  );
}