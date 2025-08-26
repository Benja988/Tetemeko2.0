'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { navLinks } from '@/constants/navLinks'

export default function HeroNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="absolute top-0 left-0 z-50 w-full px-4 sm:px-6 lg:px-24 py-4 flex items-center justify-between text-white">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Image src="/logo.jpg" alt="Tetemeko Logo" width={36} height={36} priority />
        <span className="text-lg sm:text-xl md:text-2xl font-bold">Tetemeko Media Group LTD</span>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex gap-4 lg:gap-6">
        {navLinks.map(link => (
          <Link
            key={link.name}
            href={link.path}
            className="text-gray-200 hover:text-white transition"
          >
            {link.name}
          </Link>
        ))}
      </nav>

      {/* Mobile Menu Button */}
      <div className="md:hidden relative z-50">
        <button onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Fullscreen Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-40 flex flex-col items-center justify-center p-6">
          {/* Close Button in Top Right */}
          {/* <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition"
            aria-label="Close menu"
          >
            <X size={32} />
          </button> */}

          {/* Navigation Links */}
          {navLinks.map(link => (
            <Link
              key={link.name}
              href={link.path}
              onClick={() => setMobileOpen(false)}
              className="text-white text-xl py-3 px-4 rounded hover:bg-white hover:text-black transition w-full text-center"
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}