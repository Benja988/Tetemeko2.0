'use client';

import { useState, useCallback } from 'react';
import { Dialog } from '@headlessui/react';
import { FiPlus, FiX, FiUpload, FiUser, FiMail } from 'react-icons/fi';
import Image from 'next/image';
import { Author } from '@/types/author';

interface CreateAuthorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (author: Omit<Author, '_id'>) => Promise<void>;
  isLoading?: boolean;
}

export function CreateAuthorModal({
  isOpen,
  onClose,
  onCreate,
  isLoading = false,
}: CreateAuthorModalProps) {
  const [formData, setFormData] = useState<Omit<Author, '_id'>>({
    name: '',
    email: '',
    bio: '',
    avatar: '',
    isVerified: false,
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      // In a real app, you would upload the file here and set the URL
    }
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    await onCreate(formData);
    onClose();
    setFormData({
      name: '',
      email: '',
      bio: '',
      avatar: '',
      isVerified: false,
    });
    setPreviewUrl(null);
  }, [formData, onCreate, onClose]);

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-lg rounded-lg bg-white shadow-xl">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-xl font-semibold text-gray-900">
                Create New Author
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
                      Name *
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
                      Email *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <FiMail className="w-4 h-4" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="pl-9 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Avatar
                    </label>
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-gray-400 transition-colors">
                      <FiUpload className="w-6 h-6 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">Click to upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                    Bio *
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={5}
                    required
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {previewUrl && (
                <div className="flex items-center gap-3">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border border-gray-200">
                    <Image
                      src={previewUrl}
                      alt="Avatar preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-sm text-gray-500">Image preview</span>
                </div>
              )}

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
                    'Creating...'
                  ) : (
                    <>
                      <FiPlus className="w-4 h-4" />
                      Create Author
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