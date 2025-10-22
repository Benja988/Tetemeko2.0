'use client'

import Link from 'next/link'
import { FC, useState, useEffect } from 'react'
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaYoutube,
} from 'react-icons/fa'
import { IoMdMail } from 'react-icons/io'
import { FaXTwitter } from 'react-icons/fa6'

const TopNav: FC = () => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`hidden sm:block w-full bg-gray-950 text-gray-200 text-sm top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'py-1 shadow-lg' : 'py-2'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
          {/* Contact Info */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5 text-center sm:text-left">
            <a
              href="mailto:info@tetemekomediagroup.org"
              className="flex items-center gap-2 group transition-all hover:text-blue-400"
            >
              <div className="p-1.5 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-all">
                <IoMdMail className="text-blue-400" size={14} />
              </div>
              <span className="text-xs sm:text-sm">
                info@tetemekomediagroup.org
              </span>
            </a>

            <div className="hidden sm:flex text-gray-500">|</div>

            <a
              href="https://wa.me/254719161925"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 group transition-all hover:text-green-400"
            >
              <div className="p-1.5 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-all">
                <FaWhatsapp className="text-green-400" size={14} />
              </div>
              <span className="text-xs sm:text-sm">+254 719 161 925</span>
            </a>
          </div>

          {/* Social Links & Navigation */}
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="flex items-center gap-3 sm:gap-4">
              <a
                href="https://facebook.com/tetemekomedia"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="p-2 bg-gray-800 rounded-lg hover:bg-blue-600 transition-all duration-300 group"
              >
                <FaFacebookF
                  size={14}
                  className="text-blue-400 group-hover:text-white"
                />
              </a>

              <a
                href="https://twitter.com/tetemekomedia"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="p-2 bg-gray-800 rounded-lg hover:bg-black transition-all duration-300 group"
              >
                <FaXTwitter
                  size={14}
                  className="text-gray-300 group-hover:text-white"
                />
              </a>

              <a
                href="https://instagram.com/tetemekomedia"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-2 bg-gray-800 rounded-lg hover:bg-pink-600 transition-all duration-300 group"
              >
                <FaInstagram
                  size={14}
                  className="text-pink-400 group-hover:text-white"
                />
              </a>

              <a
                href="https://www.youtube.com/channel/UCNwWgwfletrfQbUHzlbq4nA"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="p-2 bg-gray-800 rounded-lg hover:bg-red-600 transition-all duration-300 group"
              >
                <FaYoutube
                  size={14}
                  className="text-red-400 group-hover:text-white"
                />
              </a>
            </div>

            <div className="hidden sm:block h-5 w-px bg-gray-700"></div>

            <Link
              href="/contact"
              className="text-xs sm:text-sm font-medium px-3 py-1.5 bg-primary/20 rounded-lg hover:bg-primary/30 hover:text-white transition-all duration-300"
            >
              Support
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export default TopNav
