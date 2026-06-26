'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getLocalPostById, isLocalPost } from '@/lib/localPosts';
import { PostEditor } from '@/components/blog/PostEditor';
import { AuthModal } from '@/components/auth/AuthModal';
import { AnimatePresence } from 'framer-motion';
import { LoadingSkeleton } from '@/components/blog/LoadingSkeleton';
import { notFound } from 'next/navigation';
import type { BlogPost } from '@/types/blog';
import { PenLine } from 'lucide-react';

interface EditPageProps {
  params: { id: string };
}

export default function EditPostPage({ params }: EditPageProps) {
  const { user, loading } = useAuth();
  const [post, setPost] = useState<BlogPost | null | undefined>(undefined);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    if (!isLocalPost(params.id)) { setPost(null); return; }
    const found = getLocalPostById(params.id);
    setPost(found ?? null);
  }, [params.id]);

  if (loading || post === undefined) {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-24">
        <LoadingSkeleton variant="detail" />
      </div>
    );
  }

  if (!post) notFound();

  if (!user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
          <PenLine className="h-8 w-8 text-white" aria-hidden="true" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Sign in to edit</h1>
          <p className="mt-2 text-muted-foreground">You must be signed in to edit posts.</p>
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

  return <PostEditor post={post} />;
}
