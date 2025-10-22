"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import { categoriesRow1, categoriesRow2 } from "@/data/categories"; // Make sure the path is correct
import { SocialLinks } from "../SocialLinks";
import { QuickLinks } from "../QuickLinks";

const NewsFooter: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Thank you for subscribing to our newsletter!");
    setEmail("");
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-primary p-8 text-white">
      {/* Newsletter Subscription */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Stay Updated with the Latest News</h2>
        <p className="mb-4">
          Subscribe to our newsletter and never miss an update. Get the best of global news, technology, lifestyle, and more delivered straight to your inbox.
        </p>
        <form onSubmit={handleSubmit} className="flex justify-center items-center gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="px-6 py-3 text-black rounded-md focus:outline-none w-full sm:w-2/3 md:w-1/2 lg:w-1/3"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all"
          >
            Subscribe
          </button>
        </form>
        {message && <p className="mt-4 text-xl font-semibold text-secondary">{message}</p>}
      </div>

      {/* Categories Grid Row 1 */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8 pb-6 border-b border-gray-700">
        {categoriesRow1.map((category, index) => (
          <div key={index}>
            <h3 className="font-bold text-lg mb-2">{category.title}</h3>
            <ul className="space-y-1">
              {category.items.map((item, i) => (
                <li key={i}>
                  <Link
                    href={`/${category.title.toLowerCase().replace(/ /g, "-")}/${item.toLowerCase().replace(/ /g, "-")}`}
                    className="text-sm leading-none hover:underline"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Categories Grid Row 2 */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8 pt-6 pb-6 border-b border-gray-700">
        {categoriesRow2.map((category, index) => (
          <div key={index}>
            <h3 className="font-bold text-lg mb-2">{category.title}</h3>
            <ul className="space-y-1">
              {category.items.map((item, i) => (
                <li key={i}>
                  <Link
                    href={`/${category.title.toLowerCase().replace(/ /g, "-")}/${item.toLowerCase().replace(/ /g, "-")}`}
                    className="text-sm leading-none hover:underline"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <QuickLinks />

      {/* Footer Branding and Social Media Icons */}
      <div className="mt-8 flex flex-wrap justify-between items-center gap-4">
        <div className="text-sm">
          <p>© {new Date().getFullYear()} Tetemeko Media Group. All Rights Reserved.</p>
          <p className="mt-1">Tetemeko Media Group ™ &copy; {new Date().getFullYear()}</p>
        </div>

        <SocialLinks />
      </div>

      {/* Back to Top Button */}
      <button
        onClick={handleBackToTop}
        className="mt-6 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded transition flex items-center gap-2"
      >
        ⬆ Back to Top
      </button>
    </footer>
  );
};

export default NewsFooter;
