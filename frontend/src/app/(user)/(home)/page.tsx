'use client';
import { ReactNode, memo, useState, useEffect } from 'react';
import Hero from "@/components/Hero";
import AboutUs from "@/components/AboutUs";
import OurServices from "@/components/OurServices";
import TrendingPodcasts from "@/components/TrendingPodcasts";
import TrendingNews from "@/components/TrendingNews";
import Events from "@/components/Events";
import FAQs from "@/components/FAQs";
import Feedback from "@/components/Feedback";
import CustomerCareChat from "@/components/CustomerCareChat";
import Footer from "@/components/Footer";

// Simple section wrapper with fade-in animation
const Section = memo(({ children, className = '' }: { children: ReactNode, className?: string }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      setHasBeenVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className={`transition-all duration-700 ease-out ${className} ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      }`}
    >
      {hasBeenVisible ? children : (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
});
Section.displayName = "Section";

// Global loading component
const GlobalLoader = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate initial page load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!isLoading) return null;
  
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary to-secondary z-50 flex flex-col items-center justify-center">
      {/* Spinner */}
      <div className="relative w-24 h-24">
        {/* Outer ring */}
        <div className="absolute inset-0 border-4 border-blue/30 rounded-full"></div>
        {/* Spinning ring */}
        <div className="absolute inset-0 border-4 border-t-white border-r-white border-transparent rounded-full animate-spin"></div>
      </div>

      {/* Text */}
      <p className="mt-8 text-white text-xl font-light animate-pulse">
        Tetemeko Media...
      </p>
    </div>
  );
};

export default function Home() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return <GlobalLoader />;

  return (
    <main className="">
      <GlobalLoader />
      
      <Hero />
      
      <div className="">
          <AboutUs />
          <OurServices />
          <TrendingPodcasts />
          <TrendingNews />
          {/* <Events /> */}
          <FAQs />
          <Feedback />
      </div>
      
      <Footer />
      <CustomerCareChat />
    </main>
  );
}