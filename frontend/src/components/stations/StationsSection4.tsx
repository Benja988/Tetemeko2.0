'use client';

import { motion } from "framer-motion";
import ReserveButton from "../ReserveButton";
import SectionHeader from "./SectionHeader";

const features = [
  {
    title: "Crystal Clear Streaming",
    description: "Experience uninterrupted HD quality streaming across all your devices, anywhere in Africa.",
    icon: (
      <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    ),
    color: "text-blue-400"
  },
  {
    title: "Diverse Content Library",
    description: "From local news to international shows, music to documentaries - we've got content for every taste.",
    icon: (
      <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
      </svg>
    ),
    color: "text-purple-400"
  },
  {
    title: "24/7 Live Support",
    description: "Our dedicated team is always available to assist with any technical issues or inquiries.",
    icon: (
      <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    color: "text-green-400"
  },
  {
    title: "Interactive Community",
    description: "Join live call-ins, social media discussions, and influence programming with your feedback.",
    icon: (
      <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
      </svg>
    ),
    color: "text-yellow-400"
  },
  {
    title: "Personalized Recommendations",
    description: "Our smart algorithms learn your preferences to suggest content you'll love.",
    icon: (
      <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    color: "text-red-400"
  },
  {
    title: "Offline Downloads",
    description: "Download your favorite shows and listen offline during your commute or travels.",
    icon: (
      <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    ),
    color: "text-pink-400"
  }
];

export default function StationsSection4() {
  return (
    <section className="py-12 md:py-20 px-4 sm:px-6 bg-gradient-to-b from-primary-dark to-black">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title="Why Choose Tetemeko Media?"
          subtitle="We're revolutionizing African media with cutting-edge technology and authentic storytelling"
          variant="dark"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-8 md:mt-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true, margin: "0px 0px -100px 0px" }}
              className="group bg-gradient-to-br from-white/5 to-white/[0.01] border border-white/10 rounded-xl p-4 md:p-6 hover:border-secondary/50 transition-all duration-300 hover:shadow-lg hover:shadow-secondary/10"
            >
              <div className={`${feature.color} mb-3 md:mb-4 group-hover:text-white transition`}>
                {feature.icon}
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2 group-hover:text-secondary transition">
                {feature.title}
              </h3>
              <p className="text-sm md:text-base text-gray-400 group-hover:text-gray-300 transition">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-12 md:mt-16 text-center px-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
        >
          <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Ready to Experience the Future of African Media?</h3>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <ReserveButton 
              variant="secondary"
            />
            <button className="w-full sm:w-auto px-6 py-3 border border-secondary text-secondary rounded-lg hover:bg-secondary/10 transition">
              Learn More
            </button>
          </div>
          <p className="mt-3 md:mt-4 text-gray-400 text-xs md:text-sm">
            Join over 5 million listeners across Africa
          </p>
        </motion.div>
      </div>
    </section>
  );
}