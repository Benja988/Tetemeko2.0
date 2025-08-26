'use client';

import { QuickLinks } from '../QuickLinks';
import { SocialLinks } from '../SocialLinks';



export default function MarketPlaceFooter() {
  return (
    <footer className="bg-primary text-white py-12 px-6 md:px-10 font-poppins">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          {/* Shortcut Links */}
          <QuickLinks />

          {/* About / Description */}
          <div>
            <h3 className="font-semibold text-lg mb-3">About Tetemeko</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Tetemeko Media Group is your go-to platform for quality products and services. We bring
              you the best brands and an amazing shopping experience.
            </p>
          </div>

          {/* Social Media */}
          <SocialLinks />
        </div>

        {/* Copyright */}
        <div className="border-t border-indigo-600 pt-6 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Tetemeko Media Group. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
