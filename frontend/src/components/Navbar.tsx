'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { FaBars, FaTimes } from 'react-icons/fa'
import { navLinks } from '@/constants/navLinks'

interface NavbarProps {
  isScrolled?: boolean
}

const Navbar = ({ isScrolled = false }: NavbarProps) => {
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleMenu = () => setMenuOpen((prev) => !prev)

  return (
    <>
      {/* Main Navbar */}
      <header
        className={`fixed w-full transition-all duration-500 z-50 ${
          isScrolled
            ? 'bg-primary/90 backdrop-blur-md py-2 shadow-lg'
            : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" prefetch className="flex items-center gap-2 z-50">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative w-10 h-10"
            >
              <Image
                src="/logo.jpg"
                alt="Tetemeko Media Group"
                width={40}
                height={40}
                priority
                className="object-contain"
              />
            </motion.div>
            <span className="text-white text-xl font-bold tracking-wide hidden sm:block">
              Tetemeko Media Group LTD.
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                prefetch
                className="relative group font-medium text-white/90 hover:text-white transition"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleMenu}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              className="md:hidden bg-white/20 p-2 rounded-lg z-50"
            >
              {menuOpen ? (
                <FaTimes className="text-xl text-white" aria-hidden="true" />
              ) : (
                <FaBars className="text-xl text-white" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 bg-primary/95 backdrop-blur-lg z-40 flex flex-col items-center justify-center space-y-8 pt-24"
          >
            {navLinks.map((link, index) => (
              <motion.div
                key={link.name}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.08 }}
              >
                <Link
                  href={link.path}
                  prefetch
                  onClick={() => setMenuOpen(false)} // ✅ closes immediately
                  className="text-2xl font-medium text-white hover:text-secondary transition"
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
