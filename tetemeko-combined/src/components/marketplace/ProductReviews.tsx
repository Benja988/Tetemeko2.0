import { Product } from '@/interfaces/Products';

export default function ProductReviews({ product }: { product: Product }) {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
      <div className="text-sm text-gray-400 mb-2">
        ⭐ {product.rating} ({product.numReviews} reviews)
      </div>

      {/* Sample static reviews — replace with real data or a reviews array */}
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-gray-900 rounded-lg p-4 shadow-sm">
            <p className="text-yellow-500 mb-1">⭐⭐⭐⭐☆</p>
            <p className="text-gray-300 mb-1">"Great product! The quality is excellent and delivery was fast."</p>
            <p className="text-xs text-gray-500">— John Doe, 2 weeks ago</p>
          </div>
        ))}
      </div>
    </section>
  );
}
