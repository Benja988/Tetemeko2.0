'use client';
import { HERO_MEDIA } from '@/constants/heroMedia';
import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HeroNavbar from './Hero/HeroNavbar';
import HeroContent from './Hero/HeroContent';
import HeroControls from './Hero/HeroControls';
import Image from 'next/image';
import { throttle } from 'lodash';

const transition = { duration: 1.2, ease: [0.76, 0, 0.24, 1] };

type HeroMediaType =
  | { type: 'image'; src: string; alt?: string }
  | { type: 'video'; src: string; alt?: string };

const HeroMedia = ({ media, index }: { media: HeroMediaType; index: number }) => {
  if (media.type === 'image') {
    return (
      <Image
        src={media.src}
        alt={media.alt || 'Hero image'}
        fill
        className="object-cover"
        priority={index === 0}
        loading={index !== 0 ? 'lazy' : undefined}
      />
    );
  }
  return (
    <video
      src={media.src}
      className="object-cover w-full h-full"
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      aria-label={media.alt || 'Hero video'}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
    />
  );
};

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [direction, setDirection] = useState(0);
  const total = HERO_MEDIA.length;

  const sectionRef = useRef<HTMLElement | null>(null);

  const nextSlide = useCallback(() => {
    setDirection(0);
    setCurrent(c => (c + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setDirection(1);
    setCurrent(c => (c - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    const id = setInterval(() => {
      if (!paused) nextSlide();
    }, 12000);
    return () => clearInterval(id);
  }, [paused, nextSlide]);

  // Optimized tilt
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const handleMouseMove = throttle((e: React.MouseEvent) => {
    if (!sectionRef.current) return;

    const rect = sectionRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const newX = (x - centerX) / 20;
    const newY = (y - centerY) / 20;

    if (Math.abs(newX - tilt.x) > 0.2 || Math.abs(newY - tilt.y) > 0.2) {
      setTilt({ x: newX, y: newY });
    }
  }, 32);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full bg-primary text-white overflow-hidden flex flex-col"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        setPaused(false);
        setTilt({ x: 0, y: 0 });
      }}
      onMouseMove={handleMouseMove}
    >
      {/* Enhanced background effects */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-900/20 rounded-full filter blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-900/20 rounded-full filter blur-[100px] animate-pulse-medium delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-900/15 rounded-full filter blur-[120px] animate-pulse-fast delay-500"></div>
      </div>

      <AnimatePresence custom={direction} mode="wait">
        <motion.div
          key={current}
          custom={direction}
          initial={{ opacity: 0, x: direction === 0 ? 100 : -100, scale: 1.05 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: direction === 0 ? -100 : 100, scale: 1.05 }}
          transition={transition}
          style={{
            transform: `perspective(1000px) rotateX(${-tilt.y}deg) rotateY(${tilt.x}deg)`,
            transition: 'transform 0.5s cubic-bezier(0.17, 0.67, 0.83, 0.67)'
          }}
          className="absolute inset-0 z-10"
        >
          <HeroMedia media={HERO_MEDIA[current]} index={current} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          {/* Subtle overlay pattern */}
          <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48Y2lyY2xlIGZpbGw9IiNmZmYiIGN4PSIzMCIgY3k9IjMwIiByPSIxLjUiLz48L2c+PC9zdmc+')]"></div>
        </motion.div>
      </AnimatePresence>

      <HeroNavbar />
      <HeroContent />
      <HeroControls onPrev={prevSlide} onNext={nextSlide} />

      {/* Enhanced progress indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {HERO_MEDIA.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > current ? 0 : 1);
              setCurrent(i);
            }}
            className="h-1.5 rounded-full transition-all duration-500 group"
            style={{
              width: i === current ? '24px' : '8px',
              backgroundColor: i === current ? 'white' : 'rgba(255,255,255,0.3)'
            }}
          >
            <div className="w-full h-full rounded-full overflow-hidden">
              {i === current && (
                <motion.div 
                  className="h-full bg-gradient-to-r from-blue-400 to-purple-400"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 12, ease: "linear" }}
                />
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Enhanced scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center group"
      >
        <span className="text-xs mb-1 text-white/80 group-hover:text-white transition-colors">Scroll Down</span>
        <div className="relative w-8 h-12 flex justify-center">
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center">
            <motion.div 
              className="w-1 h-2 bg-white/70 rounded-full mt-2"
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <div className="absolute top-8 w-1 h-1 bg-white/60 rounded-full transform rotate-45"></div>
          <div className="absolute top-8 right-7 w-1 h-1 bg-white/60 rounded-full transform -rotate-45"></div>
        </div>
      </motion.div>
    </section>
  );
}