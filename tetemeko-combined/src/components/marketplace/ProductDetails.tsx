import { Product } from '@/interfaces/Products';
import AddToCartButton from './AddToCartButton';

export default function ProductDetails({ product }: { product: Product }) {
  const originalPrice = product.price + (product.discount || 0);
  const discountPercent = product.discount
    ? Math.round((product.discount / originalPrice) * 100)
    : null;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
      <p className="text-gray-400 mb-4">{product.shortDescription}</p>

      <div className="mb-4">
        <p className="text-2xl font-bold text-green-400">
          ${product.price.toFixed(2)}
          {product.discount && (
            <>
              <span className="text-sm text-red-400 ml-2 line-through">
                ${originalPrice.toFixed(2)}
              </span>
              <span className="text-sm text-yellow-500 ml-2">
                ({discountPercent}% OFF)
              </span>
            </>
          )}
        </p>
      </div>

      <p className="mb-6 text-gray-300">{product.description}</p>
      <AddToCartButton inStock={product.countInStock > 0} />
    </div>
  );
}
