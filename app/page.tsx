import { getFeaturedPosts, getLatestPosts } from '@/services/blogService';
import { Hero } from '@/components/sections/Hero';
import { TrendingSection } from '@/components/sections/TrendingSection';
import { LatestArticles } from '@/components/sections/LatestArticles';
import { PopularCategories } from '@/components/sections/PopularCategories';
import { PopularTags } from '@/components/sections/PopularTags';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blogify - Discover Stories That Matter',
  description:
    'A premium blogging platform featuring curated articles on technology, design, business, and lifestyle.',
  alternates: {
    canonical: '/',
  },
};

export default async function HomePage() {
  // Fetch featured post with fallback chain — never crash the homepage
  let featuredPost = null;
  try {
    const featured = await getFeaturedPosts();
    if (featured.length > 0) {
      featuredPost = featured[0];
    } else {
      const latest = await getLatestPosts(1);
      featuredPost = latest[0] ?? null;
    }
  } catch {
    // MockAPI unreachable — render without a featured post
    featuredPost = null;
  }

  // Don't render Hero if no post is available (API down / empty)
  if (!featuredPost) {
    return (
      <div>
        <TrendingSection />
        <LatestArticles />
        <PopularCategories />
        <PopularTags />
      </div>
    );
  }

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
