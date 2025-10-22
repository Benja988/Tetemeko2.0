"use client";

import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import Link from "next/link";
import { SocialLinks } from "../SocialLinks";
import { QuickLinks } from "../QuickLinks";
import { ContactInfo } from "../ContactInfo";

export default function PodCastFooter() {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8 px-6 md:px-16">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10 text-sm">
        {/* Logo & Description */}
        <div className="md:col-span-2">
          <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Tetemeko Podcasts
          </h3>
          <p className="text-gray-400 mb-6 leading-relaxed">
            Your daily source of inspiration, information, and impactful stories. 
            Stream, share, and stay connected with Africa's leading voices.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-purple-600 transition-colors">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-blue-400 transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-pink-600 transition-colors">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-red-600 transition-colors">
              <Youtube className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="text-lg font-semibold mb-5 text-gray-200">Quick Links</h4>
          <ul className="space-y-3">
            <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Home</a></li>
            <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">All Podcasts</a></li>
            <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Categories</a></li>
            <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">About Us</a></li>
            <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Contact</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-lg font-semibold mb-5 text-gray-200">Contact Info</h4>
          <address className="text-gray-400 not-italic space-y-3">
            <p>123 Podcast Avenue</p>
            <p>Nairobi, Kenya</p>
            <p>info@tetemeko.com</p>
            <p>+254 700 123 456</p>
          </address>
        </div>
      </div>

      {/* Bottom */}
      <div className="text-center mt-12 border-t border-slate-700 pt-6 text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Tetemeko Media Group. All rights reserved.</p>
        <div className="mt-2 space-x-4">
          <a href="#" className="hover:text-purple-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-purple-400 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-purple-400 transition-colors">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
}