'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiCalendar, FiArrowRight, FiCheck } from 'react-icons/fi';
import { useState } from 'react';

export default function ReserveButton({ variant = 'primary' }: { variant?: 'primary' | 'secondary' | 'minimal' }) {
  const [isHovered, setIsHovered] = useState(false);
  
  const buttonVariants = {
    primary: {
      background: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700',
      text: 'text-white',
      icon: 'text-blue-100',
      shadow: 'shadow-lg hover:shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50',
      border: 'border-0'
    },
    secondary: {
      background: 'bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20',
      text: 'text-white',
      icon: 'text-blue-200',
      shadow: 'shadow-lg hover:shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40',
      border: ''
    },
    minimal: {
      background: 'bg-transparent hover:bg-white/5',
      text: 'text-white',
      icon: 'text-blue-300',
      shadow: 'shadow-md hover:shadow-lg shadow-blue-500/10',
      border: 'border border-white/10 hover:border-white/20'
    }
  };

  return (
    <motion.div
      className="w-full max-w-md mx-auto px-4 sm:px-6 lg:px-0"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: { 
          duration: 0.6, 
          ease: [0.16, 1, 0.3, 1], 
          delay: 0.1 
        }
      }}
      viewport={{ once: true, margin: '0px 0px -50px 0px' }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link
        href="/requestServices"
        className={`
          relative flex w-full ${buttonVariants[variant].background} ${buttonVariants[variant].text}
          font-semibold text-base sm:text-lg px-6 py-3 sm:px-8 sm:py-4 rounded-xl ${buttonVariants[variant].shadow}
          transition-all duration-300 items-center justify-center gap-3
          overflow-hidden group ${buttonVariants[variant].border}
        `}
      >
        {/* Animated background elements */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-10"
          initial={{ x: '-100%' }}
          whileHover={{
            x: '100%',
            transition: { duration: 1.2, ease: 'linear' }
          }}
        />
        
        {/* Floating particles effect */}
        {isHovered && (
          <>
            <motion.div 
              className="absolute w-2 h-2 rounded-full bg-white/30"
              initial={{ x: -10, y: -5, opacity: 0 }}
              animate={{ 
                x: [0, -5, 0, 5, 0],
                y: [0, -8, -12, -8, 0],
                opacity: [0, 1, 1, 1, 0]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ left: '20%', top: '25%' }}
            />
            <motion.div 
              className="absolute w-1.5 h-1.5 rounded-full bg-blue-300/40"
              initial={{ x: 5, y: 5, opacity: 0 }}
              animate={{ 
                x: [0, 8, 12, 8, 0],
                y: [0, 5, 0, -5, 0],
                opacity: [0, 1, 1, 1, 0]
              }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
              style={{ right: '25%', bottom: '30%' }}
            />
          </>
        )}
        
        {/* Main content */}
        <motion.div
          className="flex items-center justify-center gap-3 z-10"
          whileHover={{ 
            scale: 1.05,
            transition: { duration: 0.2 }
          }}
        >
          <FiCalendar
            className={`${buttonVariants[variant].icon} transition-transform duration-300 group-hover:scale-110`}
            size={variant === 'minimal' ? 18 : 22}
          />

          <span className="relative z-10 whitespace-nowrap">
            Reserve Media Services
          </span>

          <motion.div
            animate={{ 
              x: isHovered ? 5 : 0,
              transition: { duration: 0.3 }
            }}
          >
            <FiArrowRight
              className={`transition-all duration-300 ${buttonVariants[variant].icon}`}
              size={variant === 'minimal' ? 16 : 18}
            />
          </motion.div>
        </motion.div>

        {/* Ripple effect on click */}
        <motion.span
          className="absolute inset-0 bg-white rounded-xl opacity-0"
          whileTap={{
            scale: 3,
            opacity: 0.2,
            transition: { duration: 0.4 }
          }}
        />
        
        {/* Success checkmark animation on hover */}
        {isHovered && (
          <motion.div 
            className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
          >
            <FiCheck size={12} className="text-white" />
          </motion.div>
        )}
      </Link>
      
      {/* Subtle description text that appears on hover */}
      <motion.p 
        className="text-center text-gray-300 mt-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden md:block"
        initial={{ y: -10, opacity: 0 }}
        whileHover={{ y: 0, opacity: 0.7 }}
      >
        Book professional media services for your next event
      </motion.p>
    </motion.div>
  );
}