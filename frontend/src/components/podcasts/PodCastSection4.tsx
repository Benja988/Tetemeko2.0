"use client";

import { podcastService } from "@/services/podcasts/podcastsService";
import { useEffect, useState } from "react";
import { 
  ListMusic, 
  Headphones, 
  TrendingUp, 
  ArrowRight, 
  Play,
  Mic2,
  BookOpen,
  Music,
  Newspaper,
  Heart,
  Star,
  Zap,
  Globe
} from "lucide-react";

// Category icons mapping for better visual representation
const categoryIcons = {
  music: Music,
  entertainment: Headphones,
  business: TrendingUp,
  technology: Zap,
  education: BookOpen,
  news: Newspaper,
  health: Heart,
  comedy: Star,
  sports: Globe,
  default: ListMusic
};

const getCategoryIcon = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  if (name.includes('music')) return categoryIcons.music;
  if (name.includes('business') || name.includes('tech')) return categoryIcons.business;
  if (name.includes('education') || name.includes('learn')) return categoryIcons.education;
  if (name.includes('news') || name.includes('current')) return categoryIcons.news;
  if (name.includes('health') || name.includes('wellness')) return categoryIcons.health;
  if (name.includes('comedy') || name.includes('funny')) return categoryIcons.comedy;
  if (name.includes('sports') || name.includes('fitness')) return categoryIcons.sports;
  if (name.includes('entertainment')) return categoryIcons.entertainment;
  return categoryIcons.default;
};

// Color gradients for different categories
const categoryColors = [
  'from-purple-600 to-pink-600',
  'from-blue-600 to-cyan-600',
  'from-green-600 to-emerald-600',
  'from-orange-600 to-amber-600',
  'from-red-600 to-rose-600',
  'from-indigo-600 to-blue-600',
  'from-teal-600 to-green-600',
  'from-yellow-600 to-orange-600',
  'from-pink-600 to-rose-600',
  'from-cyan-600 to-blue-600'
];

interface CategoryWithStats {
  id: string;
  name: string;
  podcastCount: number;
  totalEpisodes: number;
  totalDuration: number;
  icon: any;
  color: string;
}

export default function PodCastSection4() {
  const [categories, setCategories] = useState<CategoryWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewAll, setViewAll] = useState(false);

  useEffect(() => {
    const fetchCategoriesWithStats = async () => {
      try {
        const res = await podcastService.getAll({ page: 1, limit: 50 });
        
        // Group podcasts by category and calculate statistics
        const categoryMap = new Map();
        
        res.podcasts.forEach(podcast => {
          if (podcast.category) {
            const categoryId = podcast.category._id;
            if (!categoryMap.has(categoryId)) {
              categoryMap.set(categoryId, {
                ...podcast.category,
                podcastCount: 0,
                totalEpisodes: 0,
                totalDuration: 0
              });
            }
            
            const category = categoryMap.get(categoryId);
            category.podcastCount += 1;
            // You could add more stats here if available
          }
        });

        // Convert to array and add icons/colors
        const categoriesWithStats = Array.from(categoryMap.values())
          .map((category, index) => ({
            id: category._id,
            name: category.name,
            podcastCount: category.podcastCount,
            totalEpisodes: Math.floor(category.podcastCount * 12), // Mock data
            totalDuration: Math.floor(category.podcastCount * 360), // Mock data in minutes
            icon: getCategoryIcon(category.name),
            color: categoryColors[index % categoryColors.length]
          }))
          .sort((a, b) => b.podcastCount - a.podcastCount); // Sort by podcast count

        setCategories(categoriesWithStats);
      } catch (err) {
        console.error("Failed to load categories", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategoriesWithStats();
  }, []);

  const displayedCategories = viewAll ? categories : categories.slice(0, 8);

  const formatNumber = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  const formatDuration = (minutes: number) => {
    if (minutes >= 60) return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
    return `${minutes}m`;
  };

  if (isLoading) {
    return (
      <section className="py-16 lg:py-20 px-4 sm:px-6 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 lg:mb-14">
            <div className="h-8 bg-slate-800/50 rounded-lg max-w-md mx-auto mb-4 animate-pulse"></div>
            <div className="h-5 bg-slate-800/50 rounded max-w-sm mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-slate-800/30 rounded-xl p-5 border border-slate-700/30 animate-pulse">
                <div className="w-12 h-12 bg-slate-700/50 rounded-xl mx-auto mb-3"></div>
                <div className="h-5 bg-slate-700/50 rounded mb-2"></div>
                <div className="h-3 bg-slate-700/50 rounded w-3/4 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-20 px-4 sm:px-6 bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 lg:mb-14">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-300 text-xs mb-4 backdrop-blur-sm border border-purple-500/20">
            <TrendingUp className="h-3 w-3 mr-1" />
            Explore Content
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-white">
            Browse by Categories
          </h2>
          <p className="text-sm text-gray-400 max-w-md mx-auto">
            Discover podcasts organized by topics you love and find your next favorite show
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
          {displayedCategories.map((category) => {
            const IconComponent = category.icon;
            const isSelected = selectedCategory === category.id;
            
            return (
              <div
                key={category.id}
                className={`group relative bg-slate-800/30 backdrop-blur-sm rounded-xl p-4 transition-all duration-300 border cursor-pointer ${
                  isSelected
                    ? `border-purple-500/50 bg-gradient-to-b ${category.color}/20`
                    : 'border-slate-700/30 hover:border-purple-400/30'
                } hover:scale-102`}
                onClick={() => setSelectedCategory(isSelected ? null : category.id)}
              >
                {/* Icon with gradient background */}
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="h-5 w-5 text-white" />
                </div>
                
                {/* Category Name */}
                <h3 className="text-sm font-semibold text-white text-center mb-2 line-clamp-1">
                  {category.name}
                </h3>
                
                {/* Podcast Count */}
                <p className="text-xs text-gray-400 text-center mb-3">
                  {formatNumber(category.podcastCount)} shows
                </p>
                
                {/* Stats on hover/select */}
                <div className={`overflow-hidden transition-all duration-300 ${
                  isSelected ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="space-y-1 text-xs text-gray-400">
                    <div className="flex items-center justify-between">
                      <span>Episodes</span>
                      <span className="text-white">{formatNumber(category.totalEpisodes)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Duration</span>
                      <span className="text-white">{formatDuration(category.totalDuration)}</span>
                    </div>
                  </div>
                </div>
                
                {/* Play button overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
                  <button className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform">
                    <Play className="h-3 w-3 text-slate-900 ml-0.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All / Show Less Toggle */}
        {categories.length > 8 && (
          <div className="text-center">
            <button
              onClick={() => setViewAll(!viewAll)}
              className="inline-flex items-center px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 text-gray-400 hover:text-white rounded-lg border border-slate-700/30 hover:border-purple-400/30 transition-all duration-200 text-sm"
            >
              {viewAll ? 'Show Less' : `View All Categories (${categories.length})`}
              <ArrowRight className={`h-4 w-4 ml-2 transition-transform duration-200 ${viewAll ? 'rotate-180' : ''}`} />
            </button>
          </div>
        )}

        {/* Selected Category Spotlight (optional) */}
        {selectedCategory && (
          <div className="mt-8 p-4 bg-slate-800/30 rounded-xl border border-purple-500/20">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-2">
                Explore {categories.find(c => c.id === selectedCategory)?.name}
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                Discover the best podcasts in this category
              </p>
              <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg text-sm transition-all duration-200">
                Browse Category
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}