// @/components/news/PageRelatedArticles.tsx
import { News } from '@/interfaces/News';
import RelatedArticleCard from './RelatedArticleCard';

interface RelatedArticlesProps {
  articles: News[];
  currentArticleId: string;
  title?: string;
  maxArticles?: number;
}

export default function PRelatedArticles({ 
  articles, 
  currentArticleId, 
  title = "Related Articles",
  maxArticles = 3 
}: RelatedArticlesProps) {
  // Filter out the current article from related articles
  const filteredArticles = articles.filter(article => article._id !== currentArticleId);
  
  if (filteredArticles.length === 0) return null;

  return (
    <section className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {filteredArticles.length > maxArticles && (
            <a 
              href="/news" 
              className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
            >
              View all news
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.slice(0, maxArticles).map((article) => (
            <RelatedArticleCard key={article._id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}