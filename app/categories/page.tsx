import type { Metadata } from 'next';
import { getCategoriesWithCounts } from '@/services/blogService';
import { CategoryList } from '@/components/categories/CategoryList';

export const metadata: Metadata = {
  title: 'Categories',
  description: 'Browse all article categories on Blogify',
};

export default async function CategoriesPage() {
  const categories = await getCategoriesWithCounts();
  return <CategoryList categories={categories} />;
}
