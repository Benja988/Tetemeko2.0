'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { FaQuoteLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { useState, useEffect, useCallback } from 'react'
import { feedbacks } from '@/constants/feedback'

export default function Feedback() {
  const [[currentIndex, direction], setCurrentIndex] = useState([0, 0])
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const navigate = useCallback((newDirection: number) => {
    setCurrentIndex(prev => [
      (prev[0] + newDirection + feedbacks.length) % feedbacks.length, 
      newDirection
    ])
    setIsAutoPlaying(false) // Stop auto-play when user interacts
  }, [])

  const goToIndex = useCallback((index: number) => {
    setCurrentIndex(prev => [index, index > prev[0] ? 1 : -1])
    setIsAutoPlaying(false) // Stop auto-play when user interacts
  }, [])

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return
    
    const interval = setInterval(() => {
      navigate(1)
    }, 5000) // Change slide every 5 seconds
    
    return () => clearInterval(interval)
  }, [isAutoPlaying, navigate])

  // Preload next and previous images
  useEffect(() => {
    const preloadImages = () => {
      const prevIndex = (currentIndex - 1 + feedbacks.length) % feedbacks.length
      const nextIndex = (currentIndex + 1) % feedbacks.length
      
      const preloadImg = (src: string) => {
        const img = new Image()
        img.src = src
      }
      
      preloadImg(feedbacks[prevIndex].image)
      preloadImg(feedbacks[nextIndex].image)
    }
    
    preloadImages()
  }, [currentIndex])

  return (
    <section className="relative py-12 md:py-20 bg-gradient-to-b from-gray-100 to-white overflow-hidden">
      {/* Optimized floating speech bubbles with reduced quantity */}
      <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.05, scale: 1 }}
            transition={{ duration: 1, delay: i * 0.3 }}
            className="absolute bg-blue-500 rounded-full"
            style={{
              width: `${80 + Math.random() * 120}px`,
              height: `${80 + Math.random() * 120}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What Our Listeners Say
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from our community of loyal listeners and partners
          </p>
        </div>

        <div className="relative h-[500px] sm:h-[350px] md:h-[300px]">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 300 : -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -300 : 300 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="bg-white rounded-xl md:rounded-2xl shadow-lg md:shadow-xl p-6 sm:p-8 md:p-10 max-w-3xl mx-auto border border-gray-100">
                <div className="flex flex-col sm:flex-row gap-6 md:gap-8">
                  <div className="flex-shrink-0 mx-auto sm:mx-0">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-blue-100">
                      <img
                        src={feedbacks[currentIndex].image}
                        alt={feedbacks[currentIndex].name}
                        className="w-full h-full object-cover"
                        loading="eager"
                        width={96}
                        height={96}
                      />
                    </div>
                  </div>
                  <div className="text-center sm:text-left">
                    <FaQuoteLeft className="text-blue-200 text-2xl md:text-3xl mb-3 md:mb-4 mx-auto sm:mx-0" />
                    <p className="text-base md:text-lg text-gray-700 italic mb-4 md:mb-6">
                      "{feedbacks[currentIndex].feedback}"
                    </p>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm md:text-base">{feedbacks[currentIndex].name}</h4>
                      <p className="text-blue-600 text-sm">{feedbacks[currentIndex].role}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row justify-center items-center mt-8 md:mt-10 gap-4">
          <div className="flex gap-4 order-2 sm:order-1">
            <button
              onClick={() => navigate(-1)}
              className="p-2 md:p-3 bg-white hover:bg-gray-100 rounded-full shadow-md text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Previous feedback"
            >
              <FaChevronLeft size={18} />
            </button>
            <button
              onClick={() => navigate(1)}
              className="p-2 md:p-3 bg-white hover:bg-gray-100 rounded-full shadow-md text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Next feedback"
            >
              <FaChevronRight size={18} />
            </button>
          </div>
          
          <div className="flex items-center gap-2 order-1 sm:order-2">
            {feedbacks.map((_, index) => (
              <button
                key={index}
                onClick={() => goToIndex(index)}
                className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-colors ${index === currentIndex ? 'bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'}`}
                aria-label={`Go to feedback ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Optional: Auto-play toggle */}
        <div className="text-center mt-6">
          <button 
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            {isAutoPlaying ? 'Pause' : 'Play'} auto rotation
          </button>
        </div>
      </div>
    </section>
  )
}