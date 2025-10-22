// TrendingPodcasts Component
"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { FiClock, FiArrowRight } from "react-icons/fi";
import { FaPlay, FaHeadphones } from "react-icons/fa";
import { Podcast } from "@/interfaces/podcasts";
import { podcastService } from "@/services/podcasts/podcastsService";

type PodcastCardProps = {
  podcast: Podcast;
  index: number;
  isActive: boolean;
};

const PodcastCard: React.FC<PodcastCardProps> = React.memo(
  ({ podcast, index, isActive }) => (
    <motion.div
      className="flex-shrink-0 w-[180px] h-[260px] md:w-[200px] md:h-[280px]" // Reduced size for better fit
      style={{
        scale: isActive ? 1 : 0.9,
        opacity: isActive ? 1 : 0.7,
        zIndex: isActive ? 10 : 1,
      }}
      whileHover={{ scale: 1.05 }}
    >
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500/30 transition-all duration-300 h-full flex flex-col">
        <div className="relative aspect-square">
          {podcast.coverImage && (
            <Image
              src={podcast.coverImage}
              alt={podcast.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 180px, 200px"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent" />
          {podcast.category && (
            <div className="absolute top-2 right-2 bg-gray-900/80 text-[10px] font-medium px-1.5 py-0.5 rounded-full">
              {podcast.category.name}
            </div>
          )}
        </div>

        <div className="p-3 flex-1 flex flex-col">
          <h3 className="text-sm font-bold text-white line-clamp-2 mb-1 leading-tight">
            {podcast.title}
          </h3>
          <p className="text-blue-400 text-xs mb-2 line-clamp-1">
            Hosted by {podcast.createdBy?.name || "Unknown"}
          </p>

          <div className="flex items-center gap-3 text-gray-400 text-[10px] mb-3 mt-auto">
            <div className="flex items-center gap-1">
              <FiClock size={10} />
              <span>45m</span>
            </div>
            {/* Uncomment if you have listener data
            <div className="flex items-center gap-1">
              <FaHeadphones size={10} />
              <span>{podcast.listeners || "0"}</span>
            </div> */}
          </div>

          <Link href={`/podcasts/${podcast._id}`}>
            <button className="w-full flex items-center justify-center gap-1 px-2 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-xs font-medium rounded-md text-white transition-all">
              <FaPlay size={10} /> Listen
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
);

export default function TrendingPodcasts() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [width, setWidth] = useState(0);
  const carousel = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const x = useMotionValue(0);
  const scale = useTransform(x, [-200, 0, 200], [0.8, 1, 0.8]);
  const opacity = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5]);

  // Fetch podcasts & pick random 6
  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const res = await podcastService.getAll({ page: 1, limit: 50 });
        if (res.podcasts) {
          const shuffled = [...res.podcasts].sort(() => Math.random() - 0.5);
          setPodcasts(shuffled.slice(0, 6));
        }
      } catch (err) {
        console.error("Failed to fetch podcasts", err);
      }
    };
    fetchPodcasts();
  }, []);

  useEffect(() => {
    if (carousel.current) {
      setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth);
    }
  }, [podcasts]);

  useEffect(() => {
    const controls = animate(x, -activeIndex * 220, { // Reduced spacing for smaller cards
      type: "spring",
      stiffness: 50,
      damping: 15,
    });
    return controls.stop;
  }, [activeIndex, x]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? podcasts.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === podcasts.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-16 bg-gradient-to-b from-gray-950 to-gray-900 text-white relative overflow-hidden">
      {/* Floating sound waves */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute top-0 h-full w-1 bg-blue-500"
            style={{
              left: `${(i + 1) * 8}%`,
              height: `${20 + Math.random() * 80}%`,
              transform: "translateY(-50%)",
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 text-xs font-semibold bg-blue-900/30 text-blue-400 rounded-full mb-4">
            TRENDING NOW
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
            Popular Podcasts
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm">
            Discover what's buzzing in our audio library. Fresh voices. Real
            conversations.
          </p>
        </div>

        {/* 3D Carousel */}
        <div className="relative">
          <motion.div
            ref={carousel}
            className="cursor-grab overflow-hidden"
            whileTap={{ cursor: "grabbing" }}
          >
            <motion.div
              drag="x"
              dragConstraints={{ right: 0, left: -width }}
              className="flex gap-5" // Reduced gap between cards
              style={{ x }}
            >
              {podcasts.map((podcast, index) => (
                <PodcastCard
                  key={podcast._id}
                  podcast={podcast}
                  index={index}
                  isActive={index === activeIndex}
                />
              ))}
            </motion.div>
          </motion.div>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-10 bg-gray-800/80 hover:bg-gray-700/80 p-2 rounded-full shadow-lg z-20"
          >
            <FiArrowRight className="rotate-180 text-sm" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-10 bg-gray-800/80 hover:bg-gray-700/80 p-2 rounded-full shadow-lg z-20"
          >
            <FiArrowRight className="text-sm" />
          </button>
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link href="/podcasts">
            <button className="inline-flex items-center px-5 py-2.5 border border-gray-700 hover:border-blue-500 text-xs font-medium rounded-full text-white bg-gray-800/50 hover:bg-gray-700/50 transition-all group">
              View All Podcasts
              <FiArrowRight className="ml-1.5 text-xs group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}