"use client";

import { useEffect, useState } from "react";
import { Play, User, Clock, TrendingUp, Filter, Loader, ChevronUp, ChevronDown } from "lucide-react";
import { Podcast } from "@/interfaces/podcasts";
import { podcastService } from "@/services/podcasts/podcastsService";
import EpisodeModal from "./EpisodeModal";

export default function PodCastSection2() {
  const [allPodcasts, setAllPodcasts] = useState<Podcast[]>([]);
  const [displayedPodcasts, setDisplayedPodcasts] = useState<Podcast[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [visibleCount, setVisibleCount] = useState(6);
  const [initialCount, setInitialCount] = useState(6); // Track initial count for each screen size
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const res = await podcastService.getAll({ page: 1, limit: 12 });
        setAllPodcasts(res.podcasts);
        setDisplayedPodcasts(res.podcasts.slice(0, visibleCount));
      } catch (err) {
        console.error("Failed to load podcasts", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPodcasts();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setInitialCount(4); // 4 on mobile (2x2 grid)
        setVisibleCount(prev => Math.max(4, prev)); // Ensure at least initial count
      } else if (window.innerWidth < 1024) {
        setInitialCount(6); // 6 on tablet (3x2 grid)
        setVisibleCount(prev => Math.max(6, prev));
      } else {
        setInitialCount(8); // 8 on desktop (4x2 grid)
        setVisibleCount(prev => Math.max(8, prev));
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setDisplayedPodcasts(allPodcasts.slice(0, visibleCount));
  }, [visibleCount, allPodcasts]);

  const handlePodcastClick = (podcast: Podcast) => {
    setSelectedPodcast(podcast);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPodcast(null);
  };

  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + 4, allPodcasts.length));
  };

  const loadLess = () => {
    setVisibleCount(prev => Math.max(prev - 4, initialCount));
  };

  const filterOptions = [
    { id: "all", label: "All Shows", icon: <Filter className="h-3 w-3" /> },
    { id: "popular", label: "Popular", icon: <TrendingUp className="h-3 w-3" /> },
    { id: "recent", label: "Recent", icon: <Clock className="h-3 w-3" /> },
    { id: "trending", label: "Trending", icon: <TrendingUp className="h-3 w-3" /> }
  ];

  if (isLoading) {
    return (
      <section className="py-12 lg:py-16 px-4 sm:px-6 bg-gradient-to-b from-slate-900 to-slate-950 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header Skeleton */}
          <div className="text-center mb-10 lg:mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-slate-800/50 text-xs mb-6 mx-auto animate-pulse w-40 h-8"></div>
            <div className="h-10 bg-slate-800 rounded-lg max-w-md mx-auto mb-4"></div>
            <div className="h-4 bg-slate-800 rounded max-w-sm mx-auto"></div>
          </div>
          
          {/* Filter Skeleton */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 w-24 bg-slate-800 rounded-full animate-pulse"></div>
            ))}
          </div>
          
          {/* Podcast Grid Skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-slate-800/30 rounded-2xl p-5 border border-slate-700/30 animate-pulse">
                <div className="w-full aspect-[1/1] bg-slate-700 rounded-xl mb-4"></div>
                <div className="h-5 bg-slate-700 rounded mb-3"></div>
                <div className="h-3 bg-slate-700 rounded mb-2 w-4/5"></div>
                <div className="h-3 bg-slate-700 rounded mb-4 w-3/5"></div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-slate-700 rounded-full mr-2"></div>
                    <div className="h-3 bg-slate-700 rounded w-16"></div>
                  </div>
                  <div className="h-3 bg-slate-700 rounded w-10"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-12 lg:py-16 px-4 sm:px-6 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-300 text-sm mb-6 backdrop-blur-sm border border-purple-500/20">
              <TrendingUp className="h-4 w-4 mr-2" />
              Curated Collection
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 text-white">
              Discover <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Podcasts</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Explore our handpicked selection of podcasts that inspire, inform, and entertain.
            </p>
          </div>
          
          {/* Filter Options */}
          <div className="flex flex-col items-center mb-12">
            <div className="flex flex-wrap justify-center gap-3 w-full">
              {filterOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setActiveFilter(option.id)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                    activeFilter === option.id
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/20"
                      : "bg-slate-800/40 text-gray-400 hover:bg-slate-700/50 hover:text-white border border-slate-700/40 backdrop-blur-sm"
                  }`}
                >
                  {option.icon}
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Podcast Grid - 2 columns on mobile */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {displayedPodcasts.map((podcast) => (
              <div 
                key={podcast._id} 
                className="group bg-gradient-to-b from-slate-800/40 to-slate-900/40 hover:from-slate-800/60 hover:to-slate-900/60 rounded-2xl p-5 transition-all duration-500 border border-slate-700/30 hover:border-purple-500/30 cursor-pointer shadow-lg hover:shadow-purple-500/10"
                onClick={() => handlePodcastClick(podcast)}
              >
                <div className="relative overflow-hidden rounded-xl mb-4">
                  {podcast.coverImage && (
                    <img
                      src={podcast.coverImage}
                      alt={podcast.title}
                      className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                    <button className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                      <Play className="h-4 w-4 ml-0.5 text-white" fill="white" />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-base font-semibold mb-2 text-white line-clamp-1 group-hover:text-purple-300 transition-colors duration-300">
                  {podcast.title}
                </h3>
                
                <p className="text-xs text-gray-400 mb-4 line-clamp-2 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  {podcast.description}
                </p>
                
                <div className="flex items-center justify-between pt-3 border-t border-slate-700/30">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-slate-700/50 rounded-full flex items-center justify-center mr-2 group-hover:bg-slate-600/50 transition-colors duration-300">
                      <User className="h-3.5 w-3.5 text-gray-400" />
                    </div>
                    <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                      {podcast.createdBy?.name || "Unknown Host"}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-xs text-gray-500 group-hover:text-gray-400 transition-colors duration-300">
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    <span>45m</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
            {/* Load More Button - Only show if there are more podcasts to load */}
            {visibleCount < allPodcasts.length && (
              <button 
                onClick={loadMore}
                className="px-6 py-3 bg-gradient-to-r from-slate-800/40 to-slate-900/40 hover:from-slate-800/60 hover:to-slate-900/60 text-gray-400 hover:text-white rounded-xl border border-slate-700/30 hover:border-purple-500/30 transition-all duration-300 text-sm font-medium flex items-center gap-2 backdrop-blur-sm min-w-[180px] justify-center"
              >
                <ChevronDown className="h-4 w-4" />
                Load More ({allPodcasts.length - visibleCount} remaining)
              </button>
            )}
            
            {/* Load Less Button - Only show if user has loaded more than initial count */}
            {visibleCount > initialCount && (
              <button 
                onClick={loadLess}
                className="px-6 py-3 bg-gradient-to-r from-slate-800/40 to-slate-900/40 hover:from-slate-800/60 hover:to-slate-900/60 text-gray-400 hover:text-white rounded-xl border border-slate-700/30 hover:border-blue-500/30 transition-all duration-300 text-sm font-medium flex items-center gap-2 backdrop-blur-sm min-w-[180px] justify-center"
              >
                <ChevronUp className="h-4 w-4" />
                Show Less
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Episode Modal */}
      {selectedPodcast && (
        <EpisodeModal
          podcastId={selectedPodcast._id}
          podcastTitle={selectedPodcast.title}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </>
  );
}