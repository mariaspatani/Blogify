import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SearchResults } from '@/components/search/SearchResults';
import { LoadingSkeleton } from '@/components/blog/LoadingSkeleton';

interface SearchPageProps {
  searchParams: { q?: string };
}

export function generateMetadata({ searchParams }: SearchPageProps): Metadata {
  const query = searchParams.q || '';
  return {
    title: query ? `Search Results for "${query}"` : 'Search',
    description: query
      ? `Search results for "${query}" on Blogify`
      : 'Search articles on Blogify',
  };
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      <Suspense fallback={<LoadingSkeleton variant="list" className="max-w-4xl" />}>
        <SearchResults query={searchParams.q || ''} />
      </Suspense>
    </div>
  );
}
