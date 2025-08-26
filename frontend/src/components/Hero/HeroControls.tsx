'use client'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

export default function HeroControls({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) {
  return (
    <>
      <div className="absolute inset-y-0 left-0 z-30 flex items-center pl-2 sm:pl-4">
        <motion.button 
          onClick={onPrev} 
          className="p-3 bg-black/50 rounded-full text-white hover:bg-black/80 transition-all backdrop-blur-sm"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </motion.button>
      </div>
      <div className="absolute inset-y-0 right-0 z-30 flex items-center pr-2 sm:pr-4">
        <motion.button 
          onClick={onNext} 
          className="p-3 bg-black/50 rounded-full text-white hover:bg-black/80 transition-all backdrop-blur-sm"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </motion.button>
      </div>
      
      {/* Navigation dots for mobile */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2 md:hidden">
        {[0, 1, 2].map((dot) => (
          <button
            key={dot}
            className="w-2 h-2 rounded-full bg-white/50 hover:bg-white/80 transition-all"
            aria-label={`Go to slide ${dot + 1}`}
          />
        ))}
      </div>
    </>
  )
}