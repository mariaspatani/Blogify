import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPostsByCategory, getCategoriesWithCounts } from '@/services/blogService';
import { CategoryPage } from '@/components/categories/CategoryPage';
import { CATEGORIES } from '@/types/blog';

interface CategoryPageProps {
  params: { category: string };
}

export function generateMetadata({ params }: CategoryPageProps): Metadata {
  const categoryName = decodeURIComponent(params.category);
  const formatted = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
  return {
    title: `${formatted} Articles`,
    description: `Browse all ${formatted} articles on Blogify`,
  };
}

export default async function CategoryRoute({ params }: CategoryPageProps) {
  const categoryName = decodeURIComponent(params.category);
  const normalizedCategory = CATEGORIES.find(
    c => c.toLowerCase() === categoryName.toLowerCase()
  );

  if (!normalizedCategory) {
    notFound();
  }

  const posts = await getPostsByCategory(normalizedCategory);

  return <CategoryPage category={normalizedCategory} posts={posts} />;
}
