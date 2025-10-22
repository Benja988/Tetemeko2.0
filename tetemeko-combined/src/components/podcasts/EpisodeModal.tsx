"use client";

import { useState, useEffect } from "react";
import { X, Play, Pause, Clock, Calendar } from "lucide-react";
import { Episode } from "@/interfaces/podcasts";
import { episodeService } from "@/services/episodes/episodeServices";

interface EpisodeModalProps {
  podcastId: string;
  podcastTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function EpisodeModal({ podcastId, podcastTitle, isOpen, onClose }: EpisodeModalProps) {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPlaying, setCurrentPlaying] = useState<string | null>(null);
  const [audioElements, setAudioElements] = useState<Record<string, HTMLAudioElement>>({});

  useEffect(() => {
    if (isOpen && podcastId) {
      const fetchEpisodes = async () => {
        try {
          setIsLoading(true);
          const res = await episodeService.getAll(podcastId, { page: 1, limit: 50 });
          setEpisodes(res.episodes);
        } catch (err) {
          console.error("Failed to load episodes", err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchEpisodes();
    }
  }, [isOpen, podcastId]);

  const togglePlay = (episodeId: string, audioUrl: string) => {
    // If another episode is playing, pause it first
    if (currentPlaying && currentPlaying !== episodeId) {
      const prevAudio = audioElements[currentPlaying];
      if (prevAudio) {
        prevAudio.pause();
      }
    }

    // Get or create audio element for this episode
    let audio = audioElements[episodeId];
    if (!audio) {
      audio = new Audio(audioUrl);
      setAudioElements(prev => ({ ...prev, [episodeId]: audio }));
      
      audio.onended = () => {
        setCurrentPlaying(null);
      };
    }

    if (currentPlaying === episodeId) {
      // Pause if this episode is already playing
      audio.pause();
      setCurrentPlaying(null);
    } else {
      // Play this episode
      audio.play();
      setCurrentPlaying(episodeId);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-black bg-opacity-70"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-slate-800 shadow-xl rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700">
            <div>
              <h2 className="text-2xl font-bold text-white">All Episodes</h2>
              <p className="text-purple-400">{podcastTitle}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 rounded-full hover:bg-slate-700 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            {isLoading ? (
              // Loading state
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="p-4 rounded-lg bg-slate-700/50 animate-pulse">
                    <div className="h-5 bg-slate-600 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-slate-600 rounded w-1/2 mb-4"></div>
                    <div className="h-3 bg-slate-600 rounded w-full mb-2"></div>
                    <div className="h-3 bg-slate-600 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : episodes.length === 0 ? (
              // Empty state
              <div className="text-center py-10">
                <div className="mx-auto w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No episodes yet</h3>
                <p className="text-gray-400">This podcast doesn't have any published episodes.</p>
              </div>
            ) : (
              // Episodes list
              <div className="space-y-4">
                {episodes.map((episode) => (
                  <div 
                    key={episode._id} 
                    className={`p-4 rounded-lg border transition-colors ${
                      currentPlaying === episode._id 
                        ? 'bg-purple-900/20 border-purple-500/30' 
                        : 'bg-slate-700/50 border-slate-600/50 hover:bg-slate-700/70'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <button
                        onClick={() => togglePlay(episode._id, episode.audioUrl)}
                        className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                          currentPlaying === episode._id 
                            ? 'bg-purple-600 hover:bg-purple-700' 
                            : 'bg-slate-600 hover:bg-slate-500'
                        } transition-colors`}
                      >
                        {currentPlaying === episode._id ? (
                          <Pause className="w-5 h-5" />
                        ) : (
                          <Play className="w-5 h-5 ml-1" />
                        )}
                      </button>
                      
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {episode.title}
                        </h3>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(episode.publishedDate)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatTime(episode.duration || 0)}
                          </span>
                        </div>
                        
                        <p className="text-gray-300 text-sm">
                          {episode.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}