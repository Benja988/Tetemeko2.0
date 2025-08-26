'use client';

import HeroMarketplaceSection from '@/components/marketplace/HeroMarketplaceSection';
import MarketPlaceSection1 from '@/components/marketplace/MarketPlaceSection1';
import MarketPlaceSection2 from '@/components/marketplace/MarketPlaceSection2';
import MarketPlaceSection3 from '@/components/marketplace/MarketPlaceSection3';
import MarketPlaceSection4 from '@/components/marketplace/MarketPlaceSection4';
import MarketPlaceSection5 from '@/components/marketplace/MarketPlaceSection5';
import Navbar from '@/components/Navbar';
import MarketPlaceFooter from '@/components/marketplace/MarketPlaceFooter';

export default function MarketplacePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      {/* Hero Section */}
      <HeroMarketplaceSection />

      <MarketPlaceSection1 />
      <MarketPlaceSection2 />
      <MarketPlaceSection3 />
      <MarketPlaceSection4 />
      <MarketPlaceSection5 />
      <MarketPlaceFooter />
      {/* <MarketPlaceSection7 /> */}
      {/* <MarketPlaceFooter />  */}
    </div>
  );
}