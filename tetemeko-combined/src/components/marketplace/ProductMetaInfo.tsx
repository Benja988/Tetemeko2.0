import { Product } from '@/interfaces/Products';

export default function ProductMetaInfo({ product }: { product: Product }) {
  return (
    <div className="text-sm text-gray-400 mt-6 space-y-1">
      <p><strong>Category:</strong> {product.category}</p>
      <p><strong>Brand:</strong> {product.brand}</p>
      <p><strong>SKU:</strong> {product.sku || 'N/A'}</p>
      <p><strong>In Stock:</strong> {product.countInStock}</p>
      <p><strong>Weight:</strong> {product.weight || '-'}</p>
      <p><strong>Dimensions:</strong> {product.dimensions || '-'}</p>
      <p><strong>Seller:</strong> {product.seller}</p>
      <p><strong>Tags:</strong> {product.tags?.join(', ') || '—'}</p>
      <p><strong>Rating:</strong> ⭐ {product.rating} ({product.numReviews} reviews)</p>
      <p><strong>Status:</strong> {product.status}</p>
      <p><strong>Estimated Delivery:</strong> 3-7 business days</p>
      <p><strong>Last Updated:</strong> {new Date(product.updatedAt || product.createdAt).toLocaleDateString()}</p>
    </div>
  );
}
