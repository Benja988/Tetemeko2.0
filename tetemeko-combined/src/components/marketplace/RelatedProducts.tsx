import { Product } from '@/interfaces/Products';
import { products } from '@/data/products';
import ProductCard from './ProductCard';

type Props = {
  currentProduct: Product;
};

export default function RelatedProducts({ currentProduct }: Props) {
  // Related by category or brand
  const related = products
    .filter(
      (p) =>
        p.id !== currentProduct.id &&
        (p.category === currentProduct.category || p.brand === currentProduct.brand)
    )
    .slice(0, 4); // Limit to 4 related

  if (related.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Related Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {related.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
