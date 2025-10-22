import { getCategories } from "@/services/categories/categoryService";
import { Metadata } from 'next';

interface Props {
  params: { slug: string };
}

// ✅ MAKE THIS ASYNC
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  const categories = await getCategories('news');
  const category = categories.find((cat) => cat.slug === slug);

  return {
    title: category ? `${category.name} News` : 'Category Not Found',
  };
}
