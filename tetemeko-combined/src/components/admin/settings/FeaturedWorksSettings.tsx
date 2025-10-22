'use client';

import Image from 'next/image';
import { useState } from 'react';

interface FeaturedWork {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

export default function FeaturedWorksSettings() {
  const [works, setWorks] = useState<FeaturedWork[]>([]);
  const [newWork, setNewWork] = useState<FeaturedWork>({
    id: '',
    title: '',
    description: '',
    imageUrl: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewWork((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddWork = () => {
    if (!newWork.title || !newWork.imageUrl) return;

    setWorks([
      ...works,
      { ...newWork, id: Date.now().toString() }
    ]);
    setNewWork({ id: '', title: '', description: '', imageUrl: '' });
  };

  const handleDelete = (id: string) => {
    setWorks(works.filter((work) => work.id !== id));
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Add Featured Work</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="title"
          value={newWork.title}
          onChange={handleInputChange}
          placeholder="Title"
          className="border p-2 rounded w-full"
        />
        <input
          name="imageUrl"
          value={newWork.imageUrl}
          onChange={handleInputChange}
          placeholder="Image URL"
          className="border p-2 rounded w-full"
        />
        <textarea
          name="description"
          value={newWork.description}
          onChange={handleInputChange}
          placeholder="Description"
          className="border p-2 rounded w-full col-span-1 md:col-span-2"
        />
        <button
          onClick={handleAddWork}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Add Work
        </button>
      </div>

      <h2 className="text-lg font-semibold mt-6">Featured Works</h2>
      {works.length === 0 && (
        <p className="text-sm text-gray-500">No featured works added yet.</p>
      )}
      <ul className="space-y-3">
        {works.map((work) => (
          <li key={work.id} className="border p-4 rounded shadow-sm bg-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{work.title}</h3>
                {work.description && (
                  <p className="text-sm text-gray-600">{work.description}</p>
                )}
                {work.imageUrl && (
                  <Image
                    src={work.imageUrl}
                    alt={work.title}
                    className="mt-2 h-32 object-cover rounded"
                  />
                )}
              </div>
              <button
                onClick={() => handleDelete(work.id)}
                className="text-red-500 text-sm hover:underline"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
