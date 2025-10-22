// // @/interfaces/News.ts

// @/interfaces/News.ts

import { Author } from "@/types/author";
import { Category } from "./Category";

export interface News {
  _id: string;
  title: string;
  content: string;
  summary?: string;
  author?: string | Author;
  category?: string | Category;
  tags?: string[];
  publishedAt?: string;
  isPublished: boolean;
  thumbnail?: string;
  featuredImage?: string;
  videoUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  readingTime?: number;
  viewsCount: number;
  isFeatured: boolean;
  isBreaking: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type NewsInput = Omit<
  News,
  "_id" | "viewsCount" | "createdAt" | "updatedAt"
>;






export interface NewsByCategoryResponse {
  category: string;
  news: News[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}