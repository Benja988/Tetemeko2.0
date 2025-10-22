// ... other imports
import { toast } from 'sonner';
import NewsArticleForm from './create/NewsArticleForm';
import NewsHeader from './NewsHeader';
import NewsSearchFilterBar from './NewsSearchFilterBar';
import NewsStats from './NewsStats';
import NewsTable from './NewsTable';
import NewsLoader from './NewsLoader'; // Assuming this is the path to your NewsLoader component
import { deleteNewsById, getAllNews, getNewsStats, toggleBreakingNews } from '@/services/news/newsService';
import { useEffect, useState } from 'react';
import { News } from '@/interfaces/News';

interface Props {
  heading: string;
}
export default function NewsPageLayout({ heading }: Props) {
  const [newsList, setNewsList] = useState<News[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [stats, setStats] = useState({ totalNews: 0, publishedNews: 0, unpublishedNews: 0 });
  const [refresh, setRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setIsLoading(true);
      const [newsRes, statsRes] = await Promise.all([
        getAllNews(),
        getNewsStats()
      ]);

      if (newsRes) setNewsList(newsRes.news);
      if (statsRes) setStats(statsRes);
      setIsLoading(false);
    };

    fetchAll();
  }, [refresh]);

  const refetch = () => setRefresh(!refresh);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this news article?')) return;

    const res = await deleteNewsById(id);
    if (res) {
      toast.success('News deleted');
      refetch();
    }
  };

  const handleToggleBreaking = async (id: string) => {
    const res = await toggleBreakingNews(id);
    if (res) {
      toast.success('Breaking news updated');
      refetch();
    }
  };

  const filteredNews = newsList.filter((news) => {
    const matchSearch =
      news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      news.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchCategory =
      !categoryFilter || (typeof news.category === 'object' && news.category?._id === categoryFilter) ||
      news.category === categoryFilter;

    const matchStatus =
      !statusFilter ||
      (statusFilter === 'published' && news.isPublished) ||
      (statusFilter === 'unpublished' && !news.isPublished);

    return matchSearch && matchCategory && matchStatus;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <NewsHeader heading={heading} showForm={showForm} onCreate={() => setShowForm(!showForm)} />

      <NewsStats
        total={stats.totalNews}
        published={stats.publishedNews}
        unpublished={stats.unpublishedNews}
      />

      <NewsSearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow animate-fade-in">
          <NewsArticleForm onSuccess={() => {
            setShowForm(false);
            refetch();
          }} />
        </div>
      )}

      {isLoading ? (
        <NewsLoader />
      ) : (
        <NewsTable
          newsList={filteredNews}
          onDelete={handleDelete}
          onToggleBreaking={handleToggleBreaking}
          refetch={refetch}
        />
      )}
    </div>
  );
}