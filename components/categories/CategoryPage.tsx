import { BlogCard } from '@/components/blog/BlogCard';
import { Category, BlogPost, CATEGORY_COLORS } from '@/types/blog';
import { Breadcrumb } from '@/components/blog/Breadcrumb';
import { FolderOpen, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryPageProps {
  category: Category;
  posts: BlogPost[];
}

export function CategoryPage({ category, posts }: CategoryPageProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      <Breadcrumb
        items={[
          { label: 'Categories', href: '/categories' },
          { label: category },
        ]}
      />

      <div className="mt-8 mb-12">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              'flex h-14 w-14 items-center justify-center rounded-2xl border',
              CATEGORY_COLORS[category] ?? 'bg-slate-500/10 text-slate-600 border-slate-500/20'
            )}
            aria-hidden="true"
          >
            <FolderOpen className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">{category}</h1>
            <p className="text-muted-foreground">
              {posts.length} {posts.length === 1 ? 'article' : 'articles'} in this category
            </p>
          </div>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" aria-hidden="true" />
          <p className="text-lg font-medium text-foreground">No articles yet</p>
          <p className="text-muted-foreground mt-1">
            Check back soon for new content in this category
          </p>
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
