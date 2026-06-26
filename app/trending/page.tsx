import type { Metadata } from 'next';
import { getTrendingPosts } from '@/services/blogService';
import { TrendingPage } from '@/components/trending/TrendingPage';

export const metadata: Metadata = {
  title: 'Trending',
  description: 'Discover the most popular articles on Blogify right now',
};

export default async function TrendingRoute() {
  const posts = await getTrendingPosts();
  return <TrendingPage posts={posts} />;
}
