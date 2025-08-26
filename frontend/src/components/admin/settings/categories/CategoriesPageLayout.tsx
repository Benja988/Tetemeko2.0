'use client';

import { useEffect, useState } from 'react';
import CategoryTable from './CategoryTable';
import CategoryFormModal from './CategoryFormModal';
import CategoryFilter from './CategoryFilter';
import { Category } from '@/interfaces/Category';
import { getCategories, deleteCategory } from '@/services/categories/categoryService';
import { toast } from 'sonner';

interface CategoriesPageLayoutProps {
  heading?: string;              
  fixedFilter?: string;          
  showFilter?: boolean;         
}

export default function CategoriesPageLayout({
  heading = 'Manage Categories',
  fixedFilter,
  showFilter = true,
}: CategoriesPageLayoutProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [filter, setFilter] = useState<string>(fixedFilter || '');
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories(filter);
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [filter]);

  const handleCreate = () => {
    setEditingCategory(null);
    setModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setModalOpen(true);
  };

  const handleDelete = async (_id: string) => {
    try {
      const confirmed = confirm('Are you sure you want to delete this category?');
      if (!confirmed) return;

      const success = await deleteCategory(_id);
      if (success) {
        toast.success('Category deleted');
        fetchCategories();
      } else {
        toast.error('Failed to delete category');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{heading}</h1>
        <button
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition"
        >
          Create Category
        </button>
      </div>

      {/* 🔥 Show filter dropdown only if not locked */}
      {showFilter && !fixedFilter && (
        <CategoryFilter value={filter} onChange={setFilter} />
      )}

      {loading ? (
        <p className="text-gray-500 mt-4">Loading categories...</p>
      ) : (
        <CategoryTable
          categories={categories}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchCategories}
        initialData={editingCategory}
      />
    </div>
  );
}
