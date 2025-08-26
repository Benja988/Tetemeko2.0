// @/components/news/RelatedArticleCard.tsx
import { News } from '@/interfaces/News';
import Image from 'next/image';
import Link from 'next/link';

interface RelatedArticleCardProps {
  article: News;
}

export default function RelatedArticleCard({ article }: RelatedArticleCardProps) {
  // Generate SEO-friendly URL
  const generateArticleUrl = (article: News) => {
    const slug = article.seoTitle 
      ? article.seoTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      : article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return `/news/article/${slug}-${article._id}`;
  };

  const wordCount = article.content?.split(/\s+/).length || 200;
  const readingTime = Math.ceil(wordCount / 200);
  const publishDate = article.publishedAt 
    ? new Date(article.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : '';

  return (
    <article className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
      <Link href={generateArticleUrl(article)} className="block h-full">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={article.thumbnail || article.featuredImage || '/placeholder-news.jpg'}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-3 left-3">
            <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-blue-600 rounded-full capitalize">
              {/* {article.category} */}
            </span>
          </div>
          {article.isBreaking && (
            <div className="absolute top-3 right-3">
              <span className="inline-block px-2 py-1 text-xs font-bold text-white bg-red-600 rounded-full">
                BREAKING
              </span>
            </div>
          )}
        </div>
        
        <div className="p-5">
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {article.title}
          </h3>
          
          {article.summary && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {article.summary}
            </p>
          )}
          
          <div className="flex items-center justify-between text-xs text-gray-500 mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center">
              {publishDate && (
                <time dateTime={article.publishedAt} className="mr-3">
                  {publishDate}
                </time>
              )}
              <span>{readingTime} min read</span>
            </div>
            
            {article.viewsCount > 0 && (
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>{article.viewsCount}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}