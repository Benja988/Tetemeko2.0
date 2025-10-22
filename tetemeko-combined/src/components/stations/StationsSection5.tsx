'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { FaPlay, FaChartLine, FaUsers, FaGlobeAfrica, FaMicrophone, FaTimes } from "react-icons/fa";

const stats = [
  { value: "5M+", label: "Monthly Listeners", icon: <FaUsers className="text-3xl" /> },
  { value: "24/7", label: "Broadcast Coverage", icon: <FaGlobeAfrica className="text-3xl" /> },
  { value: "50+", label: "Original Shows", icon: <FaMicrophone className="text-3xl" /> },
  { value: "200%", label: "Growth Last Year", icon: <FaChartLine className="text-3xl" /> }
];

const testimonials = [
  {
    quote: "Tetemeko Media has given our community a voice we never had before. The local news coverage is invaluable.",
    author: "Nia Johnson",
    role: "Community Leader, Nairobi"
  },
  {
    quote: "As a musician, being featured on Tetemeko Radio changed my career. Their support for local talent is unmatched.",
    author: "Kwame Osei",
    role: "Musician, Accra"
  },
  {
    quote: "The educational programs have helped my students tremendously. We use Tetemeko content in our curriculum now.",
    author: "Dr. Amina Diallo",
    role: "University Professor, Dakar"
  }
];

export default function StationsSection5() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  return (
    <section className="py-20 px-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-center bg-no-repeat opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-primary/90" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center lg:text-left"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-secondary">
                More Than Media
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent">
                A Movement
              </span>
            </h2>
            
            <p className="text-lg text-gray-300 mb-8">
              Tetemeko Media is committed to empowering African voices, preserving our cultures, and driving positive change through innovative broadcasting.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/10"
                >
                  <div className="text-secondary mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-gray-300">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            <button
              onClick={() => setShowVideo(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary rounded-full font-semibold hover:bg-gray-100 transition"
            >
              <FaPlay /> Watch Our Story
            </button>
          </motion.div>

          {/* Right Content - Testimonials */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative h-96 bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 shadow-lg"
          >
            <Image
              src="/team.jpg"
              alt="Tetemeko Community"
              fill
              className="object-cover opacity-40"
            />
            <div className="absolute inset-0 p-6 flex flex-col justify-center">
              <div className="relative h-full">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTestimonial}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 flex flex-col justify-center"
                  >
                    <blockquote className="text-white text-lg italic mb-4">
                      "{testimonials[activeTestimonial].quote}"
                    </blockquote>
                    <div className="text-secondary font-medium">
                      {testimonials[activeTestimonial].author}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {testimonials[activeTestimonial].role}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
              
              <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition ${
                      index === activeTestimonial ? 'bg-secondary' : 'bg-white/30'
                    }`}
                    aria-label={`View testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Initiatives Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-20 grid md:grid-cols-3 gap-6"
        >
          <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-secondary/50 transition">
            <div className="text-secondary text-2xl mb-3">🎤</div>
            <h3 className="text-xl font-bold mb-2">Youth Talent Initiative</h3>
            <p className="text-gray-300">
              Providing platforms for young African creatives to showcase their talents through our weekly talent spotlight shows.
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-secondary/50 transition">
            <div className="text-secondary text-2xl mb-3">📚</div>
            <h3 className="text-xl font-bold mb-2">Education First</h3>
            <p className="text-gray-300">
              Daily educational programming in partnership with schools and universities across the continent.
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-secondary/50 transition">
            <div className="text-secondary text-2xl mb-3">🌍</div>
            <h3 className="text-xl font-bold mb-2">Cultural Preservation</h3>
            <p className="text-gray-300">
              Documenting and celebrating Africa's diverse cultures through our award-winning documentary series.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {showVideo && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowVideo(false)}
          >
            <motion.div
              className="relative w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}