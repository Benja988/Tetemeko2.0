'use client'
import { motion, AnimatePresence } from 'framer-motion'
import HeroGrid from './HeroGrid'

export default function HeroMedia({ media }: { media: { type: 'video' | 'image'; src: string } }) {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
      {/* Overlay gradient for better text readability */}
      <div className="absolute inset-0 z-10" />
      
      <AnimatePresence mode="wait">
        {media.type === 'video' ? (
          <motion.video
            key={media.src}
            src={media.src}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />
        ) : (
          <motion.div
            key={media.src}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          >
            <HeroGrid image={media.src} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}