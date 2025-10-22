'use client';

import Image from "next/image";
import { useEffect, useState } from "react";
import { featuredProjects } from "@/constants/featuredProjects";

export default function FeaturedWork() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === featuredProjects.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const project = featuredProjects[currentIndex];

  return (
    <section
      className="relative py-20 px-4 sm:px-8 lg:px-16 text-white overflow-hidden"
      id="featured-work"
    >
      {/* Fullscreen Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/bg/bg2.jpg"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* Section Title */}
      <div className="relative z-10 text-center mb-16">
        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight font-sans">
          Featured Work
        </h2>
        <p className="text-gray-300 mt-4 text-lg font-light max-w-xl mx-auto font-serif italic">
          Some of our best and most recent projects.
        </p>
      </div>

      {/* Project Card */}
      <div
        key={project.id}
        className="relative z-10 flex flex-col lg:flex-row gap-10 bg-white/10 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl transition-all duration-700 p-6 sm:p-10"
      >
        {/* Image Section */}
        <div className="relative w-full lg:w-1/2 h-64 lg:h-[400px] rounded-2xl overflow-hidden shadow-lg">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
          />
          <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse" />
        </div>

        {/* Text Content */}
        <div className="flex flex-col justify-between w-full lg:w-1/2">
          <div>
            <h3 className="text-3xl font-bold mb-4 tracking-wide font-sans">
              {project.title}
            </h3>
            <p className="text-gray-200 text-lg leading-relaxed tracking-wide font-light font-serif">
              {project.description}.
            </p>
          </div>

          <div className="flex items-center justify-between mt-auto pt-6">
            {/* <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-2 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-full transition-all"
            >
              Watch Now
            </a> */}
            {/* <span className="text-yellow-400 text-sm font-medium underline hover:text-yellow-300 cursor-pointer transition-colors">
              Read more...
            </span> */}
          </div>
        </div>
      </div>
    </section>
  );
}
