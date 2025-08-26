// @/components/news/ArticleLoading.tsx

export default function ArticleLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-0 py-8 animate-pulse">
      {/* Breadcrumb loading */}
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
      
      {/* Title loading */}
      <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
      <div className="h-10 bg-gray-200 rounded w-4/5 mb-6"></div>
      
      {/* Excerpt loading */}
      <div className="h-6 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-6 bg-gray-200 rounded w-5/6 mb-2"></div>
      <div className="h-6 bg-gray-200 rounded w-4/6 mb-6"></div>
      
      {/* Author and metadata loading */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-3 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
      
      {/* Image loading */}
      <div className="w-full h-64 sm:h-80 md:h-96 lg:h-[500px] bg-gray-200 rounded-xl mb-6"></div>
      
      {/* Content loading */}
      <div className="space-y-3">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
        ))}
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  );
}