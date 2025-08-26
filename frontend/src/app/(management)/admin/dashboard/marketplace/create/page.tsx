'use client';

import { useRouter } from 'next/navigation';
import ProductForm from '@/components/admin/marketplace/ProductForm';
import { toast } from 'sonner';

export default function CreateProductPage() {
  const router = useRouter();

  const handleSave = () => {
    toast.success('Product created successfully.');
    router.push('/admin/dashboard/marketplace');
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Create Product</h1>
      <ProductForm
        productId={null}
        onClose={() => router.push('/admin/dashboard/marketplace')}
        onSave={handleSave}
      />
    </div>
  );
}