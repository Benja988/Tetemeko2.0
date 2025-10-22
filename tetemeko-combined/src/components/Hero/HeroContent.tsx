'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  FaBroadcastTower,
  FaShoppingCart,
  FaGlobeAfrica,
  FaBoxOpen,
  FaArrowRight,
} from 'react-icons/fa'
import { FaRadio, FaPodcast } from 'react-icons/fa6'
import ReserveButton from '../ReserveButton'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
}

export default function HeroContent() {
  return (
    <>
      {/* Mobile Layout (Stacked) */}
      <div className="lg:hidden">
        <motion.div
          className="relative z-20 flex flex-col items-center justify-center text-center px-4 xs:px-6 sm:px-8 h-full pt-16 xs:pt-20 sm:pt-24 pb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Enhanced background elements */}
          <div className="absolute inset-0 overflow-hidden z-0">
            <motion.div 
              className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.3, 0.2]
              }}
              transition={{ duration: 8, repeat: Infinity }}
            ></motion.div>
            <motion.div 
              className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.3, 0.2]
              }}
              transition={{ duration: 8, repeat: Infinity, delay: 2 }}
            ></motion.div>
          </div>

          {/* Tagline */}
          <motion.div
            className="relative z-10 mb-5 sm:mb-6"
            variants={itemVariants}
          >
            <motion.span 
              className="inline-flex items-center uppercase tracking-wider bg-gradient-to-r from-blue-600/20 to-purple-600/20 px-4 py-2 rounded-full text-xs font-medium text-white/90 border border-white/10 backdrop-blur-md"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              Kenya&apos;s Premier Multimedia Experience
            </motion.span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="font-bold text-4xl xs:text-5xl sm:text-6xl leading-tight tracking-tight mb-5 sm:mb-6 relative z-10"
            variants={itemVariants}
          >
            <motion.span 
              className="text-white"
              animate={{ textShadow: ["0 0 0px rgba(255,255,255,0)", "0 0 10px rgba(255,255,255,0.3)", "0 0 0px rgba(255,255,255,0)"] }}
              transition={{ duration: 3, repeat: Infinity }}
            >Tune In.</motion.span>
            <motion.span 
              className="block mt-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 5, repeat: Infinity }}
              style={{ backgroundSize: "200% 200%" }}
            >Connect.</motion.span>
            <motion.span 
              className="block mt-3 text-lg sm:text-xl font-normal text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Only at Tetemeko Media
            </motion.span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            className="text-sm sm:text-base text-gray-300 mb-8 sm:mb-10 max-w-md leading-relaxed relative z-10"
            variants={itemVariants}
          >
            Stream electrifying radio, explore trending African stories, dive into bold podcasts, and shop unique products — all in one vibrant digital hub.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col gap-4 w-full max-w-xs relative z-10 mb-8 sm:mb-10"
            variants={itemVariants}
          >
            <Link href="/stations" className="w-full">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-between w-full px-6 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium shadow-lg hover:shadow-blue-500/20 transition-all"
              >
                <span className="flex items-center gap-3">
                  <FaBroadcastTower className="text-lg" /> 
                  <span>Our Stations</span>
                </span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <FaArrowRight />
                </motion.div>
              </motion.button>
            </Link>

            <Link href="/podcasts" className="w-full">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-between w-full px-6 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium shadow-lg hover:shadow-purple-500/20 transition-all"
              >
                <span className="flex items-center gap-3">
                  <FaPodcast className="text-lg" /> 
                  <span>Podcasts</span>
                </span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                >
                  <FaArrowRight />
                </motion.div>
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 gap-4 w-full max-w-xs relative z-10 mb-8"
            variants={itemVariants}
            transition={{ delay: 0.4 }}
          >
            <motion.div 
              className="flex flex-col items-center p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10"
              whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.08)" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <FaRadio className="text-blue-400 text-xl mb-2" /> 
              <span className="text-white font-bold text-lg">3+</span>
              <span className="text-gray-400 text-xs">Stations</span>
            </motion.div>
            <motion.div 
              className="flex flex-col items-center p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10"
              whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.08)" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <FaGlobeAfrica className="text-green-400 text-xl mb-2" /> 
              <span className="text-white font-bold text-lg">10k+</span>
              <span className="text-gray-400 text-xs">Listeners</span>
            </motion.div>
            <motion.div 
              className="flex flex-col items-center p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 col-span-2"
              whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.08)" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <FaBoxOpen className="text-orange-400 text-xl mb-2" /> 
              <span className="text-white font-bold text-lg">1,000+</span>
              <span className="text-gray-400 text-xs">Products</span>
            </motion.div>
          </motion.div>

          {/* Reserve Button */}
          <motion.div 
            className="relative z-10 w-full max-w-xs"
            variants={itemVariants}
          >
            <ReserveButton />
          </motion.div>
        </motion.div>
      </div>

      {/* Desktop Layout (Side by side) */}
      <div className="hidden lg:block">
        <motion.div
          className="relative z-20 flex items-center justify-between h-full px-8 xl:px-16 2xl:px-24 py-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Enhanced background elements */}
          <div className="absolute inset-0 overflow-hidden z-0">
            <motion.div 
              className="absolute top-1/4 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.3, 0.2]
              }}
              transition={{ duration: 8, repeat: Infinity }}
            ></motion.div>
            <motion.div 
              className="absolute bottom-1/4 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.3, 0.2]
              }}
              transition={{ duration: 8, repeat: Infinity, delay: 2 }}
            ></motion.div>
          </div>

          {/* Left Content */}
          <div className="relative z-10 max-w-2xl">
            {/* Tagline */}
            <motion.div
              className="relative z-10 mb-6"
              variants={itemVariants}
            >
              <motion.span 
                className="inline-flex items-center uppercase tracking-wider bg-gradient-to-r from-blue-600/20 to-purple-600/20 px-4 py-2 rounded-full text-xs font-medium text-white/90 border border-white/10 backdrop-blur-md"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Kenya&apos;s Premier Multimedia Experience
              </motion.span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="font-bold text-5xl xl:text-6xl 2xl:text-7xl leading-tight tracking-tight mb-6 relative z-10"
              variants={itemVariants}
            >
              <motion.span 
                className="text-white"
                animate={{ textShadow: ["0 0 0px rgba(255,255,255,0)", "0 0 10px rgba(255,255,255,0.3)", "0 0 0px rgba(255,255,255,0)"] }}
                transition={{ duration: 3, repeat: Infinity }}
              >Tune In.</motion.span>
              <motion.span 
                className="block mt-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ duration: 5, repeat: Infinity }}
                style={{ backgroundSize: "200% 200%" }}
              >Connect.</motion.span>
              <motion.span 
                className="block mt-4 text-xl xl:text-2xl font-normal text-gray-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                Only at Tetemeko Media Group
              </motion.span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              className="text-lg text-gray-300 mb-8 max-w-md leading-relaxed relative z-10"
              variants={itemVariants}
            >
              Stream electrifying radio, explore trending African stories, dive into bold podcasts, and shop unique products — all in one vibrant digital hub.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex gap-4 relative z-10 mb-8"
              variants={itemVariants}
            >
              <Link href="/stations">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium shadow-lg hover:shadow-blue-500/20 transition-all"
                >
                  <FaBroadcastTower className="text-lg" /> 
                  <span>Our Stations</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <FaArrowRight />
                  </motion.div>
                </motion.button>
              </Link>

              <Link href="/podcasts">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium shadow-lg hover:shadow-purple-500/20 transition-all"
                >
                  <FaPodcast className="text-lg" /> 
                  <span>Podcasts</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                  >
                    <FaArrowRight />
                  </motion.div>
                </motion.button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="flex gap-6 relative z-10 mb-8"
              variants={itemVariants}
              transition={{ delay: 0.4 }}
            >
              <motion.div 
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-md border border-white/10"
                whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.08)" }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <FaRadio className="text-blue-400 text-xl" /> 
                <div>
                  <div className="text-white font-bold">3+</div>
                  <div className="text-gray-400 text-sm">Stations</div>
                </div>
              </motion.div>
              <motion.div 
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-md border border-white/10"
                whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.08)" }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <FaGlobeAfrica className="text-green-400 text-xl" /> 
                <div>
                  <div className="text-white font-bold">10k+</div>
                  <div className="text-gray-400 text-sm">Listeners</div>
                </div>
              </motion.div>
              <motion.div 
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-md border border-white/10"
                whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.08)" }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <FaBoxOpen className="text-orange-400 text-xl" /> 
                <div>
                  <div className="text-white font-bold">1,000+</div>
                  <div className="text-gray-400 text-sm">Products</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Reserve Button */}
            <motion.div 
              className="relative z-10"
              variants={itemVariants}
            >
              <ReserveButton />
            </motion.div>
          </div>

          {/* Right Content (Enhanced Visual Element) */}
          <motion.div 
            className="relative z-10 flex-1 flex justify-center"
            variants={itemVariants}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0, transition: { delay: 0.3, duration: 0.8 } }}
          >
            <div className="relative w-80 h-80 xl:w-96 xl:h-96">
              {/* Animated circles */}
              <motion.div 
                className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-xl"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, 0]
                }}
                transition={{ duration: 8, repeat: Infinity }}
              ></motion.div>
              <motion.div 
                className="absolute inset-8 rounded-full bg-gradient-to-br from-blue-600/10 to-purple-600/10 blur-lg"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, -5, 0]
                }}
                transition={{ duration: 6, repeat: Infinity, delay: 1 }}
              ></motion.div>
              <motion.div 
                className="absolute inset-16 rounded-full bg-gradient-to-br from-blue-700/10 to-purple-700/10 blur-md"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 3, 0]
                }}
                transition={{ duration: 4, repeat: Infinity, delay: 2 }}
              ></motion.div>
              
              {/* Central icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div 
                  className="w-32 h-32 xl:w-40 xl:h-40 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-2xl"
                  animate={{ 
                    rotate: [0, 360],
                    boxShadow: [
                      "0 20px 25px -5px rgba(59, 130, 246, 0.4), 0 10px 10px -5px rgba(139, 92, 246, 0.3)",
                      "0 25px 50px -12px rgba(59, 130, 246, 0.5), 0 15px 15px -5px rgba(139, 92, 246, 0.4)",
                      "0 20px 25px -5px rgba(59, 130, 246, 0.4), 0 10px 10px -5px rgba(139, 92, 246, 0.3)"
                    ]
                  }}
                  transition={{ 
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    boxShadow: { duration: 3, repeat: Infinity }
                  }}
                >
                  <FaBroadcastTower className="text-white text-5xl xl:text-6xl" />
                </motion.div>
              </div>

              {/* Floating elements */}
              <motion.div 
                className="absolute top-0 left-0 w-8 h-8 rounded-full bg-blue-400/30 backdrop-blur-sm"
                animate={{ 
                  y: [0, -20, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 4, repeat: Infinity, delay: 0 }}
              />
              <motion.div 
                className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-purple-400/30 backdrop-blur-sm"
                animate={{ 
                  y: [0, 20, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              />
              <motion.div 
                className="absolute top-0 right-0 w-4 h-4 rounded-full bg-white/40 backdrop-blur-sm"
                animate={{ 
                  y: [0, -15, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 3, repeat: Infinity, delay: 2 }}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  )
}