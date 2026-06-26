'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getLocalPosts, deleteLocalPost } from '@/lib/localPosts';
import { AuthModal } from '@/components/auth/AuthModal';
import { AnimatePresence, motion } from 'framer-motion';
import { ImageWithFallback } from '@/components/ui-custom/ImageWithFallback';
import { formatDate } from '@/utils/date';
import type { BlogPost } from '@/types/blog';
import { PenLine, SquarePen, Trash2, Plus, FileText } from 'lucide-react';
import Link from 'next/link';

export default function MyPostsPage() {
  const { user, loading } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    if (user) setPosts(getLocalPosts());
  }, [user]);

  const handleDelete = (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    deleteLocalPost(id);
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
          <PenLine className="h-8 w-8 text-white" aria-hidden="true" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Sign in to see your posts</h1>
          <p className="mt-2 text-muted-foreground">Your published posts will appear here.</p>
        </div>
        <button
          onClick={() => setShowAuth(true)}
          className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-medium text-white shadow-lg hover:shadow-xl transition-all"
        >
          Sign In
        </button>
        <AnimatePresence>
          {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">My Posts</h1>
          <p className="text-muted-foreground mt-1">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'} saved locally
          </p>
        </div>
        <Link
          href="/write"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-500/20 hover:shadow-xl transition-all"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          New Post
        </Link>
      </div>

      {/* Empty state */}
      {posts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary mb-4">
            <FileText className="h-7 w-7 text-muted-foreground" aria-hidden="true" />
          </div>
          <p className="text-lg font-medium text-foreground">No posts yet</p>
          <p className="text-sm text-muted-foreground mt-1 mb-6">
            Write your first post and it will appear here.
          </p>
          <Link
            href="/write"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg hover:shadow-xl transition-all"
          >
            <SquarePen className="h-4 w-4" aria-hidden="true" />
            Write a Post
          </Link>
        </div>
      )}

      {/* Post list */}
      <div className="space-y-4">
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.04 }}
            className="group flex gap-4 rounded-2xl border border-border bg-card p-4 hover:shadow-md transition-all"
          >
            {/* Thumbnail */}
            <div className="relative h-20 w-28 shrink-0 rounded-xl overflow-hidden">
              <ImageWithFallback
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                sizes="112px"
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <Link href={`/blog/${post.id}`} className="group/title">
                <h2 className="text-sm font-semibold text-foreground line-clamp-2 group-hover/title:text-indigo-600 dark:group-hover/title:text-indigo-400 transition-colors">
                  {post.title}
                </h2>
              </Link>
              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                <span className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-xs">
                  {post.category}
                </span>
                <span>{formatDate(post.publishDate)}</span>
                <span>{post.readingTime} min read</span>
              </div>
              {post.description && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                  {post.description}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <Link
                href={`/blog/${post.id}/edit`}
                className="flex items-center justify-center h-8 w-8 rounded-lg border border-border hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={`Edit ${post.title}`}
              >
                <SquarePen className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
              <button
                onClick={() => handleDelete(post.id, post.title)}
                className="flex items-center justify-center h-8 w-8 rounded-lg border border-red-500/20 bg-red-500/5 hover:bg-red-500/15 text-red-500 transition-colors"
                aria-label={`Delete ${post.title}`}
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
