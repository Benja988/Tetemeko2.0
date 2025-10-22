'use client';

import React from 'react';
import Link from 'next/link';

interface RelatedCardProps {
  link: string;
  text: string;
  category: string;
  imageSrc: string;
  
}

const RelatedCard: React.FC<RelatedCardProps> = ({ link, text, imageSrc}) => {
  return (
    <Link href={link}>
      <div className="flex gap-3 items-center p-2 hover:bg-opacity-90 transition duration-300 rounded-md">
        <img
          src={imageSrc}
          alt={text}
          className="w-24 h-16 object-cover rounded-md hover:scale-105 transition-transform duration-300"
        />
        <p className="text-white hover:underline hover:underline-offset-4 transition duration-300">
          {text}
        </p>
      </div>
    </Link>
  );
};

export default RelatedCard;
