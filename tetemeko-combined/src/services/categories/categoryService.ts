import { apiRequest } from "@/lib/api";
import { toast } from "sonner";
import { Category, CategoryInput } from "@/interfaces/Category";
import { News } from "@/interfaces/News";

/* ---------------------- Toast Wrapper ---------------------- */
const withToast = async <T>(
  fn: () => Promise<T>,
  successMsg: string,
  errorMsg: string
): Promise<T | null> => {
  try {
    const result = await fn();
    toast.success(successMsg);
    return result;
  } catch (e: any) {
    toast.error(e?.message || errorMsg);
    return null;
  }
};

/* ---------------------- Category Services ---------------------- */

// ✅ Get all categories
export const getCategories = async (
  type?: string,
  limit: number = 1000 // big number to fetch all
): Promise<Category[]> => {
  try {
    const params = new URLSearchParams();
    if (type) params.append("type", type);
    params.append("limit", limit.toString());

    const res = await apiRequest<{ categories: Category[]; pagination: any }>(
      `/categories?${params.toString()}`
    );

    return res.categories ?? [];
  } catch (e: any) {
    console.error("getCategories error:", e.message);
    return [];
  }
};



// ✅ Get category by slug
export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
  try {
    return await apiRequest<Category>(`/categories/${slug}`);
  } catch (e: any) {
    toast.error(e?.message || "Failed to fetch category.");
    return null;
  }
};

export const getCategoryById = async (id: string): Promise<Category | null> => {
  try {
    return await apiRequest<Category>(`/categories/${id}`);
  } catch (e: any) {
    toast.error(e?.message || "Failed to fetch category.");
    return null;
  }
};

// ✅ Create category
export const createCategory = async (
  data: CategoryInput
): Promise<Category | null> =>
  withToast(
    () => apiRequest<Category>("/categories", "POST", data),
    "Category created successfully.",
    "Failed to create category."
  );

// ✅ Update category
export const updateCategory = async (
  id: string,
  data: Partial<Omit<Category, "id">>
): Promise<Category | null> => {
  // Remove empty string fields before sending
  const filteredData = Object.fromEntries(
    Object.entries(data).filter(([_, v]) => v !== "")
  );

  return withToast(
    () => apiRequest<Category>(`/categories/${id}`, "PUT", filteredData),
    "Category updated successfully.",
    "Failed to update category."
  );
};

export const getAllCategoriesServer = async (
  type?: string,
  limit: number = 1000
): Promise<Category[]> => {
  try {
    const params = new URLSearchParams();
    if (type) params.append("type", type);
    params.append("limit", limit.toString());

    const res = await apiRequest<{ categories: Category[]; pagination: any }>(
      `/categories?${params.toString()}`,
      "GET"
    );

    return res.categories ?? [];
  } catch (error: any) {
    console.error("❌ Server failed to fetch categories:", error.message);
    return [];
  }
};

// ✅ Delete category
export const deleteCategory = async (id: string): Promise<boolean> => {
  try {
    const result = await withToast(
      async () => {
        await apiRequest(`/categories/${id}`, "DELETE");
        return true;
      },
      "Category deleted successfully.",
      "Failed to delete category."
    );
    return result ?? false;
  } catch (err) {
    console.error("❌ Delete failed", err);
    return false;
  }
};


