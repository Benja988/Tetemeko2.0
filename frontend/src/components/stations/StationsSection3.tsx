'use client';

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { getStations } from "@/services/stations";
import { Station } from "@/interfaces/Station";
import { FaHeadphones, FaHeart, FaShare, FaInfoCircle } from "react-icons/fa";
import SectionHeader from "./SectionHeader";

export default function StationsSection3() {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' }>({ 
    key: 'name', 
    direction: 'ascending' 
  });
  const [filter, setFilter] = useState<'all' | 'radio' | 'tv'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchStations = async () => {
      setLoading(true);
      try {
        const data = await getStations({
          fields: ['_id', 'name', 'imageUrl', 'type', 'genre', 'description', 'isActive', 'listenerz', 'liveShow', 'location', 'streamUrl'],
          limit: 0
        });
        setStations(data || []);
      } catch (error) {
        console.error("Error fetching stations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStations();
  }, []);

  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedStations = [...stations].sort((a, b) => {
    const getValue = (station: Station, key: string) => {
      if (key === 'name') return station.name.toLowerCase();
      if (key === 'listenerz') return station.listenerz ?? 0;
      return '';
    };
    const aValue = getValue(a, sortConfig.key);
    const bValue = getValue(b, sortConfig.key);

    if (aValue < bValue) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const filteredStations = sortedStations.filter(station => {
    const matchesFilter = filter === 'all' || station.type.toLowerCase() === filter;
    const matchesSearch = station.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         station.genre.some(g => g.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-primary to-primary-dark">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title="Stations Directory"
          subtitle="Find and connect with your favorite stations"
          variant="dark"
        />

        {/* Filters and Search */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                filter === 'all' 
                  ? 'bg-green-700 text-white' 
                  : 'bg-green/10 text-white hover:bg-white/20'
              }`}
            >
              All Stations
            </button>
            <button
              onClick={() => setFilter('radio')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                filter === 'radio' 
                  ? 'bg-secondary text-white' 
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Radio
            </button>
            <button
              onClick={() => setFilter('tv')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                filter === 'tv' 
                  ? 'bg-secondary text-white' 
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              TV
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search stations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-full pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Stations Table */}
        <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
          <table className="w-full min-w-[800px]">
            <thead className="border-b border-white/10">
              <tr className="text-left text-gray-300">
                <th 
                  className="p-4 cursor-pointer hover:text-white transition"
                  onClick={() => requestSort('name')}
                >
                  <div className="flex items-center gap-1">
                    Station
                    {sortConfig.key === 'name' && (
                      <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th className="p-4">Genres</th>
                <th 
                  className="p-4 cursor-pointer hover:text-white transition"
                  onClick={() => requestSort('listenerz')}
                >
                  <div className="flex items-center gap-1">
                    Listeners
                    {sortConfig.key === 'listenerz' && (
                      <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400">
                    Loading stations...
                  </td>
                </tr>
              ) : filteredStations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400">
                    No stations found matching your criteria
                  </td>
                </tr>
              ) : (
                filteredStations.map((station, index) => (
                  <motion.tr
                    key={station._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`border-b border-white/5 hover:bg-white/10 transition ${
                      index % 2 === 0 ? 'bg-white/5' : 'bg-white/0'
                    }`}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                          <Image
                            src={station.imageUrl}
                            alt={station.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{station.name}</div>
                          <div className="text-xs text-gray-400">{station.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {station.genre.slice(0, 2).map((genre, i) => (
                          <span key={i} className="text-xs bg-white/10 px-2 py-0.5 rounded">
                            {genre}
                          </span>
                        ))}
                        {station.genre.length > 2 && (
                          <span className="text-xs text-gray-400">+{station.genre.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      {station.listenerz?.toLocaleString() || '0'}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        station.isActive 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {station.isActive ? (
                          <>
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                            Live
                          </>
                        ) : 'Offline'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        {station.streamUrl ? (
                          <a
                            href={station.streamUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition"
                            title="Listen"
                          >
                            <FaHeadphones className="text-sm" />
                          </a>
                        ) : (
                          <button 
                            className="p-2 bg-white/10 rounded-full cursor-not-allowed"
                            title="Stream unavailable"
                          >
                            <FaInfoCircle className="text-sm" />
                          </button>
                        )}
                        <button 
                          className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition"
                          title="Add to favorites"
                        >
                          <FaHeart className="text-sm" />
                        </button>
                        <button 
                          className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition"
                          title="Share"
                        >
                          <FaShare className="text-sm" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/5 p-4 rounded-lg">
            <div className="text-2xl font-bold">{stations.length}</div>
            <div className="text-sm text-gray-400">Total Stations</div>
          </div>
          <div className="bg-white/5 p-4 rounded-lg">
            <div className="text-2xl font-bold">
              {stations.filter(s => s.type === 'Radio Station').length}
            </div>
            <div className="text-sm text-gray-400">Radio Stations</div>
          </div>
          <div className="bg-white/5 p-4 rounded-lg">
            <div className="text-2xl font-bold">
              {stations.filter(s => s.type === 'TV Station').length}
            </div>
            <div className="text-sm text-gray-400">TV Channels</div>
          </div>
          <div className="bg-white/5 p-4 rounded-lg">
            <div className="text-2xl font-bold">
              {stations.filter(s => s.isActive).length}
            </div>
            <div className="text-sm text-gray-400">Currently Live</div>
          </div>
        </div>
      </div>
    </section>
  );
}