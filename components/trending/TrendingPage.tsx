import { BlogCard } from '@/components/blog/BlogCard';
import { BlogPost } from '@/types/blog';
import { Breadcrumb } from '@/components/blog/Breadcrumb';
import { TrendingUp, FileText } from 'lucide-react';

interface TrendingPageProps {
  posts: BlogPost[];
}

export function TrendingPage({ posts }: TrendingPageProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      <Breadcrumb items={[{ label: 'Trending' }]} />

      <div className="mt-8 mb-12">
        <div className="flex items-center gap-4">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/20"
            aria-hidden="true"
          >
            <TrendingUp className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Trending Now</h1>
            <p className="text-muted-foreground">Most popular articles this week</p>
          </div>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" aria-hidden="true" />
          <p className="text-lg font-medium text-foreground">No trending articles yet</p>
          <p className="text-muted-foreground mt-1">Check back soon for trending content</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <BlogCard key={post.id} post={post} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
