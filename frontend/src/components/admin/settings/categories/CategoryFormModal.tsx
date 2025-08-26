import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { Category, CategoryFormInput } from '@/interfaces/Category';
import { createCategory, updateCategory } from '@/services/categories/categoryService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Category | null;
}

export default function CategoryFormModal({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: Props) {
  const [form, setForm] = useState<CategoryFormInput>({
    name: '',
    categoryType: 'news',
    description: '',
    seoTitle: '',
    seoDescription: '',
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        categoryType: initialData.categoryType,
        description: initialData.description || '',
        seoTitle: initialData.seoTitle || '',
        seoDescription: initialData.seoDescription || '',
      });
    } else {
      setForm({
        name: '',
        categoryType: 'news',
        description: '',
        seoTitle: '',
        seoDescription: '',
      });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    console.log("Submitting form:", form);
    try {
      if (initialData) {
        console.log("Updating category with id:", initialData._id);
        const updated = await updateCategory(initialData._id, form);
        console.log("Update response:", updated);
        if (updated) {
          onSuccess();
          onClose();
        }
      } else {
        const created = await createCategory(form);
        console.log("Create response:", created);
        if (created) {
          onSuccess();
          onClose();
        }
      }
    } catch (err) {
      console.error("Error in submit:", err);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <Dialog.Panel className="bg-white p-6 rounded-lg w-full max-w-lg shadow-xl">
        <Dialog.Title className="text-lg font-bold mb-4">
          {initialData ? 'Edit Category' : 'Create Category'}
        </Dialog.Title>

        <div className="space-y-3">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Category Name"
            className="w-full border px-3 py-2 rounded"
          />
          <select
            name="categoryType"
            value={form.categoryType}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="news">News</option>
            <option value="marketplace">Marketplace</option>
            <option value="podcast">Podcast</option>
          </select>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border px-3 py-2 rounded"
          />
          <input
            name="seoTitle"
            value={form.seoTitle}
            onChange={handleChange}
            placeholder="SEO Title"
            className="w-full border px-3 py-2 rounded"
          />
          <textarea
            name="seoDescription"
            value={form.seoDescription}
            onChange={handleChange}
            placeholder="SEO Description"
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {initialData ? 'Update' : 'Create'}
          </button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
