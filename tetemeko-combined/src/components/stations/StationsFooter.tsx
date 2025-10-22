'use client';

import { FaFacebookF, FaYoutube, FaInstagram, FaArrowRight } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { QuickLinks } from '../QuickLinks';
import { SocialLinks } from '../SocialLinks';

export default function StationsFooter() {
  return (
    <footer className="text-white py-16 border-t border-white/10 bg-primary">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Logo & Description */}
          <div>
            <h2 className="text-2xl font-bold mb-3 font-poppins">Tetemeko Media</h2>
            <p className="text-gray-400 text-sm leading-relaxed font-inter">
              Broadcasting the voice of the people through powerful radio and TV stations across Africa.
            </p>
          </div>

          {/* Quick Links */}
          <QuickLinks />

          {/* Social Media */}
          <SocialLinks />
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 border-t border-white/10 pt-6 text-sm text-gray-500 text-center">
          © {new Date().getFullYear()} Tetemeko Media Group. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
