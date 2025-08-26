export type CategoryType = "news" | "marketplace" | "podcast";

export interface Category {
  _id: string;
  name: string;
  slug: string;
  categoryType: CategoryType;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CategoryFormInput {
  name: string;
  categoryType: CategoryType;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
}


export type CategoryInput = Omit<Category, "_id" | "slug" | "createdAt" | "updatedAt">;
