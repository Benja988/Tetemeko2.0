'use client';

import { FC } from 'react';

// Core layout
import Navbar from '@/components/Navbar';
import StickyShareButtons from '@/components/news/StickyShareButtons';
import FirstSection from '@/components/news/FirstSection';
import SecondSection from '@/components/news/SecondSection';
import ThirdSection from '@/components/news/ThirdSection';
import FourthSection from '@/components/news/FourthSection';
import FifthSection from '@/components/news/FifthSection';
import Breadcrumbs from '@/components/news/Breadcrumbs';
import NewsFooter from '@/components/news/NewsFooter';
import Footer from '@/components/Footer';


const NewsAndBlogsPage: FC = () => {
  

  return (
    <>
      <Navbar />
      <main className="relative py-16 sm:px-8 lg:px-16 bg-primary text-primaryText">
        <Breadcrumbs />
        <StickyShareButtons />
        <FirstSection />
        <SecondSection />
        <ThirdSection />
        <FourthSection />
        <FifthSection />
        {/* <NewsFooter /> */}
        <Footer />
        
        
      </main>
    </>
  );
};

export default NewsAndBlogsPage;

