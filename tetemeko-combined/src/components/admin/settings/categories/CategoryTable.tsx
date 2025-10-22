import { Category } from '@/interfaces/Category';
import CategoryRowActions from './CategoryRowActions';

interface Props {
  categories: Category[];
  onEdit: (cat: Category) => void;
  onDelete: (_id: string) => void;
}

export default function CategoryTable({ categories, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-x-auto mt-6 rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full bg-white text-sm text-gray-700">
        <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
          <tr>
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-left">Slug</th>
            <th className="px-4 py-3 text-left">Type</th>
            <th className="px-4 py-3 text-left">Description</th>
            <th className="px-4 py-3 text-left">SEO Title</th>
            <th className="px-4 py-3 text-left">SEO Description</th>
            <th className="px-4 py-3 text-left">Created At</th>
            <th className="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-4 py-6 text-center text-gray-400 italic">
                No categories found.
              </td>
            </tr>
          ) : (
            categories.map((cat, idx) => (
              <tr
                key={cat._id}
                className={`border-t ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition`}
              >
                <td className="px-4 py-3 font-medium">{cat.name}</td>
                <td className="px-4 py-3">{cat.slug}</td>
                <td className="px-4 py-3 capitalize">{cat.categoryType}</td>
                <td className="px-4 py-3">{cat.description || '-'}</td>
                <td className="px-4 py-3">{cat.seoTitle || '-'}</td>
                <td className="px-4 py-3">{cat.seoDescription || '-'}</td>
                <td className="px-4 py-3">{new Date(cat.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <CategoryRowActions category={cat} onEdit={onEdit} onDelete={onDelete} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
