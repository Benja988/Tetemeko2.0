"use client";

import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Clock, Calendar, Volume2, Share, Heart, Download } from "lucide-react";
import { Podcast, Episode } from "@/interfaces/podcasts";
import { podcastService } from "@/services/podcasts/podcastsService";
import { episodeService } from "@/services/episodes/episodeServices";
import Breadcrumbs from "../Breadcrumbs";

export default function PodCastSection1() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isLiked, setIsLiked] = useState(false);
  const [featuredPodcast, setFeaturedPodcast] = useState<Podcast | null>(null);
  const [latestEpisode, setLatestEpisode] = useState<Episode | null>(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await podcastService.getAll({ page: 1, limit: 1 });
        const podcast = res.podcasts[0];
        if (podcast) {
          setFeaturedPodcast(podcast);
          const episodesRes = await episodeService.getAll(podcast._id, { page: 1, limit: 1 });
          setLatestEpisode(episodesRes.episodes[0] || null);
        }
      } catch (err) {
        console.error("Failed to load featured podcast", err);
      }
    };
    fetchFeatured();
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    isPlaying ? audioRef.current.pause() : audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const newTime = clickPosition * duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const shareEpisode = () => {
    if (navigator.share && latestEpisode) {
      navigator.share({
        title: latestEpisode.title,
        text: `Check out this episode: ${latestEpisode.description}`,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

   const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Podcasts" },
  ];


  if (!featuredPodcast || !latestEpisode) return null;

  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-purple-900/70 to-slate-900 text-white py-20 px-6 md:px-16 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-10 animate-pulse delay-1000"></div>
      </div>
      <Breadcrumbs items={breadcrumbItems} />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Podcast Cover Art with Glow Effect */}
          <div className="relative group flex-shrink-0">
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl opacity-70 blur-xl group-hover:opacity-100 transition-opacity duration-300"></div>
            {featuredPodcast.coverImage && (
              <div className="relative">
                <img
                  src={featuredPodcast.coverImage}
                  alt={featuredPodcast.title}
                  className="w-80 h-80 lg:w-96 lg:h-96 rounded-2xl object-cover shadow-2xl relative z-10 transform group-hover:scale-[1.02] transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent rounded-2xl z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button
                    onClick={togglePlay}
                    className="w-20 h-20 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-all duration-300 hover:shadow-purple-500/30"
                  >
                    {isPlaying ? (
                      <Pause className="h-8 w-8" />
                    ) : (
                      <Play className="h-8 w-8 ml-1" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Podcast Info */}
          <div className="flex-1">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-900/40 to-blue-900/40 text-purple-300 text-sm mb-6 backdrop-blur-sm border border-purple-500/20">
              <div className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse"></div>
              Featured Podcast • Updated Weekly
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              {featuredPodcast.title}
            </h1>
            
            <p className="text-xl text-gray-300 mb-10 max-w-2xl leading-relaxed">
              {featuredPodcast.description}
            </p>

            {/* Latest Episode Card */}
            <div className="bg-slate-800/40 backdrop-blur-lg rounded-3xl p-8 border border-slate-700/30 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3 text-purple-300">
                  <div className="p-2 bg-purple-900/30 rounded-lg">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <span className="font-medium">Latest Episode</span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setIsLiked(!isLiked)}
                    className={`p-2 rounded-lg transition-colors ${isLiked ? 'text-red-500 bg-red-900/20' : 'text-gray-400 hover:text-red-400 hover:bg-slate-700/50'}`}
                  >
                    <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                  </button>
                  <button 
                    onClick={shareEpisode}
                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-slate-700/50 transition-colors"
                  >
                    <Share className="h-5 w-5" />
                  </button>
                  <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-slate-700/50 transition-colors">
                    <Download className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <h2 className="text-3xl font-bold mb-4 text-white">{latestEpisode.title}</h2>
              
              <p className="text-gray-300 mb-8 leading-relaxed">{latestEpisode.description}</p>

              {/* Audio Player */}
              <div className="space-y-5">
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                
                <div 
                  className="relative h-3 bg-slate-700/50 rounded-full overflow-hidden cursor-pointer group"
                  onClick={handleSeek}
                >
                  <div 
                    className="absolute h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  >
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <button
                    onClick={togglePlay}
                    className="flex items-center gap-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8 py-4 rounded-full text-white font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="h-6 w-6" />
                        Pause Episode
                      </>
                    ) : (
                      <>
                        <Play className="h-6 w-6" />
                        Play Episode
                      </>
                    )}
                  </button>
                  
                  <div className="flex items-center gap-3">
                    <Volume2 className="h-5 w-5 text-gray-400" />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-20 accent-purple-600"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="flex items-center gap-6 mt-6 pt-6 border-t border-slate-700/30 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{formatTime(duration)}</span>
                </div>
                <div>•</div>
                <div>{new Date(latestEpisode.publishedDate).toLocaleDateString()}</div>
                <div>•</div>
                <div>{Math.floor(duration / 60)} min listen</div>
              </div>
            </div>

            {/* Hidden Audio Element */}
            <audio
              ref={audioRef}
              src={latestEpisode.audioUrl}
              onEnded={() => setIsPlaying(false)}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
            />
          </div>
        </div>
      </div>
    </section>
  );
}