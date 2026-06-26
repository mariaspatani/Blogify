'use client';

import { useQuery } from '@tanstack/react-query';
import { getTrendingPosts } from '@/services/blogService';
import { BlogCard } from '@/components/blog/BlogCard';
import { LoadingSkeleton } from '@/components/blog/LoadingSkeleton';
import { BlogPost } from '@/types/blog';
import { TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function TrendingSection() {
  const { data: trendingPosts, isLoading } = useQuery({
    queryKey: ['trending-posts'],
    queryFn: getTrendingPosts,
  });

  return (
    <section className="py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/20">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground tracking-tight">Trending Now</h2>
              <p className="text-sm text-muted-foreground">Most popular stories this week</p>
            </div>
          </div>
          <Link
            href="/trending"
            className="hidden sm:flex items-center gap-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <LoadingSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingPosts?.map((post: BlogPost, index: number) => (
              <BlogCard key={post.id} post={post} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
