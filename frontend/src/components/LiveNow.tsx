// LiveNow Component
'use client'
import { useEffect, useState }  from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { getStations } from '@/services/stations'
import { Station } from '@/interfaces/Station'
import React from 'react'

const RadioWaveVisualization = ({ isPlaying }: { isPlaying: boolean }) => {
  return (
    <div className="relative w-16 h-16 flex items-center justify-center">
      {[1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{
            scale: isPlaying ? [1, 1.4, 1] : 1,
            opacity: isPlaying ? [0.7, 0] : 0.3
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatDelay: i * 0.3,
            ease: 'easeOut'
          }}
          className="absolute border-2 border-blue-400 rounded-full"
          style={{ width: `${i * 20}px`, height: `${i * 20}px` }}
        />
      ))}
      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center z-10">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
      </div>
    </div>
  )
}

interface StationCardProps {
  station: Station;
  togglePlay: (stationId: string) => void;
  isPlaying: boolean;
  setHoveredStation: React.Dispatch<React.SetStateAction<string | null>>;
  hoveredStation: string | null;
}

const StationCard = React.memo(({ station, togglePlay, isPlaying, setHoveredStation, hoveredStation }: StationCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
    onMouseEnter={() => setHoveredStation(station._id)}
    onMouseLeave={() => setHoveredStation(null)}
    className="relative bg-white/5 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-white/10 hover:border-blue-500/50 transition-all duration-300"
  >
    <div className="flex items-center gap-4">
      {/* Station Logo */}
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 border-white/20 flex-shrink-0">
        <Image
          src={station.imageUrl || '/default-logo.jpg'}
          alt={station.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Station Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-xl font-bold text-white truncate">{station.name}</h3>
        <p className="text-blue-300 text-sm mb-2">{station.type}</p>
        <div className="flex flex-wrap gap-2">
          {station.genre.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="bg-blue-600/20 border border-blue-500/30 text-blue-300 px-2 py-0.5 rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Play Button with Visualizer */}
      <button
        onClick={() => togglePlay(station._id)}
        className="flex-shrink-0"
      >
        <RadioWaveVisualization isPlaying={isPlaying} />
      </button>
    </div>

    {/* Expanded Info on Hover */}
    {hoveredStation === station._id && (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="mt-4 overflow-hidden"
      >
        <p className="text-gray-300 text-sm">{station.description}</p>
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-2 text-sm text-blue-300">
            <span>Currently playing:</span>
            <span className="font-medium">Latest Hits Mix</span>
          </div>
          <Link href={`/stations/${station._id}`} passHref>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-sm font-medium rounded-lg transition">
              Visit Station
            </button>
          </Link>
        </div>
      </motion.div>
    )}
  </motion.div>
));

export default function LiveNow() {
  const [stations, setStations] = useState<Station[]>([])
  const [loading, setLoading] = useState(true)
  const [hoveredStation, setHoveredStation] = useState<string | null>(null)
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null)

  useEffect(() => {
    const fetchStations = async () => {
      const data = await getStations({
        fields: ['_id', 'name', 'imageUrl', 'type', 'genre', 'description'],
        limit: 0
      });
      setStations(data)
      setLoading(false)
    }
    fetchStations()
  }, [])

  const togglePlay = (stationId: string) => {
    setCurrentlyPlaying(currentlyPlaying === stationId ? null : stationId)
  }

  return (
    <section className="py-20 bg-gradient-to-b from-[#07131F] to-[#0A1B2D] text-white relative overflow-hidden">
      {/* Floating audio waves background */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              x: ['-100%', '100%'],
              opacity: [0, 0.5, 0]
            }}
            transition={{
              duration: 15 + Math.random() * 20,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
            className="absolute h-1 bg-blue-400 rounded-full"
            style={{
              width: `${100 + Math.random() * 300}px`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Live Broadcasts</h2>
          <div className="mx-auto h-1 w-28 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400 rounded-full mb-4" />
          <p className="text-blue-200 max-w-xl mx-auto text-lg">
            Tune in to our stations broadcasting live right now
          </p>
        </div>

        {/* Stations List - Interactive Audio Wave */}
        {loading ? (
          <div className="flex justify-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : stations.length === 0 ? (
          <p className="text-center text-blue-400">No stations are live at the moment.</p>
        ) : (
          stations.map((station) => (
            <StationCard
              key={station._id}
              station={station}
              togglePlay={togglePlay}
              isPlaying={currentlyPlaying === station._id}
              setHoveredStation={setHoveredStation}
              hoveredStation={hoveredStation}
            />
          ))
        )}

        {/* All Stations Link */}
        <div className="text-center mt-16">
          <Link href="/stations">
            <button className="inline-flex items-center px-6 py-3 border border-white/20 hover:border-blue-500 text-sm font-medium rounded-full text-white bg-white/5 hover:bg-white/10 transition-all">
              Explore All Stations
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}