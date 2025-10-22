'use client';

import { News } from '@/interfaces/News';
import { useState } from 'react';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import EditNewsModal from './EditNewsModal';
import PreviewModal from './PreviewModal';

interface NewsTableRowProps {
  news: News;
  onDelete: (id: string) => void;
  onToggleBreaking: (id: string) => void;
  refetch: () => void;
}

export default function NewsTableRow({ news, onDelete, onToggleBreaking, refetch }: NewsTableRowProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(news._id);
    setIsDeleting(false);
  };

  const handleToggle = async () => {
    setIsToggling(true);
    await onToggleBreaking(news._id);
    setIsToggling(false);
  };

  const categoryName = typeof news.category === 'object' && news.category ? news.category.name : (news.category || 'Uncategorized');
  const statusColor = news.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  const date = news.createdAt ? new Date(news.createdAt).toLocaleDateString() : 'N/A';

  return (
    <>
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="px-6 py-4 whitespace-nowrap">
          {news.featuredImage ? (
            <Image src={news.featuredImage} alt={news.title} width={50} height={50} className="rounded object-cover" />
          ) : (
            <div className="w-[50px] h-[50px] bg-gray-200 rounded" />
          )}
        </td>
        <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs truncate">{news.title}</td>
        <td className="px-6 py-4 text-sm text-gray-500">{categoryName}</td>
        <td className="px-6 py-4">
          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor}`}>
            {news.isPublished ? 'Published' : 'Unpublished'}
          </span>
        </td>
        <td className="px-6 py-4 text-sm text-gray-500">{date}</td>
        <td className="px-6 py-4 text-sm text-gray-500">{news.viewsCount || 0}</td>
        <td className="px-6 py-4">
          <div className="flex items-center">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={news.isBreaking}
                onChange={handleToggle}
                disabled={isToggling}
                className="sr-only"
              />
              <div
                className={`w-11 h-6 rounded-full peer ${
                  news.isBreaking ? 'bg-blue-600' : 'bg-gray-200'
                } after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                  news.isBreaking ? 'after:translate-x-5' : ''
                }`}
              ></div>
            </label>
            {isToggling && <Loader2 className="animate-spin ml-2 text-blue-600" size={16} />}
          </div>
        </td>
        <td className="px-6 py-4 text-sm font-medium">
          <button
            onClick={() => setIsPreviewOpen(true)}
            className="text-blue-600 hover:text-blue-900 mr-3 transition-colors"
          >
            Preview
          </button>
          <button
            onClick={() => setIsEditOpen(true)}
            className="text-indigo-600 hover:text-indigo-900 mr-3 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-600 hover:text-red-900 transition-colors flex items-center"
          >
            {isDeleting ? <Loader2 className="animate-spin" size={16} /> : 'Delete'}
          </button>
        </td>
      </tr>

      <EditNewsModal
        news={news}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSuccess={refetch}
      />

      <PreviewModal
        news={news}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </>
  );
}