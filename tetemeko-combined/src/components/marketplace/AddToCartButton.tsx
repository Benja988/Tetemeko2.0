// src/components/marketplace/AddToCartButton.tsx

export default function AddToCartButton({ inStock }: { inStock: boolean }) {
  return (
    <button
      className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
      disabled={!inStock}
    >
      {inStock ? 'Add to Cart' : 'Out of Stock'}
    </button>
  );
}
