'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { navLinks } from '@/constants/navLinks'

export default function HeroNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Logo - fixed top-left */}
      <div className="fixed top-4 left-4 z-50 flex items-center gap-2">
        <Image
          src="/logo.jpg"
          alt="Tetemeko Logo"
          width={36}
          height={36}
          priority
          className=""
        />
        <span className="hidden sm:inline text-lg sm:text-xl md:text-2xl font-bold text-white drop-shadow-lg">
          Tetemeko Media Group LTD
        </span>
      </div>

      {/* Mobile Menu Button - fixed top-right */}
      <div className="fixed top-4 right-4 z-50 md:hidden">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          className="text-white"
        >
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Desktop Navigation (centered at top, not sticky on mobile) */}
      <nav className="hidden md:flex fixed top-6 left-1/2 -translate-x-1/2 z-40 gap-6 bg-black/30 backdrop-blur-md px-6 py-2 rounded-full shadow-lg">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.path}
            className="text-gray-200 hover:text-white transition"
          >
            {link.name}
          </Link>
        ))}
      </nav>

      {/* Mobile Fullscreen Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-blue-950 bg-opacity-95 z-40 flex flex-col items-center justify-center p-6">
          {navLinks.map((link) => (
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
    </>
  )
}
