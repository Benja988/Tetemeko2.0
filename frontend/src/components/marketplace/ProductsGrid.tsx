import React from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/interfaces/Products';

type ProductsGridProps = {
    products: Product[];
    variant?: 'grid' | 'horizontal';
};

export default function ProductsGrid({ products, variant = 'grid' }: ProductsGridProps) {
  if (products.length === 0) {
    return <p className="text-center text-gray-500">No products found.</p>;
  }

  const containerClass =
    variant === 'grid'
      ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
      : 'flex overflow-x-auto gap-4 px-4';

  return (
    <div className={containerClass}>
      {products.map((product, idx) => (
        <ProductCard key={product.id} product={product} index={idx} variant={variant} />
      ))}
    </div>
  );
}

