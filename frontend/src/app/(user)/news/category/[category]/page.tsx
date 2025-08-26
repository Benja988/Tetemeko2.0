import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CategoryNewsClient from '@/components/news/CategoryNewsClient';
import { getAllCategoriesServer } from '@/services/categories/categoryService';
import { Suspense } from 'react';
import CategoryNewsLoading from '@/components/news/CategoryNewsLoading';

type CategoryPageProps = {
  params: { category: string };
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = params;

  return (
    <>
      <Navbar />
      <Suspense fallback={<CategoryNewsLoading />}>
        <CategoryNewsClient category={category} />
      </Suspense>
      <Footer />
    </>
  );
}


// ✅ Needed for static export
export async function generateStaticParams() {
  try {
    const categories = await getAllCategoriesServer();

    if (!categories) return [];

    return categories.map((cat: any) => ({
      category: cat.slug.toLowerCase(),
    }));
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
}
