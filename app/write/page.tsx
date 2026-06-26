'use client';

import { useAuth } from '@/context/AuthContext';
import { PostEditor } from '@/components/blog/PostEditor';
import { AuthModal } from '@/components/auth/AuthModal';
import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { PenLine } from 'lucide-react';

export default function WritePage() {
  const { user, loading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

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
          <h1 className="text-2xl font-bold text-foreground">Sign in to write</h1>
          <p className="mt-2 text-muted-foreground">
            You need to be signed in to create a blog post.
          </p>
        </div>
        <button
          onClick={() => setShowAuth(true)}
          className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-indigo-500/20 hover:shadow-xl transition-all"
        >
          Sign In
        </button>
        <AnimatePresence>
          {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
        </AnimatePresence>
      </div>
    );
  }

  return <PostEditor />;
}
