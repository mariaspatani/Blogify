'use client';

/**
 * Renders a blog post that lives in localStorage (id starts with "local-").
 * Falls back to notFound UI when the post doesn't exist.
 */
import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { getLocalPostById, deleteLocalPost, isLocalPost } from '@/lib/localPosts';
import { BlogDetail } from '@/components/blog/BlogDetail';
import { CommentSection } from '@/components/blog/CommentSection';
import { Breadcrumb } from '@/components/blog/Breadcrumb';
import { LoadingSkeleton } from '@/components/blog/LoadingSkeleton';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import type { BlogPost } from '@/types/blog';
import { Pencil, Trash2 } from 'lucide-react';

interface LocalBlogPageProps {
  id: string;
}

export function LocalBlogPage({ id }: LocalBlogPageProps) {
  const [post, setPost] = useState<BlogPost | null | undefined>(undefined); // undefined = loading
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLocalPost(id)) { setPost(null); return; }
    const found = getLocalPostById(id);
    setPost(found ?? null);
  }, [id]);

  const handleDelete = () => {
    if (!confirm('Delete this post? This cannot be undone.')) return;
    deleteLocalPost(id);
    router.push('/');
  };

  if (post === undefined) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <LoadingSkeleton variant="detail" />
      </div>
    );
  }

  if (!post) {
    // Trigger the Next.js not-found boundary
    notFound();
  }

  // Check if current user is the author (by display name or email match)
  const isOwner =
    user &&
    (user.displayName === post.author || user.email === post.author);

  return (
    <article>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        <div className="flex items-center justify-between">
          <Breadcrumb
            items={[
              {
                label: post.category,
                href: `/categories/${encodeURIComponent(post.category.toLowerCase())}`,
              },
              { label: post.title },
            ]}
          />
          {isOwner && (
            <div className="flex items-center gap-2">
              <a
                href={`/blog/${post.id}/edit`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary/50 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent/50 transition-colors"
              >
                <Pencil className="h-3 w-3" aria-hidden="true" />
                Edit
              </a>
              <button
                onClick={handleDelete}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-500/20 transition-colors"
              >
                <Trash2 className="h-3 w-3" aria-hidden="true" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      <BlogDetail post={post} />
      <CommentSection postId={post.id} />
    </article>
  );
}
