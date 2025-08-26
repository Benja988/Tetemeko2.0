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
          {/* Background elements */}
          <div className="absolute inset-0 overflow-hidden z-0">
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
          </div>

          {/* Tagline */}
          <motion.div
            className="relative z-10 mb-5 sm:mb-6"
            variants={itemVariants}
          >
            <span className="inline-flex items-center uppercase tracking-wider bg-gradient-to-r from-blue-600/10 to-purple-600/10 px-4 py-2 rounded-full text-xs font-medium text-white/90 border border-white/10 backdrop-blur-md">
              Kenya&apos;s Premier Multimedia Experience
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="font-bold text-4xl xs:text-5xl sm:text-6xl leading-tight tracking-tight mb-5 sm:mb-6 relative z-10"
            variants={itemVariants}
          >
            <span className="text-white">Tune In.</span>
            <span className="block mt-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Connect.
            </span>
            <span className="block mt-3 text-lg sm:text-xl font-normal text-gray-300">
              Only at Tetemeko Media
            </span>
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
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-between w-full px-6 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium shadow-lg"
              >
                <span className="flex items-center gap-3">
                  <FaBroadcastTower className="text-lg" /> 
                  <span>Our Stations</span>
                </span>
                <FaArrowRight />
              </motion.button>
            </Link>

            <Link href="/podcasts" className="w-full">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-between w-full px-6 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium shadow-lg"
              >
                <span className="flex items-center gap-3">
                  <FaPodcast className="text-lg" /> 
                  <span>Podcasts</span>
                </span>
                <FaArrowRight />
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 gap-4 w-full max-w-xs relative z-10 mb-8"
            variants={itemVariants}
            transition={{ delay: 0.4 }}
          >
            <div className="flex flex-col items-center p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10">
              <FaRadio className="text-blue-400 text-xl mb-2" /> 
              <span className="text-white font-bold text-lg">3+</span>
              <span className="text-gray-400 text-xs">Stations</span>
            </div>
            <div className="flex flex-col items-center p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10">
              <FaGlobeAfrica className="text-green-400 text-xl mb-2" /> 
              <span className="text-white font-bold text-lg">10k+</span>
              <span className="text-gray-400 text-xs">Listeners</span>
            </div>
            <div className="flex flex-col items-center p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 col-span-2">
              <FaBoxOpen className="text-orange-400 text-xl mb-2" /> 
              <span className="text-white font-bold text-lg">1,000+</span>
              <span className="text-gray-400 text-xs">Products</span>
            </div>
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
          {/* Background elements */}
          <div className="absolute inset-0 overflow-hidden z-0">
            <div className="absolute top-1/4 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
          </div>

          {/* Left Content */}
          <div className="relative z-10 max-w-2xl">
            {/* Tagline */}
            <motion.div
              className="relative z-10 mb-6"
              variants={itemVariants}
            >
              <span className="inline-flex items-center uppercase tracking-wider bg-gradient-to-r from-blue-600/10 to-purple-600/10 px-4 py-2 rounded-full text-xs font-medium text-white/90 border border-white/10 backdrop-blur-md">
                Kenya&apos;s Premier Multimedia Experience
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="font-bold text-5xl xl:text-6xl 2xl:text-7xl leading-tight tracking-tight mb-6 relative z-10"
              variants={itemVariants}
            >
              <span className="text-white">Tune In.</span>
              <span className="block mt-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Connect.
              </span>
              <span className="block mt-4 text-xl xl:text-2xl font-normal text-gray-300">
                Only at Tetemeko Media Group
              </span>
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
                  className="flex items-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium shadow-lg"
                >
                  <FaBroadcastTower className="text-lg" /> 
                  <span>Our Stations</span>
                </motion.button>
              </Link>

              <Link href="/podcasts">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium shadow-lg"
                >
                  <FaPodcast className="text-lg" /> 
                  <span>Podcasts</span>
                </motion.button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="flex gap-6 relative z-10 mb-8"
              variants={itemVariants}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-md border border-white/10">
                <FaRadio className="text-blue-400 text-xl" /> 
                <div>
                  <div className="text-white font-bold">3+</div>
                  <div className="text-gray-400 text-sm">Stations</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-md border border-white/10">
                <FaGlobeAfrica className="text-green-400 text-xl" /> 
                <div>
                  <div className="text-white font-bold">10k+</div>
                  <div className="text-gray-400 text-sm">Listeners</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-md border border-white/10">
                <FaBoxOpen className="text-orange-400 text-xl" /> 
                <div>
                  <div className="text-white font-bold">1,000+</div>
                  <div className="text-gray-400 text-sm">Products</div>
                </div>
              </div>
            </motion.div>

            {/* Reserve Button */}
            <motion.div 
              className="relative z-10"
              variants={itemVariants}
            >
              <ReserveButton />
            </motion.div>
          </div>

          {/* Right Content (Visual Element) */}
          <motion.div 
            className="relative z-10 flex-1 flex justify-center"
            variants={itemVariants}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0, transition: { delay: 0.3, duration: 0.8 } }}
          >
            <div className="relative w-80 h-80 xl:w-96 xl:h-96">
              {/* Animated circles */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-xl animate-pulse-slow"></div>
              <div className="absolute inset-8 rounded-full bg-gradient-to-br from-blue-600/10 to-purple-600/10 blur-lg animate-pulse-medium"></div>
              <div className="absolute inset-16 rounded-full bg-gradient-to-br from-blue-700/10 to-purple-700/10 blur-md animate-pulse-fast"></div>
              
              {/* Central icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 xl:w-40 xl:h-40 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-2xl">
                  <FaBroadcastTower className="text-white text-5xl xl:text-6xl" />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  )
}