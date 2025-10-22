'use client'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState, useRef, useCallback, useEffect } from 'react'
import { FiShoppingCart, FiStar, FiArrowRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { RiFlashlightFill } from 'react-icons/ri'
import { FaRegHeart, FaHeart, FaRegEye } from 'react-icons/fa'

type ColorOption = {
  hex: string
  name: string
}

type Product = {
  id: number
  name: string
  description: string
  image: string
  price: string
  originalPrice: string
  slug: string
  rating: number
  reviews: number
  tag: string
  colors: ColorOption[]
  model: string
  stock: number
  sizes?: string[]
  details: string[]
}

const products: Product[] = [
  {
    id: 1,
    name: 'Tetemeko Cap',
    description: 'Premium quality snapback with embroidered logo. Adjustable strap for perfect fit. Made from durable polyester with moisture-wicking technology.',
    image: 'https://picsum.photos/seed/tetemeko-cap/800/1000',
    price: 'Ksh 1,200',
    originalPrice: 'Ksh 1,800',
    slug: 'tetemeko-cap',
    rating: 4.5,
    reviews: 28,
    tag: 'Bestseller',
    colors: [
      { hex: '#3b82f6', name: 'Navy Blue' },
      { hex: '#10b981', name: 'Forest Green' },
      { hex: '#f59e0b', name: 'Golden Yellow' }
    ],
    model: '/models/cap.glb',
    stock: 15,
    sizes: ['One Size'],
    details: [
      '100% Polyester',
      'Adjustable snapback closure',
      'Embroidered logo',
      'Moisture-wicking sweatband'
    ]
  },
  {
    id: 2,
    name: 'Limited Edition Hoodie',
    description: 'Comfortable fleece-lined hoodie with exclusive print. Made from premium cotton blend for warmth and durability. Kangaroo pocket and adjustable drawstrings.',
    image: 'https://picsum.photos/seed/limited-hoodie/800/1000',
    price: 'Ksh 3,500',
    originalPrice: 'Ksh 4,200',
    slug: 'hoodie-limited',
    rating: 4.8,
    reviews: 42,
    tag: 'New',
    colors: [
      { hex: '#ec4899', name: 'Hot Pink' },
      { hex: '#8b5cf6', name: 'Royal Purple' },
      { hex: '#000000', name: 'Classic Black' }
    ],
    model: '/models/hoodie.glb',
    stock: 8,
    sizes: ['S', 'M', 'L', 'XL'],
    details: [
      '80% Cotton, 20% Polyester',
      'Fleece lining',
      'Reinforced stitching',
      'Machine wash cold'
    ]
  },
  {
    id: 3,
    name: 'Podcast Mic Kit',
    description: 'Professional USB microphone with accessories. Perfect for content creators. Includes pop filter, shock mount, and adjustable stand. Cardioid pickup pattern for focused audio capture.',
    image: 'https://picsum.photos/seed/podcast-mic/800/1000',
    price: 'Ksh 7,000',
    originalPrice: 'Ksh 8,500',
    slug: 'podcast-mic-kit',
    rating: 4.7,
    reviews: 35,
    tag: 'Bundle',
    colors: [
      { hex: '#64748b', name: 'Slate Gray' },
      { hex: '#1e293b', name: 'Midnight' },
      { hex: '#f1f5f9', name: 'Arctic White' }
    ],
    model: '/models/mic.glb',
    stock: 5,
    details: [
      'USB-C connectivity',
      '192kHz/24bit resolution',
      'Built-in headphone jack',
      'Volume control and mute button'
    ]
  },
  {
    id: 4,
    name: 'Studio Headphones',
    description: 'Noise-cancelling headphones for crystal clear audio. 40mm drivers for rich sound. Memory foam ear cushions for extended comfort. Foldable design with carrying case included.',
    image: 'https://picsum.photos/seed/studio-headphones/800/1000',
    price: 'Ksh 4,900',
    originalPrice: 'Ksh 6,200',
    slug: 'studio-headphones',
    rating: 4.9,
    reviews: 56,
    tag: 'Premium',
    colors: [
      { hex: '#f43f5e', name: 'Rose Red' },
      { hex: '#0ea5e9', name: 'Sky Blue' },
      { hex: '#eab308', name: 'Gold' }
    ],
    model: '/models/headphones.glb',
    stock: 12,
    details: [
      '20Hz-20kHz frequency response',
      'Active noise cancellation',
      '30-hour battery life',
      'Built-in microphone'
    ]
  }
]

interface ProductCardProps {
  product: Product
  index: number
  isActive: boolean
  setActiveProduct: (index: number) => void
}

const ProductCard: React.FC<ProductCardProps> = React.memo(({ product, index, isActive, setActiveProduct }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      viewport={{ once: true, margin: "0px 0px -100px 0px" }}
      onClick={() => setActiveProduct(index)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative bg-neutral-900 rounded-xl overflow-hidden border-2 ${isActive ? 'border-blue-500' : 'border-neutral-800'} cursor-pointer transition-all duration-300 hover:border-blue-400 group`}
    >
      <div className="relative aspect-square">
        <Image
          src={product.image}
          alt={product.name}
          width={800}
          height={1000}
          className="object-cover w-full h-full"
          loading="lazy"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        
        <button 
          onClick={(e) => {
            e.stopPropagation()
            setIsFavorite(!isFavorite)
          }}
          className="absolute top-3 right-3 p-2 bg-black/50 rounded-full backdrop-blur-sm z-10 hover:bg-black/70 transition-colors"
        >
          {isFavorite ? (
            <FaHeart className="text-red-500" size={16} />
          ) : (
            <FaRegHeart className="text-white" size={16} />
          )}
        </button>
        
        {product.stock < 10 && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-red-600 text-white text-xs font-bold rounded-md z-10">
            Only {product.stock} left
          </div>
        )}
        
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 flex items-center justify-center"
            >
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-white text-black px-3 py-1 rounded-full flex items-center gap-1 text-sm font-medium"
              >
                <FaRegEye size={14} /> Quick View
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h4 className="font-bold text-white line-clamp-1 flex-1 pr-2">{product.name}</h4>
          <div className="flex items-center gap-1 text-yellow-400 text-sm">
            <FiStar className="fill-current" size={14} />
            <span>{product.rating}</span>
          </div>
        </div>
        
        <div className="mt-3 flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-sm font-bold">{product.price}</span>
            {product.originalPrice && (
              <span className="text-xs text-neutral-500 line-through">{product.originalPrice}</span>
            )}
          </div>
          <Link 
            href={`/marketplace/products/${product.slug}`} 
            className="p-2 bg-neutral-800 rounded-lg hover:bg-blue-600 transition-colors duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <FiShoppingCart size={16} className="text-white" />
          </Link>
        </div>
      </div>
    </motion.div>
  )
})

export default function ShopFromUs() {
  const [activeProduct, setActiveProduct] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [selectedColor, setSelectedColor] = useState(0)
  const [selectedSize, setSelectedSize] = useState(0)
  const [autoRotate, setAutoRotate] = useState(true)
  const constraintsRef = useRef(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const handleSetActiveProduct = useCallback((index: number) => {
    setActiveProduct(index)
    setSelectedColor(0)
    setSelectedSize(0)
  }, [])

  const nextProduct = useCallback(() => {
    setActiveProduct(prev => (prev + 1) % products.length)
    setSelectedColor(0)
    setSelectedSize(0)
  }, [])

  const prevProduct = useCallback(() => {
    setActiveProduct(prev => (prev - 1 + products.length) % products.length)
    setSelectedColor(0)
    setSelectedSize(0)
  }, [])

  useEffect(() => {
    if (autoRotate) {
      intervalRef.current = setInterval(() => {
        nextProduct()
      }, 5000)
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current)
      }
    }
  }, [autoRotate, nextProduct])

  const currentProduct = products[activeProduct]

  return (
    <section className="relative w-full py-20 md:py-32 overflow-hidden bg-neutral-950 text-white">
      <style jsx>{`
        .rotate-3d {
          animation: rotate 30s linear infinite;
        }
        .rotate-3d.paused {
          animation-play-state: paused;
        }
        @keyframes rotate {
          from {
            transform: rotateY(0deg);
          }
          to {
            transform: rotateY(360deg);
          }
        }
        .color-dot::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 2px solid white;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .color-dot.selected::after {
          opacity: 1;
        }
      `}</style>

      {/* Background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]"></div>
      </div>
      
      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-blue-900/20 blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-60 h-60 rounded-full bg-purple-900/20 blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header section */}
        <div className="text-center mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold tracking-wider text-blue-400 bg-blue-900/30 rounded-full mb-6 uppercase border border-blue-900/50"
          >
            <RiFlashlightFill className="text-blue-300" />
            HOT COLLECTION
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">Tetemeko</span> Merch
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl text-neutral-400 max-w-3xl mx-auto leading-relaxed"
          >
            Premium gear for creators and fans. Designed for <span className="text-blue-300">quality</span>, built for <span className="text-purple-300">expression</span>.
          </motion.p>
        </div>

        {/* Main product display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Product 3D viewer */}
          <motion.div 
            ref={constraintsRef}
            className="relative h-[400px] md:h-[500px] w-full rounded-3xl bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-white/10 overflow-hidden shadow-xl"
            onPointerDown={() => setIsDragging(true)}
            onPointerUp={() => setIsDragging(false)}
          >
            <motion.div
              drag
              dragConstraints={constraintsRef}
              dragElastic={0.1}
              dragMomentum={false}
              className={`relative w-full h-full flex items-center justify-center ${isDragging ? '' : autoRotate ? 'rotate-3d' : 'rotate-3d paused'}`}
            >
              <Image
                src={currentProduct.image}
                alt={currentProduct.name}
                width={800}
                height={1000}
                className="object-contain"
                priority={true}
              />
            </motion.div>

            {/* Navigation dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {products.map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleSetActiveProduct(i)}
                  className={`w-3 h-3 rounded-full transition-all ${i === activeProduct ? 'bg-white w-6' : 'bg-white/30 hover:bg-white/50'}`}
                />
              ))}
            </div>

            {/* Auto-rotate toggle */}
            <button 
              onClick={() => setAutoRotate(!autoRotate)}
              className="absolute top-4 right-4 bg-black/50 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 z-10 hover:bg-black/70 transition-colors"
            >
              {autoRotate ? '⏸️ Pause' : '▶️ Auto-rotate'}
            </button>

            {/* Drag hint */}
            <motion.div
              animate={{ 
                x: [0, 10, 0],
                opacity: isDragging ? 0 : [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity 
              }}
              className="absolute bottom-6 right-6 bg-black/50 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 z-10"
            >
              ← Drag to rotate →
            </motion.div>
          </motion.div>

          {/* Product details */}
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="inline-block px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg mb-3">
                  {currentProduct.tag}
                </span>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {currentProduct.name}
                </h3>
                <div className="flex items-center gap-1 text-yellow-400 mb-4">
                  <FiStar className="fill-current" />
                  <span className="font-medium">{currentProduct.rating}</span>
                  <span className="text-neutral-500 text-sm ml-1">({currentProduct.reviews} reviews)</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-white">{currentProduct.price}</span>
                {currentProduct.originalPrice && (
                  <span className="block text-sm text-neutral-500 line-through">{currentProduct.originalPrice}</span>
                )}
                {currentProduct.stock > 0 ? (
                  <span className="block text-xs text-green-400 mt-1">{currentProduct.stock} in stock</span>
                ) : (
                  <span className="block text-xs text-red-400 mt-1">Out of stock</span>
                )}
              </div>
            </div>

            <p className="text-neutral-400">{currentProduct.description}</p>

            {/* Product details list */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-white">Product Details:</h4>
              <ul className="list-disc list-inside text-neutral-400 text-sm space-y-1">
                {currentProduct.details.map((detail, i) => (
                  <li key={i}>{detail}</li>
                ))}
              </ul>
            </div>

            {/* Color options */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-white">Color: <span className="text-neutral-400">{currentProduct.colors[selectedColor].name}</span></h4>
              <div className="flex gap-3">
                {currentProduct.colors.map((color, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(i)}
                    className={`color-dot w-8 h-8 rounded-full relative ${selectedColor === i ? 'selected' : ''}`}
                    style={{ backgroundColor: color.hex }}
                    aria-label={`Color option: ${color.name}`}
                  />
                ))}
              </div>
            </div>

            {/* Size options (if available) */}
            {currentProduct.sizes && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-white">Size: <span className="text-neutral-400">{currentProduct.sizes[selectedSize]}</span></h4>
                <div className="flex flex-wrap gap-2">
                  {currentProduct.sizes.map((size, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedSize(i)}
                      className={`px-4 py-2 text-sm rounded-md border ${selectedSize === i ? 'bg-blue-600 border-blue-600 text-white' : 'bg-neutral-900 border-neutral-700 text-neutral-300 hover:border-neutral-500'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-4 pt-6">
              <Link href={`/marketplace/products/${currentProduct.slug}`} className="flex-1">
                <button className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-sm font-medium rounded-lg text-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
                  <FiShoppingCart size={18} /> Add to Cart
                </button>
              </Link>
              
              <Link 
                href={`/marketplace/products/${currentProduct.slug}`} 
                className="flex items-center justify-center p-4 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-neutral-400 hover:text-white transition-all duration-300"
              >
                <FiArrowRight size={20} />
              </Link>
            </div>

            {/* Navigation arrows */}
            <div className="flex justify-between pt-6 border-t border-neutral-800">
              <button 
                onClick={prevProduct}
                className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
              >
                <FiChevronLeft size={20} /> Previous
              </button>
              <button 
                onClick={nextProduct}
                className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
              >
                Next <FiChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Product thumbnails grid */}
        <div className="mt-16 md:mt-20 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              isActive={index === activeProduct}
              setActiveProduct={handleSetActiveProduct}
            />
          ))}
        </div>

        {/* CTA section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16 md:mt-20"
        >
          <Link href="/marketplace">
            <button className="inline-flex items-center px-8 py-4 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-blue-500/50 text-sm font-medium rounded-full text-white transition-all duration-500 hover:shadow-lg hover:shadow-blue-500/10 group">
              Explore Full Collection
              <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}