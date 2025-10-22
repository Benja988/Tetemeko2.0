// src/services/episodeService.ts
import { apiRequest } from '@/lib/api';
import { Episode, PaginatedEpisodesResponse } from '@/interfaces/podcasts';
import { buildQueryParams } from '@/lib/api';

const BASE_URL = '/podcasts';

export const episodeService = {
  // ✅ Get all episodes for a podcast
  async getAll(
    podcastId: string,
    params?: {
      page?: number;
      limit?: number;
      search?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    }
  ): Promise<PaginatedEpisodesResponse> {
    const query = buildQueryParams(params);
    return apiRequest(`${BASE_URL}/${podcastId}/episodes${query}`, 'GET');
  },

  // ✅ Get a single episode by ID
  async getById(
    podcastId: string,
    episodeId: string
  ): Promise<{ episode: Episode }> {
    return apiRequest(`${BASE_URL}/${podcastId}/episodes/${episodeId}`, 'GET');
  },

  // ✅ Create a new episode (admin only)
  async create(
    podcastId: string,
    data: FormData
  ): Promise<{ message: string; episode: Episode }> {
    return apiRequest(`${BASE_URL}/${podcastId}/episodes`, 'POST', data);
  },

  // ✅ Update an episode
  async update(
    podcastId: string,
    episodeId: string,
    data: FormData
  ): Promise<{ message: string; episode: Episode }> {
    return apiRequest(`${BASE_URL}/${podcastId}/episodes/${episodeId}`, 'PUT', data);
  },

  // ✅ Delete an episode
  async delete(
    podcastId: string,
    episodeId: string
  ): Promise<{ message: string }> {
    return apiRequest(`${BASE_URL}/${podcastId}/episodes/${episodeId}`, 'DELETE');
  },

  // ✅ Toggle active/inactive status for an episode
  async toggleStatus(
    podcastId: string,
    episodeId: string
  ): Promise<{ message: string; episode: Episode }> {
    return apiRequest(`${BASE_URL}/${podcastId}/episodes/${episodeId}/toggle-status`, 'PATCH');
  },
};
