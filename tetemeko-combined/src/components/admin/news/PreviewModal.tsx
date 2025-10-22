'use client';

import { News } from '@/interfaces/News';
import Image from 'next/image';
import Modal from './Modal';

interface Props {
  news: News | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PreviewModal({ news, isOpen, onClose }: Props) {
  if (!news) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Preview Article">
      <div className="space-y-4">
        {news.featuredImage && (
          <Image
            src={news.featuredImage}
            alt={news.title}
            width={600}
            height={400}
            className="rounded-md object-cover w-full"
          />
        )}
        <h1 className="text-2xl font-bold">{news.title}</h1>
        <p className="text-gray-500">{news.summary}</p>
        <div
          className="prose max-w-full"
          dangerouslySetInnerHTML={{ __html: news.content }}
        />
        {news.videoUrl && (
          <video
            src={news.videoUrl}
            controls
            className="w-full rounded-md border"
          />
        )}
      </div>
    </Modal>
  );
}
