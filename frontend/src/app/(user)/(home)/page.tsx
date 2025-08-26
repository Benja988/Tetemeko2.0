'use client';
import dynamic from 'next/dynamic';
import { useInView } from 'react-intersection-observer';
import { ReactNode, memo, useState, useEffect } from 'react';
import Hero from "@/components/Hero";
import CustomerCareChat from "@/components/CustomerCareChat";
import Footer from "@/components/Footer";

// Component loader with custom loading component
const withLoader = (componentImport: () => Promise<any>) =>
  dynamic(() => componentImport(), {
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center h-96 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full mb-4"></div>
          <div className="h-4 rounded w-32"></div>
        </div>
      </div>
    ),
  });


const AboutUs = withLoader(() => import('@/components/AboutUs'));
const OurServices = withLoader(() => import('@/components/OurServices'));
const LiveNow = withLoader(() => import('@/components/LiveNow'));
const TrendingPodcasts = withLoader(() => import('@/components/TrendingPodcasts'));
const TrendingNews = withLoader(() => import('@/components/TrendingNews'));
// const ShopFromUs = withLoader(() => import('@/components/ShopFromUs'));
const Events = withLoader(() => import('@/components/Events'));
const FAQs = withLoader(() => import('@/components/FAQs'));
const Feedback = withLoader(() => import('@/components/Feedback'));

// Improved LazySection with smooth entrance animation
const LazySection = memo(({ children, className = '' }: { children: ReactNode, className?: string }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });
  const [hasBeenInView, setHasBeenInView] = useState(false);
  
  useEffect(() => {
    if (inView && !hasBeenInView) {
      setHasBeenInView(true);
    }
  }, [inView, hasBeenInView]);

  return (
    <div 
      ref={ref} 
      className={`transition-all duration-700 ease-out ${className} ${
        hasBeenInView 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      }`}
    >
      {hasBeenInView ? children : (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
});
LazySection.displayName = "LazySection";

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
          <LazySection className="rounded-2xl">
            <AboutUs />
          </LazySection>
          
          <LazySection className="rounded-2xl">
            <OurServices />
          </LazySection>
          
          {/* <LazySection className="rounded-2xl">
            <LiveNow />
          </LazySection> */}
          
          <LazySection className="rounded-2xl bg-gradient-to-r from-primary/5 to-secondary/5 p-6">
            <TrendingPodcasts />
          </LazySection>
          
          <LazySection className="rounded-2xl bg-gradient-to-l from-primary/5 to-secondary/5 p-6">
            <TrendingNews />
          </LazySection>
          
          {/* <LazySection className="rounded-2xl">
            <ShopFromUs />
          </LazySection> */}
          
          <LazySection className="rounded-2xl bg-gradient-to-br from-primary/5 via-white/5 to-secondary/5 p-6">
            <Events />
          </LazySection>
          
          <LazySection className="rounded-2xl">
            <FAQs />
          </LazySection>
          
          <LazySection className="rounded-2xl bg-gradient-to-tr from-primary/5 to-secondary/5 p-6">
            <Feedback />
          </LazySection>
        </div>
        
        <Footer />
        <CustomerCareChat />
      
    </main>
  );
}