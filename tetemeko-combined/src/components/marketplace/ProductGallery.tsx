import Image from 'next/image';
import { Product } from '@/interfaces/Products';

export default function ProductGallery({ product }: { product: Product }) {
  return (
    <div className="space-y-4">
      <div className="relative w-full h-[400px] bg-gray-900 rounded-lg overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain"
        />
      </div>
      {product.media && product.media.length > 1 && (
        <div className="flex gap-3 overflow-x-auto">
          {product.media.map((img, i) => (
            <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-800">
              <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
