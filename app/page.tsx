import { getFeaturedPosts, getLatestPosts, getTrendingPosts } from '@/services/blogService';
import { Hero } from '@/components/sections/Hero';
import { TrendingSection } from '@/components/sections/TrendingSection';
import { LatestArticles } from '@/components/sections/LatestArticles';
import { PopularCategories } from '@/components/sections/PopularCategories';
import { PopularTags } from '@/components/sections/PopularTags';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blogify - Discover Stories That Matter',
  description: 'A premium blogging platform featuring curated articles on technology, design, business, and lifestyle.',
  alternates: {
    canonical: '/',
  },
};

export default async function HomePage() {
  const featuredPosts = await getFeaturedPosts();
  const featuredPost = featuredPosts[0] || (await getLatestPosts(1))[0];

  return (
    <div>
      <Hero featuredPost={featuredPost} />
      <TrendingSection />
      <LatestArticles />
      <PopularCategories />
      <PopularTags />
    </div>
  );
}
