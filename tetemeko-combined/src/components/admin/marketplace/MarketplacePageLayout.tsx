'use client';

import { useState, useEffect } from 'react';
import { getProducts, Product, ProductFilter } from '@/services/products';
import { toast } from 'sonner';
import MarketplaceActions from './MarketplaceActions';
import MarketplaceTabs from './MarketplaceTabs';
import MarketplaceSearchFilter from './MarketplaceSearchFilter';
import MarketplaceTable from './MarketplaceTable';
import ProductForm from './ProductForm';


export default function MarketplacePageLayout({ heading }: { heading: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });

  const fetchProducts = async () => {
    setIsLoading(true);
    const filters: ProductFilter = {
      page: pagination.page,
      limit: pagination.limit,
    };
    if (searchTerm) filters.query = searchTerm;
    if (statusFilter !== 'All') filters.featured = statusFilter === 'Featured' ? true : undefined;
    if (statusFilter === 'Active' || statusFilter === 'Inactive') {
      filters.status = statusFilter.toLowerCase() as 'active' | 'inactive';
    }

    const response = await getProducts(filters);
    setProducts(response.products);
    setPagination({ page: response.page, limit: response.limit, total: response.total });
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, statusFilter, pagination.page]);

  const handleAddProduct = () => {
    setSelectedProductId(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (productId: string | null) => {
    if (!productId && !selectedProductId) {
      toast.error('Please select a product to edit.');
      return;
    }
    setSelectedProductId(productId || selectedProductId);
    setIsModalOpen(true);
  };

  const handleDeleteSelected = async () => {
    if (!selectedProductId) {
      toast.error('Please select a product to delete.');
      return;
    }
    // Implement delete logic
    toast.info('Delete functionality to be implemented.');
  };

  const handleExport = () => {
    // Implement export logic (e.g., CSV download)
    toast.info('Export functionality to be implemented.');
  };

  const handleProductSaved = () => {
    setIsModalOpen(false);
    setSelectedProductId(null);
    fetchProducts();
  };

  return (
    <div className="p-6 space-y-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-semibold text-gray-800">{heading}</h1>

      <MarketplaceActions
        onAddProduct={handleAddProduct}
        onEditProduct={handleEditProduct}
        onDeleteSelected={handleDeleteSelected}
        onExport={handleExport}
      />

      <MarketplaceTabs currentFilter={statusFilter} onChangeFilter={setStatusFilter} />

      <MarketplaceSearchFilter searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      {isLoading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <MarketplaceTable
          products={products}
          selectedProductId={selectedProductId}
          onSelectProduct={setSelectedProductId}
        />
      )}

      {isModalOpen && (
        <ProductForm
          productId={selectedProductId}
          onClose={() => setIsModalOpen(false)}
          onSave={handleProductSaved}
        />
      )}
    </div>
  );
}