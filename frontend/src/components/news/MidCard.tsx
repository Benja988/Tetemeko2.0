'use client';

import React from 'react';
import Link from 'next/link';

interface MidCardProps {
  lnk: string;
  imageSrc: string;
  tag?: string;
  text: string;
  summary: string;
}

const MidCard: React.FC<MidCardProps> = ({ lnk, imageSrc, tag, text, summary }) => {
  return (
    <Link href={lnk} className="block group">
      <div className="relative aspect-video overflow-hidden rounded-lg mb-2">
        <img
          src={imageSrc}
          alt={text}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {tag && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            {tag}
          </span>
        )}
      </div>

      <h3 className="text-lg font-semibold group-hover:text-red-600 transition duration-300">
        {text}
      </h3>
      <h3 className="text-lg font-semibold group-hover:text-red-600 transition duration-300">
        {summary}
      </h3>
    </Link>
  );
};

export default MidCard;
