'use client'
import { motion } from 'framer-motion'
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md'
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaLinkedin } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <motion.div whileHover={{ x: 5 }} className="mb-4 last:mb-0">
    <Link
      href={href}
      className="text-gray-400 hover:text-blue-400 transition-colors flex items-start gap-2 group"
    >
      <span className="w-2 h-2 mt-2 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
      <span>{children}</span>
    </Link>
  </motion.div>
)

function FloatingCircles() {
  const [circles, setCircles] = useState<
    { width: number; height: number; left: number; top: number }[]
  >([])

  useEffect(() => {
    // Generate random circles only on client
    const arr = [...Array(8)].map(() => ({
      width: 80 + Math.random() * 120,
      height: 80 + Math.random() * 120,
      left: Math.random() * 100,
      top: Math.random() * 100,
    }))
    setCircles(arr)
  }, [])

  return (
    <>
      {circles.map((circle, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.05, scale: 1 }}
          transition={{ duration: 1, delay: i * 0.1 }}
          className="absolute border border-white/10 rounded-full"
          style={{
            width: `${circle.width}px`,
            height: `${circle.height}px`,
            left: `${circle.left}%`,
            top: `${circle.top}%`,
          }}
        />
      ))}
    </>
  )
}

export default function Footer() {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubscribed(true)
      setEmail('')
      setTimeout(() => setIsSubscribed(false), 3000)
    }
  }

  return (
    <footer className="relative bg-gradient-to-b from-[#07131F] to-[#020617] text-white pt-16 pb-8 overflow-hidden">
      {/* Floating media elements (client-only to avoid hydration mismatch) */}
      <div className="absolute inset-0 opacity-5 overflow-hidden pointer-events-none">
        <FloatingCircles />
      </div>

      {/* Grid background pattern */}
      <div className="absolute inset-0 opacity-5 bg-[url('/grid-pattern.svg')] bg-[size:40px_40px]" />

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* About Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="relative w-12 h-12">
                <Image
                  src="/logo.jpg"
                  alt="Tetemeko Media Group"
                  width={48}
                  height={48}
                  className="object-contain rounded-lg"
                />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Tetemeko Media
              </span>
            </Link>
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              Bridging communities through innovative media solutions across East Africa.
              Your trusted source for news, entertainment, and cultural programming.
            </p>
            <div className="flex gap-3">
              {[
                { icon: <FaFacebook size={16} />, color: 'hover:bg-blue-600' },
                { icon: <FaTwitter size={16} />, color: 'hover:bg-sky-500' },
                { icon: <FaInstagram size={16} />, color: 'hover:bg-gradient-to-tr from-purple-500 to-pink-500' },
                { icon: <FaYoutube size={16} />, color: 'hover:bg-red-600' },
                { icon: <FaLinkedin size={16} />, color: 'hover:bg-blue-700' }
              ].map((social, i) => (
                <motion.a
                  key={i}
                  whileHover={{ y: -3 }}
                  href="#"
                  className={`bg-gray-800 hover:bg-gray-700 ${social.color} p-2.5 rounded-full text-gray-300 hover:text-white transition-all duration-300`}
                  aria-label={`Follow us on ${social.icon.type.name.replace('Fa', '')}`}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold mb-6 text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Quick Links
            </h4>
            <div className="space-y-1">
              <FooterLink href="/about">About Us</FooterLink>
              <FooterLink href="/stations">Our Stations</FooterLink>
              <FooterLink href="/shows">TV Shows</FooterLink>
              <FooterLink href="/podcasts">Podcasts</FooterLink>
              <FooterLink href="/news">News</FooterLink>
              <FooterLink href="/careers">Careers</FooterLink>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold mb-6 text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Contact Us
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <MdLocationOn className="text-blue-400 flex-shrink-0 text-lg" />
                </div>
                <p className="text-gray-400 text-sm">
                  Tetemeko Plaza, 5th Floor<br />
                  Nairobi, Kenya
                </p>
              </div>
              <div className="flex items-center gap-3">
                <MdPhone className="text-blue-400 text-lg" />
                <p className="text-gray-400 text-sm">+254 700 000 000</p>
              </div>
              <div className="flex items-center gap-3">
                <MdEmail className="text-blue-400 text-lg" />
                <p className="text-gray-400 text-sm">info@tetemeko.com</p>
              </div>
            </div>

            <div className="mt-6 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-lg p-4 border border-blue-500/20">
              <h5 className="text-sm font-medium text-white mb-1 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                Emergency Broadcast
              </h5>
              <p className="text-xs text-blue-100">
                For urgent matters, call our 24/7 hotline:<br />
                <span className="font-medium">+254 711 000 000</span>
              </p>
            </div>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold mb-6 text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Newsletter
            </h4>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to receive the latest news, shows, and updates from Tetemeko Media.
            </p>

            {isSubscribed ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-500/10 border border-green-500/30 rounded-lg p-4"
              >
                <p className="text-green-400 text-sm font-medium">
                  Thank you for subscribing! Check your email for confirmation.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 text-sm"
                  />
                  <MdEmail className="absolute right-3 top-3.5 text-gray-500 text-lg" />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all shadow-lg shadow-blue-500/20"
                >
                  Subscribe
                </motion.button>
              </form>
            )}

            <p className="text-xs text-gray-500 mt-3">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800/50 my-8" />

        {/* Bottom Row */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-gray-500 text-xs md:text-sm text-center md:text-left">
            © {new Date().getFullYear()} Tetemeko Media Group. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <Link href="#" className="text-gray-500 hover:text-blue-400 text-xs md:text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-gray-500 hover:text-blue-400 text-xs md:text-sm transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="text-gray-500 hover:text-blue-400 text-xs md:text-sm transition-colors">
              Cookies
            </Link>
            <Link href="#" className="text-gray-500 hover:text-blue-400 text-xs md:text-sm transition-colors">
              Accessibility
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
