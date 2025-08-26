'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { services } from '@/constants/services';
import ReserveButton from './ReserveButton';
import { FiArrowRight } from 'react-icons/fi';
import React from 'react';
import Link from 'next/link';

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.16, 0.77, 0.47, 0.97],
    },
  }),
  hover: {
    y: -10,
    transition: { duration: 0.3 }
  }
};

type ServiceCardProps = {
  service: {
    icon: React.ReactNode;
    title: string;
    description: string;
  };
  index: number;
};

const ServiceCard = React.memo(({ service, index }: ServiceCardProps) => (
  <motion.div
    custom={index}
    initial="hidden"
    whileInView="visible"
    whileHover="hover"
    viewport={{ once: true, margin: "-50px" }}
    variants={cardVariants}
    className="group relative bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-gray-700 hover:border-blue-500/50 transition-all duration-500 overflow-hidden"
  >
    {/* Card Background Effect */}
    <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-purple-600/10" />
    </div>

    {/* Floating Icon */}
    <div className="relative z-10 mb-4 sm:mb-6">
      <div className="absolute -top-1 -left-1 w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-blue-600/30 group-hover:bg-blue-600/50 transition-all duration-500" />
      <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 p-2 sm:p-3 rounded-xl w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-500">
        {service.icon}
      </div>
    </div>

    {/* Content */}
    <div className="relative z-10">
      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-3 group-hover:text-blue-400 transition-colors duration-300">
        {service.title}
      </h3>
      <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6 leading-relaxed">
        {service.description}
      </p>

      {/* Interactive CTA */}
      <Link href="/ourservices">
        <div className="flex items-center gap-2 text-blue-400 group-hover:text-blue-300 transition-colors duration-300 cursor-pointer">
          <span className="text-xs sm:text-sm font-medium">Explore service</span>
          <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </Link>
    </div>

    {/* Hover Border Animation */}
    <div className="absolute inset-0 -z-10 rounded-2xl p-px bg-gradient-to-br from-blue-500/0 via-blue-500/40 to-purple-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      <div className="absolute inset-0 rounded-2xl bg-gray-800/80 backdrop-blur-lg" />
    </div>
  </motion.div>
));

export default function OurServices() {
  return (
    <section className="relative w-full py-16 sm:py-24 md:py-32 overflow-hidden isolate">
      {/* Dynamic Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 to-gray-950" />
      </div>

      {/* Floating Particles - Reduced for mobile */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-blue-400/10 animate-float"
            style={{
              width: `${Math.random() * 6 + 3}px`,
              height: `${Math.random() * 6 + 3}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 15 + 8}s`
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Animated Header - Adjusted for mobile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: true, margin: "0px 0px -50px 0px" }}
          className="text-center mb-10 sm:mb-16"
        >
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-blue-400 bg-blue-900/30 rounded-full mb-4 sm:mb-6 uppercase">
            What We Offer
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-primary-foreground">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500">
              Transformative
            </span>{' '}
            Media Services
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed px-2 sm:px-0">
            We blend <span className="font-medium text-blue-300">cutting-edge technology</span> with{' '}
            <span className="font-medium text-purple-300">compelling storytelling</span> to create{' '}
            <span className="underline decoration-blue-400/50 underline-offset-4">impactful digital experiences</span>.
          </p>
        </motion.div>

        {/* Interactive Service Cards - Improved mobile layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 px-2 sm:px-0">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} />
          ))}
        </div>

        {/* Enhanced Reserve Button - Better mobile spacing */}
        <div className="mt-12 sm:mt-16 md:mt-20 text-center px-4 sm:px-0">
          <ReserveButton />
        </div>
      </div>
    </section>
  );
}