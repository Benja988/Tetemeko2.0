'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { getStations } from '@/services/stations'
import { Station } from '@/interfaces/Station'
import { FiChevronRight, FiHeart, FiTrendingUp, FiStar, FiTarget, FiPlay, FiRadio, FiUsers, FiAward } from 'react-icons/fi'
import Link from 'next/link'
import ComingSoonModal from './ComingSoonModal'

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay },
  }),
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }
}

// Company strengths data
const strengthsData = {
  'innovation': {
    title: 'Innovation First',
    description: 'We leverage cutting-edge technology to deliver exceptional media experiences',
    features: [
      'State-of-the-art broadcasting technology',
      'AI-powered content recommendations',
      'Seamless multi-platform streaming',
      'Interactive listener engagement tools',
      'Real-time analytics for content optimization'
    ],
    image: '/Innovation.jpg',
    icon: <FiTrendingUp className="text-cyan-400" size={24} />,
    stats: {
      tech: 'Cutting-edge',
      uptime: '99.9%',
      innovation: 'Industry leading'
    }
  },
  'community': {
    title: 'Community Focus',
    description: 'We amplify local voices and connect communities across Kenya',
    features: [
      'Dedicated local content programming',
      'Community events and partnerships',
      'Platform for emerging local artists',
      'Cultural preservation initiatives',
      'Grassroots journalism and storytelling'
    ],
    image: '/Community.jpg',
    icon: <FiHeart className="text-pink-400" size={24} />,
    stats: {
      communities: '50+',
      partners: '100+',
      events: 'Monthly'
    }
  },
  'quality': {
    title: 'Premium Quality',
    description: 'Exceptional content crafted by talented professionals',
    features: [
      'Award-winning production team',
      'High-fidelity audio engineering',
      'Curated music selection',
      'Expert hosts and personalities',
      'Professional development programs'
    ],
    image: '/Quality.jpg',
    icon: <FiStar className="text-yellow-400" size={24} />,
    stats: {
      team: '50+',
      quality: 'Premium',
      satisfaction: '98%'
    }
  },
} as const

type Strength = keyof typeof strengthsData

// Sub-components for better organization
const FloatingParticles = () => {
  const particles = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: `${Math.random() * 100}%`,
        size: `${Math.random() * 4 + 1}px`,
        duration: 15 + Math.random() * 30,
        delay: Math.random() * 10,
      })),
    []
  )

  return (
    <div className="absolute inset-0 -z-20 pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: -100 }}
          animate={{
            opacity: [0, 0.3, 0],
            y: ['0%', '100vh'],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'linear'
          }}
          className="absolute rounded-full bg-gradient-to-r from-cyan-400/40 to-purple-400/40"
          style={{
            left: p.x,
            top: '-10%',
            width: p.size,
            height: p.size
          }}
        />
      ))}
    </div>
  )
}

const StrengthSelector = ({
  strengths,
  activeStrength,
  setActiveStrength
}: {
  strengths: Strength[];
  activeStrength: Strength;
  setActiveStrength: (strength: Strength) => void;
}) => (
  <div className="flex justify-center gap-4 md:gap-6 mb-12 md:mb-16 flex-wrap">
    {strengths.map((strength, i) => (
      <motion.button
        key={strength}
        variants={fadeUp}
        custom={i * 0.2}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        onClick={() => setActiveStrength(strength)}
        className={`px-5 md:px-7 py-3 rounded-xl font-medium transition-all flex items-center gap-3 relative overflow-hidden group ${activeStrength === strength
          ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/30'
          : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'
          }`}
      >
        {strengthsData[strength].icon}
        <span className="whitespace-nowrap">{strengthsData[strength].title}</span>
        {activeStrength === strength && (
          <motion.span
            layoutId="strengthIndicator"
            className="w-2 h-2 rounded-full bg-white"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </motion.button>
    ))}
  </div>
)

const StationCard = ({
  station,
  index,
  isHoveringStation,
  setIsHoveringStation
}: {
  station: Station;
  index: number;
  isHoveringStation: number | null;
  setIsHoveringStation: (index: number | null) => void;
}) => (
  <motion.div
    key={station._id ?? station.name ?? index}
    initial={{ opacity: 0, y: 30, scale: 0.95 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true, margin: "0px 0px -50px 0px" }}
    transition={{ delay: index * 0.05, duration: 0.5 }}
    whileHover={{
      y: -8,
      transition: { duration: 0.3, ease: "easeOut" }
    }}
    onHoverStart={() => setIsHoveringStation(index)}
    onHoverEnd={() => setIsHoveringStation(null)}
    className="relative group cursor-pointer"
  >
    <div className="relative bg-gradient-to-br from-slate-900 via-primary-dark to-primary border border-white/10 rounded-2xl overflow-hidden shadow-2xl h-full flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={station.imageUrl || '/default-logo.jpg'}
          alt={`${station.name || 'Station'} logo`}
          fill
          className={`object-cover transition-all duration-700 ${isHoveringStation === index ? 'scale-110' : 'scale-100'
            }`}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-70 transition-opacity duration-500" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-red-500/90 backdrop-blur-sm px-2 py-1 rounded-full z-10">
          <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span className="text-xs font-medium text-white">LIVE</span>
        </div>

        {station.frequency && (
          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full z-10">
            <span className="text-xs font-medium text-white">{station.frequency}</span>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: isHoveringStation === index ? 1 : 0,
            scale: isHoveringStation === index ? 1 : 0.8
          }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 flex items-center justify-center z-10"
        >
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 backdrop-blur-sm border border-white/30 shadow-lg">
            <FiPlay className="text-white ml-1" size={20} />
          </div>
        </motion.div>
      </div>

      <div className="p-4 md:p-5 flex flex-col flex-grow">
        <div className="mb-3">
          <h4 className="font-bold text-white text-lg md:text-xl mb-1 leading-tight">
            {station.name || 'Unnamed Station'}
          </h4>
          <div className="flex items-center gap-2">
            <FiRadio size={14} className="text-cyan-300" />
            <p className="text-sm text-gray-300">
              {station.type || 'Radio'} Station
            </p>
          </div>
        </div>

        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {station.description || 'Bringing you the best in music, news, and entertainment across Kenya.'}
        </p>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center">
            <div className="text-white font-bold text-sm">24/7</div>
            <div className="text-xs text-gray-400">Broadcast</div>
          </div>
          <div className="text-center">
            <div className="text-white font-bold text-sm">98%</div>
            <div className="text-xs text-gray-400">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-white font-bold text-sm">5+</div>
            <div className="text-xs text-gray-400">Languages</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {['Music', 'News', 'Sports', 'Culture'].slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="text-xs bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-gray-300 px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
          <span className="text-xs text-gray-500 px-2 py-1">+2 more</span>
        </div>

        {/* <button className="mt-auto w-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 text-white py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2">
          <FiPlay size={14} />
          Tune In Now
        </button> */}
      </div>

      <div className={`absolute inset-0 rounded-2xl border-2 transition-all duration-300 pointer-events-none ${isHoveringStation === index
        ? 'border-cyan-400/50 shadow-lg shadow-cyan-500/30'
        : 'border-transparent'
        }`} />
    </div>
  </motion.div>
)

export default function AboutUs() {
  const [stations, setStations] = useState<Station[]>([])
  const [activeStrength, setActiveStrength] = useState<Strength>('innovation')
  const [isHoveringStation, setIsHoveringStation] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Auto-rotate strengths
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStrength(prev => {
        const strengths = Object.keys(strengthsData) as Strength[]
        const currentIndex = strengths.indexOf(prev)
        return strengths[(currentIndex + 1) % strengths.length]
      })
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  // Fetch stations
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const data = await getStations({
          fields: ['_id', 'name', 'imageUrl', 'type', 'frequency'],
          limit: 0
        })
        setStations(data)
      } catch (err) {
        console.error('Failed to fetch stations', err)
      }
    }
    fetchStations()
  }, [])

  const currentStrength = strengthsData[activeStrength]
  const strengths = Object.keys(strengthsData) as Strength[]

  return (
    <section
      id="about-us"
      className="relative bg-gradient-to-br from-slate-900 via-primary to-slate-900 text-white py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      <FloatingParticles />

      {/* Animated gradient overlay */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-cyan-500/10 to-transparent"
          animate={{ opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-purple-500/10 to-transparent"
          animate={{ opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, delay: 2 }}
        />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          className="text-center mb-16 md:mb-20"
        >
          <motion.h2
            variants={fadeUp}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 tracking-tight"
          >
            The Future of <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Media</span> Is Here
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={0.2}
            className="text-lg md:text-xl text-gray-300 font-light max-w-3xl mx-auto leading-relaxed"
          >
            We're redefining media in Kenya with innovative technology, community focus,
            and premium content that connects and inspires.
          </motion.p>
        </motion.div>

        <StrengthSelector
          strengths={strengths}
          activeStrength={activeStrength}
          setActiveStrength={setActiveStrength}
        />

        {/* Strengths content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center mb-20">
          {/* Media display */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-80 sm:h-96 md:h-[500px] w-full rounded-3xl overflow-hidden shadow-2xl border-2 border-white/10 group"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStrength}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full h-full"
              >
                <Image
                  src={currentStrength.image}
                  alt={`${activeStrength} strength`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 z-10">
                  <motion.h3
                    className="text-2xl font-bold"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {currentStrength.title}
                  </motion.h3>
                  <motion.p
                    className="text-gray-300 mt-1 max-w-md"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {currentStrength.description}
                  </motion.p>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="space-y-6"
          >
            <motion.div
              variants={scaleIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h3 className="text-3xl md:text-4xl font-bold text-cyan-200 mb-4">
                Our {currentStrength.title}
              </h3>
            </motion.div>

            <ul className="space-y-4">
              {currentStrength.features.map((feature, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-start gap-3 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 p-4 rounded-xl backdrop-blur-sm border border-white/10 hover:border-cyan-400/30 transition-all duration-300 group"
                >
                  <div className="flex-shrink-0 mt-1.5 w-3 h-3 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400" />
                  <p className="text-gray-300 group-hover:text-white transition-colors">{feature}</p>
                </motion.li>
              ))}
            </ul>

            {/* Stats */}
            <motion.div
              className="
    grid 
    grid-cols-1        /* mobile: 1 column */
    sm:grid-cols-2     /* small screens (≥640px): 2 columns */
    md:grid-cols-3     /* medium screens (≥768px): 3 columns */
    gap-4 mt-8
  "
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
            >
              {Object.entries(currentStrength.stats).map(([key, value], i) => (
                <motion.div
                  key={key}
                  variants={fadeUp}
                  className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 px-4 py-4 rounded-xl backdrop-blur-sm border border-white/10 hover:border-cyan-400/30 transition-all duration-300 group"
                >
                  <div className="text-2xl md:text-3xl font-bold text-center bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    {value}
                  </div>
                  <div className="text-sm text-gray-300 mt-1 text-center capitalize group-hover:text-white transition-colors">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Mission statement */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-16 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-3xl p-8 md:p-12 border border-white/10 backdrop-blur-sm relative overflow-hidden"
        >
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-400/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl"></div>

          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <div className="inline-flex p-3 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full mb-6">
              <FiTarget className="text-cyan-300" size={36} />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Our Mission</h3>
            <p className="text-lg text-gray-300 mb-6 max-w-3xl mx-auto">
              To revolutionize media in Kenya by creating authentic connections, amplifying local voices,
              and delivering exceptional content through innovative technology.
            </p>
            <div className="h-1 w-24 bg-gradient-to-r from-cyan-400 to-purple-400 mx-auto rounded-full"></div>
          </div>
        </motion.div>

        {/* Stations section */}
        <div className="mt-16 md:mt-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            className="text-center mb-12"
          >
            <motion.h3 variants={fadeUp} className="text-2xl md:text-3xl font-bold mb-2">
              Our Growing Network
            </motion.h3>
            <motion.p variants={fadeUp} custom={0.1} className="text-gray-300 max-w-2xl mx-auto">
              Connecting communities across Kenya through diverse programming and local content
            </motion.p>
          </motion.div>

          <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
              {stations.slice(0, 8).map((station, i) => (
                <div
                  key={station._id ?? station.name ?? i}
                  className="w-full max-w-xs"
                >
                  <StationCard
                    station={station}
                    index={i}
                    isHoveringStation={isHoveringStation}
                    setIsHoveringStation={setIsHoveringStation}
                  />
                </div>
              ))}

              {/* Add invisible placeholder cards to center the grid on desktop */}
              {stations.length > 0 && stations.length < 4 && (
                <>
                  {Array.from({ length: 4 - stations.length }).map((_, i) => (
                    <div key={`placeholder-${i}`} className="w-full max-w-xs invisible" aria-hidden="true">
                      <div className="w-full h-0"></div>
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Mobile scroll indicator (optional) */}
            <div className="sm:hidden text-center mt-2 text-xs text-gray-500">
              ← Scroll to explore →
            </div>
          </div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-16 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl p-6 md:p-8 border border-white/10 backdrop-blur-sm relative overflow-hidden"
          >
            <div className="absolute -top-10 -left-10 w-20 h-20 bg-cyan-400/20 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-purple-400/20 rounded-full blur-2xl"></div>

            <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[
                { value: '50+', label: 'Communities Served', icon: <FiUsers className="text-cyan-400" size={20} /> },
                { value: '24/7', label: 'Broadcast Coverage', icon: <FiRadio className="text-yellow-400" size={20} /> },
                { value: '100K+', label: 'Weekly Listeners', icon: <FiTrendingUp className="text-green-400" size={20} /> },
                { value: '15+', label: 'Counties Covered', icon: <FiAward className="text-pink-400" size={20} /> },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i }}
                  className="text-center p-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl backdrop-blur-sm border border-white/10 hover:border-cyan-400/30 transition-all duration-300"
                >
                  <div className="flex justify-center mb-2">
                    {stat.icon}
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-300 mt-1 hover:text-white transition-colors">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {stations.length > 8 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center mt-12"
            >
              <button className="px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white hover:from-cyan-500/30 hover:to-purple-500/30 transition-all duration-300 flex items-center gap-2 mx-auto backdrop-blur-sm border border-white/10 hover:border-white/30 group">
                View All {stations.length} Stations
                <motion.span
                  initial={{ x: 0 }}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <FiChevronRight />
                </motion.span>
              </button>
            </motion.div>
          )}
        </div>

        {/* CTA */}
        {/* <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-24 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-3xl p-8 md:p-12 border border-white/10 backdrop-blur-sm relative overflow-hidden"
        >
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-400/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Join Our Journey</h3>
            <p className="text-lg text-gray-300 mb-8 max-w-3xl mx-auto">
              Be part of the media revolution in Kenya. Together, we can shape the future of storytelling and connection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <button className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-full font-medium hover:from-cyan-600 hover:to-purple-600 transition-all shadow-lg shadow-cyan-500/20">
                  Partner With Us
                </button>
              </Link>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-8 py-3 border border-white/30 text-white rounded-full font-medium hover:bg-white/10 transition backdrop-blur-sm"
              >
                Career Opportunities
              </button>
              <ComingSoonModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="New Feature Coming Soon"
                description="We're currently developing an exciting new feature that will revolutionize your experience. Our team is working tirelessly to bring you the best possible solution."
                launchDate="October 10, 2025"
              />
            </div>
          </div>
        </motion.div> */}
      </div>
    </section>
  )
}