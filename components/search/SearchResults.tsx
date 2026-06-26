'use client';

import { useQuery } from '@tanstack/react-query';
import { searchPosts } from '@/services/blogService';
import { BlogCard } from '@/components/blog/BlogCard';
import { LoadingSkeleton } from '@/components/blog/LoadingSkeleton';
import { BlogPost } from '@/types/blog';
import { Search, FileText } from 'lucide-react';

interface SearchResultsProps {
  query: string;
}

export function SearchResults({ query }: SearchResultsProps) {
  const { data: typedResults, isLoading } = useQuery({
    queryKey: ['search-page', query],
    queryFn: () => searchPosts(query),
    enabled: query.length > 0,
  });

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          {query ? (
            <>
              Search Results for{' '}
              <span className="gradient-text">&ldquo;{query}&rdquo;</span>
            </>
          ) : (
            'Search Articles'
          )}
        </h1>
        {typedResults && (
          <p className="mt-2 text-muted-foreground">
            {typedResults.length} {typedResults.length === 1 ? 'result' : 'results'} found
          </p>
        )}
      </div>

      {isLoading && <LoadingSkeleton variant="list" />}

      {query.length === 0 && (
        <div className="text-center py-16">
          <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <p className="text-muted-foreground">Enter a search term to find articles</p>
        </div>
      )}

      {typedResults && typedResults.length === 0 && query.length > 0 && (
        <div className="text-center py-16">
          <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <p className="text-lg font-medium text-foreground">No results found</p>
          <p className="text-muted-foreground mt-1">
            Try adjusting your search terms or browse categories
          </p>
        </div>
      )}

      {typedResults && typedResults.length > 0 && (
        <div className="space-y-6">
          {typedResults.map((post: BlogPost, index: number) => (
            <BlogCard key={post.id} post={post} index={index} variant="compact" />
          ))}
        </div>
      )}
    </div>
  );
}
