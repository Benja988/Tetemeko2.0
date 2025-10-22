'use client';

import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { FiX, FiSave, FiUser, FiMail, FiEdit2 } from 'react-icons/fi';
import Image from 'next/image';
import { Author } from '@/types/author';

interface UpdateAuthorModalProps {
  author: Author | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedAuthor: Partial<Author> & { _id: string }) => Promise<void>;
  isLoading?: boolean;
}

export function UpdateAuthorModal({
  author,
  isOpen,
  onClose,
  onUpdate,
  isLoading = false,
}: UpdateAuthorModalProps) {
  const [formData, setFormData] = useState<Partial<Author>>({
    name: '',
    email: '',
    bio: '',
    avatar: '',
    isVerified: false,
  });

  useEffect(() => {
    if (author) {
      setFormData({
        name: author.name,
        email: author.email,
        bio: author.bio,
        avatar: author.avatar,
        isVerified: author.isVerified,
      });
    }
  }, [author]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author) return;
    await onUpdate({ ...formData, _id: author._id });
    onClose();
  };

  if (!author) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-lg rounded-lg bg-white shadow-xl">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <FiEdit2 className="w-5 h-5 text-blue-600" />
                Update Author
              </Dialog.Title>
              <button 
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
                aria-label="Close"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <FiUser className="w-4 h-4" />
                      </div>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="pl-9 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <FiMail className="w-4 h-4" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email || ''}
                        onChange={handleChange}
                        className="pl-9 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-1">
                      Avatar URL
                    </label>
                    <input
                      id="avatar"
                      name="avatar"
                      type="url"
                      value={formData.avatar || ''}
                      onChange={handleChange}
                      placeholder="https://example.com/avatar.jpg"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {formData.avatar && (
                    <div className="flex items-center gap-3">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden border border-gray-200">
                        <Image
                          src={formData.avatar}
                          alt="Author avatar"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="text-sm text-gray-500">Current avatar</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <input
                      id="isVerified"
                      name="isVerified"
                      type="checkbox"
                      checked={formData.isVerified || false}
                      onChange={(e) => setFormData(prev => ({ ...prev, isVerified: e.target.checked }))}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="isVerified" className="text-sm font-medium text-gray-700">
                      Verified Author
                    </label>
                  </div>
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={7}
                    value={formData.bio || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2 disabled:bg-blue-400"
                >
                  {isLoading ? (
                    'Saving...'
                  ) : (
                    <>
                      <FiSave className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}