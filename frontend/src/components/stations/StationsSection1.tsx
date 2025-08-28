'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaPlay, FaArrowDown, FaTimes } from "react-icons/fa";
import Breadcrumbs from "../Breadcrumbs";

export default function StationsSection1() {
  const [showVideo, setShowVideo] = useState(false);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Stations", href: "/stations" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-6 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/30 to-primary/90" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <Breadcrumbs items={breadcrumbItems} className="justify-center lg:justify-start" />
            
            <motion.span
              className="inline-block text-secondary font-semibold tracking-wider mb-4 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              AFRICA'S PREMIER MEDIA NETWORK
            </motion.span>
            
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-secondary-light">
                Discover Our
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent">
                Vibrant Stations
              </span>
            </motion.h1>
            
            <motion.p
              className="text-lg text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Experience the pulse of African media through our diverse network of radio and TV stations. From breaking news to cultural programming, we bring Africa to the world.
            </motion.p>
            
            <motion.div
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <button
                onClick={() => document.getElementById("stations-grid")?.scrollIntoView({ behavior: "smooth" })}
                className="px-8 py-3 text-primary hover:text-primary bg-gradient-to-r from-secondary to-accent rounded-full font-semibold hover:shadow-lg hover:shadow-secondary/30 transition-all"
              >
                Browse Stations
              </button>
              <button
                onClick={() => setShowVideo(true)}
                className="px-8 py-3 flex items-center gap-2 border border-white rounded-full hover:bg-white hover:text-primary transition"
              >
                <FaPlay className="text-sm" />
                Watch Promo
              </button>
            </motion.div>
          </motion.div>

          {/* Image/Visual Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative h-80 md:h-[500px] rounded-2xl overflow-hidden shadow-2xl"
          >
            <Image
              src="/studio-equipment.jpg"
              alt="Tetemeko Broadcasting Studio"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-white text-sm bg-black/40 backdrop-blur-sm p-4 rounded-lg">
                "Our state-of-the-art studios deliver crystal clear broadcasts to millions across the continent daily."
              </p>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <button
            onClick={() => document.getElementById("stations-grid")?.scrollIntoView({ behavior: "smooth" })}
            className="flex flex-col items-center text-gray-300 hover:text-white transition"
            aria-label="Scroll down"
          >
            <span className="text-sm mb-2">Explore Stations</span>
            <FaArrowDown className="text-xl" />
          </button>
        </motion.div>
      </div>

      {/* Video Modal */}
      {showVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden">
            <iframe
              src="https://www.youtube.com/embed/YOUR_VIDEO_ID?autoplay=1"
              className="w-full h-full"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
            <button
              onClick={() => setShowVideo(false)}
              className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black transition"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}