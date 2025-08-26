'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { FaPlay, FaHeart, FaShare, FaInfoCircle, FaTimes } from "react-icons/fa";
import { Station } from "@/interfaces/Station";
import { getStations } from "@/services/stations";
import SectionHeader from "./SectionHeader";

export default function StationsSection2() {
  const [stations, setStations] = useState<Station[]>([]);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getStations({
          fields: ['_id', 'name', 'imageUrl', 'type', 'genre', 'description', 'isActive', 'listenerz', 'liveShow', 'location', 'streamUrl'],
          limit: 0
        });
        setStations(data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching stations:", error);
        setLoading(false);
      }
    };
    fetchData();

    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('favoriteStations');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const toggleFavorite = (id: string) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter(stationId => stationId !== id)
      : [...favorites, id];

    setFavorites(newFavorites);
    localStorage.setItem('favoriteStations', JSON.stringify(newFavorites));
  };

  const openModal = (station: Station) => {
    setSelectedStation(station);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStation(null);
  };

  return (
    <section id="stations-grid" className="py-12 md:py-20 px-4 sm:px-6 relative">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title="Our Broadcasting Network"
          subtitle="Explore our diverse range of radio and TV stations"
          variant="light"
        />

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white/5 rounded-xl aspect-[4/5] sm:aspect-[4/3] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {stations.map((station) => (
              <motion.div
                key={station._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all duration-300 hover:shadow-lg"
              >
                <div className="relative aspect-square sm:aspect-[4/3] overflow-hidden">
                  <Image
                    src={station.imageUrl && station.imageUrl.trim() !== ""
                      ? station.imageUrl
                      : "/placeholder.png"}
                    alt={station.name}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(station._id);
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-full ${favorites.includes(station._id)
                      ? 'text-red-500 bg-white/20'
                      : 'text-white bg-black/40'
                      } hover:bg-white/30 transition active:scale-90`}
                    aria-label={favorites.includes(station._id) ? "Remove from favorites" : "Add to favorites"}
                  >
                    <FaHeart className={favorites.includes(station._id) ? 'fill-current' : ''} size={14} />
                  </button>

                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${station.isActive
                      ? 'bg-green-500/20 text-green-400 animate-pulse'
                      : 'bg-gray-500/20 text-gray-400'
                      }`}>
                      {station.isActive ? 'LIVE' : 'OFFLINE'}
                    </span>
                  </div>
                </div>

                <div
                  className="p-4 cursor-pointer"
                  onClick={() => openModal(station)}
                >
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <h3 className="font-bold text-base sm:text-lg truncate">{station.name}</h3>
                    <span className="text-xs bg-white/10 px-2 py-1 rounded whitespace-nowrap">
                      {station.type}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {station.genre.slice(0, 3).map((genre, i) => (
                      <span
                        key={i}
                        className="text-xs bg-white/10 px-2 py-0.5 rounded"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs sm:text-sm text-gray-300 line-clamp-2 mb-3 sm:mb-4">
                    {station.description}
                  </p>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">
                      {station.listenerz?.toLocaleString() || '0'} listeners
                    </span>
                    <button
                      className="p-2 bg-secondary rounded-full hover:bg-secondary-dark transition active:scale-90"
                      aria-label={`Play ${station.name}`}
                    >
                      <FaPlay className="text-xs" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Station Details Modal */}
      <AnimatePresence>
        {isModalOpen && selectedStation && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="relative bg-gradient-to-b from-primary to-primary-dark rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="relative h-48 sm:h-56">
                <Image
                  src={selectedStation.imageUrl && selectedStation.imageUrl.trim() !== ""
                    ? selectedStation.imageUrl
                    : "/placeholder.png"}
                  alt={selectedStation.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-primary to-transparent" />
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                  <div>
                    <span className="bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded text-xs">
                      {selectedStation.type}
                    </span>
                  </div>
                  <button
                    onClick={closeModal}
                    className="bg-black/50 text-white p-2 rounded-full hover:bg-black transition"
                    aria-label="Close modal"
                  >
                    <FaTimes size={16} />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-4 sm:p-6">
                <div className="flex justify-between items-start mb-4 gap-2">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold">{selectedStation.name}</h2>
                    <p className="text-sm sm:text-base text-gray-300">{selectedStation.location}</p>
                  </div>
                  <button
                    onClick={() => toggleFavorite(selectedStation._id)}
                    className={`p-2 rounded-full ${favorites.includes(selectedStation._id)
                      ? 'text-red-500'
                      : 'text-gray-300'
                      }`}
                    aria-label={favorites.includes(selectedStation._id) ? "Remove from favorites" : "Add to favorites"}
                  >
                    <FaHeart
                      size={18}
                      className={favorites.includes(selectedStation._id) ? 'fill-current' : ''}
                    />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedStation.genre.map((genre, i) => (
                    <span key={i} className="bg-white/10 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                      {genre}
                    </span>
                  ))}
                </div>

                <p className="mb-4 sm:mb-6 text-sm sm:text-base">{selectedStation.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="bg-white/5 p-3 rounded-lg">
                    <h4 className="text-xs sm:text-sm text-gray-400 mb-1">Current Show</h4>
                    <p className="text-sm sm:text-base">{selectedStation.liveShow || 'Not available'}</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg">
                    <h4 className="text-xs sm:text-sm text-gray-400 mb-1">Listeners</h4>
                    <p className="text-sm sm:text-base">{selectedStation.listenerz?.toLocaleString() || 'Unknown'}</p>
                  </div>
                </div>

                {/* Audio Player */}
                {selectedStation.streamUrl && selectedStation.streamUrl.trim() !== "" ? (
                  <div className="mb-4 sm:mb-6">
                    <audio controls autoPlay className="w-full rounded-lg bg-white/10">
                      <source src={selectedStation.streamUrl} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                ) : (
                  <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-500/10 text-red-400 rounded-lg flex items-center gap-2 text-sm sm:text-base">
                    <FaInfoCircle />
                    <span>Stream currently unavailable</span>
                  </div>
                )}


                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <button
                    className="flex-1 flex items-center justify-center gap-2 bg-secondary hover:bg-secondary-dark px-4 py-2 sm:py-3 rounded-lg font-medium text-sm sm:text-base"
                    aria-label={`Listen to ${selectedStation.name}`}
                  >
                    <FaPlay size={14} /> Listen Live
                  </button>
                  <button
                    className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 sm:py-3 rounded-lg font-medium text-sm sm:text-base"
                    aria-label={`Share ${selectedStation.name}`}
                  >
                    <FaShare size={14} /> Share
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}