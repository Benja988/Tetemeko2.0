'use client';

interface MarketplaceActionsProps {
  onAddProduct: () => void;
  onEditProduct: (productId: string | null) => void;
  onDeleteSelected: () => void;
  onExport: () => void;
}

export default function MarketplaceActions({
  onAddProduct,
  onEditProduct,
  onDeleteSelected,
  onExport,
}: MarketplaceActionsProps) {
  return (
    <div className="flex gap-4 mb-6">
      <button
        onClick={onAddProduct}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
      >
        Add Product
      </button>
      <button
        onClick={() => onEditProduct(null)}
        className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition-colors"
      >
        Edit Selected
      </button>
      <button
        onClick={onDeleteSelected}
        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
      >
        Delete Selected
      </button>
      <button
        onClick={onExport}
        className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
      >
        Export
      </button>
    </div>
  );
}