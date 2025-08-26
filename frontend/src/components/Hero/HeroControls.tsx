'use client'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

export default function HeroControls({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) {
  return (
    <>
      <div className="absolute inset-y-0 left-0 z-30 flex items-center pl-2 sm:pl-4">
        <motion.button 
          onClick={onPrev} 
          className="p-3 bg-black/50 rounded-full text-white hover:bg-black/80 transition-all backdrop-blur-sm group"
          whileHover={{ scale: 1.1, x: -2 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Previous slide"
        >
          <motion.div
            animate={{ x: [0, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronLeft size={24} />
          </motion.div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all opacity-0 group-hover:opacity-100"></div>
        </motion.button>
      </div>
      <div className="absolute inset-y-0 right-0 z-30 flex items-center pr-2 sm:pr-4">
        <motion.button 
          onClick={onNext} 
          className="p-3 bg-black/50 rounded-full text-white hover:bg-black/80 transition-all backdrop-blur-sm group"
          whileHover={{ scale: 1.1, x: 2 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Next slide"
        >
          <motion.div
            animate={{ x: [0, 3, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronRight size={24} />
          </motion.div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/0 to-purple-500/0 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all opacity-0 group-hover:opacity-100"></div>
        </motion.button>
      </div>
      
      {/* Navigation dots for mobile */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2 md:hidden">
        {[0, 1, 2].map((dot) => (
          <motion.button
            key={dot}
            className="w-2 h-2 rounded-full bg-white/50 hover:bg-white/80 transition-all"
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.9 }}
            aria-label={`Go to slide ${dot + 1}`}
          />
        ))}
      </div>
    </>
  )
}