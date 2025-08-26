// interfaces/Product.ts

export interface Product {
  id: string;
  slug?: string;
  name: string;
  shortDescription?: string;
  description: string;
  image: string;
  media?: string[];              // array of image URLs
  price: number;
  discount?: number;             // discount amount or percentage
  category: string;
  brand: string;
  sku?: string;
  rating: number;
  numReviews: number;
  countInStock: number;
  weight?: string;               // e.g. "1.5kg"
  dimensions?: string;           // e.g. "30x15x10cm"
  tags?: string[];
  isDigital?: boolean;
  isFeatured?: boolean;
  status?: "active" | "inactive" | "archived";
  seller?: string;
  createdAt: string;             // ISO date string
  updatedAt?: string;            // ISO date string
}
