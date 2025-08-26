// src/services/podcastService.ts

import { apiRequest } from '@/lib/api';
import {
  Podcast,
  Episode,
  PaginatedPodcastsResponse,
  PaginatedEpisodesResponse,
} from '@/interfaces/podcasts';
import { buildQueryParams } from '@/lib/api';

const BASE_URL = '/podcasts';

export const podcastService = {
  // ✅ Get all podcasts (with filters, pagination, sorting)
  async getAll(params?: {
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<PaginatedPodcastsResponse> {
    const query = buildQueryParams(params);
    return apiRequest(`${BASE_URL}${query}`, 'GET');
  },

  // ✅ Get single podcast (with episodes if backend populates)
  async getById(id: string): Promise<{ podcast: Podcast }> {
    return apiRequest(`${BASE_URL}/${id}`, 'GET');
  },

  // ✅ Create podcast
  async create(data: FormData): Promise<{ message: string; podcast: Podcast }> {
    return apiRequest(`${BASE_URL}`, 'POST', data);
  },

  // ✅ Update podcast
  async update(
    id: string,
    data: FormData
  ): Promise<{ message: string; podcast: Podcast }> {
    return apiRequest(`${BASE_URL}/${id}`, 'PUT', data);
  },

  // ✅ Delete podcast
  async delete(id: string): Promise<{ message: string }> {
    return apiRequest(`${BASE_URL}/${id}`, 'DELETE');
  },

  // ✅ Toggle active/inactive podcast
  async toggleStatus(
    id: string
  ): Promise<{ message: string; podcast: Podcast }> {
    return apiRequest(`${BASE_URL}/${id}/toggle-status`, 'PATCH');
  },
};