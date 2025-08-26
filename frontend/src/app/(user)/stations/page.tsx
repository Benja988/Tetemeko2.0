'use client';

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
// import StationsFooter from "@/components/stations/StationsFooter";
import StationsSection1 from "@/components/stations/StationsSection1";
import StationsSection2 from "@/components/stations/StationsSection2";
import StationsSection3 from "@/components/stations/StationsSection3";
import StationsSection4 from "@/components/stations/StationsSection4";
import StationsSection5 from "@/components/stations/StationsSection5";
// import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function StationsPage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative bg-primary text-white min-h-screen overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0">
        {/* <div className="absolute inset-0 bg-gradient-to-b from-primary to-black/80 z-10" /> */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover opacity-70"
        >
          {/* <source src="/videos/netvid.mp4" type="video/mp4" /> */}
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Page Content */}
      <div className="relative z-20">
        <Navbar isScrolled={isScrolled} />

        {/* Animated Sections */}
        <div className="">
          <StationsSection1 />
          <StationsSection2 />
          <StationsSection3 />
          <StationsSection4 />
          <StationsSection5 />
        </div>

        <Footer />
      </div>
    </div>
  );
}