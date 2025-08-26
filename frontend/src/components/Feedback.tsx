'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { feedbacks } from '@/constants/feedback'
import { FaQuoteLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { useState } from 'react'

export default function Feedback() {
  const [[currentIndex, direction], setCurrentIndex] = useState([0, 0])

  const navigate = (newDirection: number) => {
    setCurrentIndex([(currentIndex + newDirection + feedbacks.length) % feedbacks.length, newDirection])
  }

  return (
    <section className="relative py-20 bg-gradient-to-b from-gray-100 to-white overflow-hidden">
      {/* Floating speech bubbles */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.05, scale: 1 }}
            transition={{ duration: 1, delay: i * 0.3 }}
            className="absolute bg-blue-500 rounded-full"
            style={{
              width: `${100 + Math.random() * 200}px`,
              height: `${100 + Math.random() * 200}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What Our Listeners Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from our community of loyal listeners and partners
          </p>
        </div>

        <div className="relative h-[400px] sm:h-[300px]">
          <AnimatePresence custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 300 : -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -300 : 300 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 max-w-3xl mx-auto border border-gray-100">
                <div className="flex flex-col sm:flex-row gap-8">
                  <div className="flex-shrink-0">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-blue-100">
                      <img
                        src={feedbacks[currentIndex].image}
                        alt={feedbacks[currentIndex].name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <FaQuoteLeft className="text-blue-200 text-3xl mb-4" />
                    <p className="text-lg text-gray-700 italic mb-6">
                      "{feedbacks[currentIndex].feedback}"
                    </p>
                    <div>
                      <h4 className="font-bold text-gray-900">{feedbacks[currentIndex].name}</h4>
                      <p className="text-blue-600">{feedbacks[currentIndex].role}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex justify-center mt-10 gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-3 bg-white hover:bg-gray-100 rounded-full shadow-md text-blue-600 transition-colors"
          >
            <FaChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            {feedbacks.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex([index, index > currentIndex ? 1 : -1])}
                className={`w-3 h-3 rounded-full transition-colors ${index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'}`}
              />
            ))}
          </div>
          <button
            onClick={() => navigate(1)}
            className="p-3 bg-white hover:bg-gray-100 rounded-full shadow-md text-blue-600 transition-colors"
          >
            <FaChevronRight size={20} />
          </button>
        </div>

        {/* CTA */}
        {/* <div className="text-center mt-16">
          <button className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-all shadow-lg hover:shadow-blue-500/30">
            Share Your Experience
          </button>
        </div> */}
      </div>
    </section>
  )
}