// src/interfaces/podcasts.ts

export interface Episode {
  _id: string;
  title: string;
  description: string;
  audioUrl: string;
  duration: number;
  publishedDate: string;
  podcast: string; // podcast ID
  createdBy: {
    _id: string;
    name: string;
  };
  isActive: boolean;
  episodeNumber?: number;
  tags?: string[];
}

export interface Podcast {
  _id: string;
  title: string;
  description: string;
  coverImage?: string;
  category: {
    _id: string;
    name: string;
  };
  station?: {
    _id: string;
    name: string;
  };
  createdBy: {
    _id: string;
    name: string;
  };
  isActive: boolean;
  episodes?: Episode[];
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

// ✅ API Responses
export interface PaginatedPodcastsResponse {
  podcasts: Podcast[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface PaginatedEpisodesResponse {
  episodes: Episode[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
