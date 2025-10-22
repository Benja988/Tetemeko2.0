import { News } from '@/interfaces/News';
import NewsTableRow from './NewsTableRow';

interface NewsTableProps {
  newsList: News[];
  onDelete: (id: string) => void;
  onToggleBreaking: (id: string) => void;
  refetch: () => void;
}

export default function NewsTable({ newsList, onDelete, onToggleBreaking, refetch }: NewsTableProps) {
  if (newsList.length === 0) {
    return <div className="text-center py-8 text-gray-500 bg-white rounded-xl shadow">No articles found.</div>;
  }

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Breaking</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {newsList.map((news) => (
            <NewsTableRow
              key={news._id}
              news={news}
              onDelete={onDelete}
              onToggleBreaking={onToggleBreaking}
              refetch={refetch}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}