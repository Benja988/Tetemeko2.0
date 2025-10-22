'use client';

import { useState } from 'react';
import { Product } from '@/services/products';
import Image from 'next/image';

interface MarketplaceTableProps {
  products: Product[];
  selectedProductId: string | null;
  onSelectProduct: (id: string | null) => void;
}

export default function MarketplaceTable({ products, selectedProductId, onSelectProduct }: MarketplaceTableProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggleExpanded = (id: string) => {
    setExpanded((prev) => (prev === id ? null : id));
  };

  return (
    <div className="overflow-x-auto rounded-lg border bg-white">
      <table className="min-w-full table-auto border-collapse">
        <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
          <tr>
            <th className="p-3">Select</th>
            <th className="p-3">Image</th>
            <th className="p-3">Title</th>
            <th className="p-3">Category</th>
            <th className="p-3">Seller</th>
            <th className="p-3">Price</th>
            <th className="p-3">Stock</th>
            <th className="p-3">Status</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <>
              <tr
                key={product._id}
                className={`border-t text-sm hover:bg-gray-50 transition-all duration-200 ${
                  selectedProductId === product._id ? 'bg-blue-50' : ''
                }`}
              >
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedProductId === product._id}
                    onChange={() => onSelectProduct(selectedProductId === product._id ? null : product._id)}
                    className="h-4 w-4"
                  />
                </td>
                <td className="p-3">
                  {product.images[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.title}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 bg-gray-200 rounded" />
                  )}
                </td>
                <td className="p-3 font-medium">{product.title}</td>
                <td className="p-3">{product.category}</td>
                <td className="p-3">{product.seller}</td>
                <td className="p-3">${(product.price * (1 - product.discount / 100)).toFixed(2)}</td>
                <td className="p-3">{product.stock}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium ${
                      product.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => toggleExpanded(product._id)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    {expanded === product._id ? 'Hide Details' : 'View Details'}
                  </button>
                </td>
              </tr>

              {expanded === product._id && (
                <tr className="bg-gray-50 text-sm">
                  <td colSpan={9} className="p-4">
                    <div className="space-y-4">
                      <p><strong>Description:</strong> {product.description}</p>
                      <p><strong>Tags:</strong> {product.tags?.join(', ') || 'None'}</p>
                      <div className="flex space-x-2 mt-2">
                        {product.images?.map((url, idx) => (
                          <Image
                            key={idx}
                            src={url}
                            alt={`${product.title} image ${idx + 1}`}
                            width={80}
                            height={80}
                            className="h-20 w-20 rounded object-cover border"
                          />
                        ))}
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}