import React from 'react';

interface NewsHeaderProps {
  heading: string;
  showForm: boolean;
  onCreate: () => void;
}

const NewsHeader: React.FC<NewsHeaderProps> = ({ heading, showForm, onCreate }) => (
  <div className="flex justify-between items-center">
    <h1 className="text-3xl font-bold text-gray-800">{heading}</h1>
    <button
      onClick={onCreate}
      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
    >
      {showForm ? 'Close Form' : 'Create New Article'}
    </button>
  </div>
);

export default NewsHeader;