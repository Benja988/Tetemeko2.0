'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  variant?: 'light' | 'dark';
  children?: ReactNode;
  className?: string;
}

export default function SectionHeader({
  title,
  subtitle,
  variant = 'light',
  children,
  className = ''
}: SectionHeaderProps) {
  const textColor = variant === 'light' ? 'text-white' : 'text-gray-500';
  const subtitleColor = variant === 'light' ? 'text-gray-400' : 'text-gray-500';

  return (
    <motion.div 
      className={`mb-12 text-center ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <motion.h2
        className={`text-3xl md:text-4xl font-bold mb-4 ${textColor}`}
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        viewport={{ once: true }}
      >
        {title}
      </motion.h2>
      
      {subtitle && (
        <motion.p
          className={`text-lg max-w-2xl mx-auto ${subtitleColor}`}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          viewport={{ once: true }}
        >
          {subtitle}
        </motion.p>
      )}

      {children && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-6"
        >
          {children}
        </motion.div>
      )}
    </motion.div>
  );
}