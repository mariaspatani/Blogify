'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import {
  getComments,
  addComment,
  deleteComment,
  type FirestoreComment,
} from '@/lib/firestore';
import { ImageWithFallback } from '@/components/ui-custom/ImageWithFallback';
import { formatDate } from '@/utils/date';
import { MessageCircle, Send, Heart, Trash2, LogIn, Loader2 } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

interface CommentSectionProps {
  postId: string;
}

function commentDate(ts: Timestamp | null): string {
  if (!ts) return 'Just now';
  return formatDate(ts.toDate().toISOString().split('T')[0]);
}

export function CommentSection({ postId }: CommentSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<FirestoreComment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  const loadComments = useCallback(async () => {
    setLoadingComments(true);
    try {
      const data = await getComments(postId);
      setComments(data);
    } finally {
      setLoadingComments(false);
    }
  }, [postId]);

  useEffect(() => { loadComments(); }, [loadComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { setShowAuth(true); return; }
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const result = await addComment(
        postId,
        user.uid,
        user.displayName ?? 'Anonymous',
        user.photoURL ?? '',
        newComment.trim()
      );
      if (result.error) {
        // Show error inline but don't crash
        console.error('Comment error:', result.error);
        return;
      }
      setComments((prev) => [result.data!, ...prev]);
      setNewComment('');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    const result = await deleteComment(commentId);
    if (!result.error) {
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    }
  };

  return (
    <>
      <section className="py-16 border-t border-border">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
              <MessageCircle className="h-5 w-5 text-white" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground tracking-tight">Comments</h2>
              <p className="text-sm text-muted-foreground">{comments.length} comments</p>
            </div>
          </div>

          {/* Comment Form */}
          {user ? (
            <form onSubmit={handleSubmit} className="mb-8">
              <div className="flex gap-3">
                <div className="relative h-10 w-10 rounded-full overflow-hidden ring-2 ring-border shrink-0">
                  <ImageWithFallback
                    src={user.photoURL ?? ''}
                    alt={user.displayName ?? 'You'}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts..."
                    rows={3}
                    aria-label="Write a comment"
                    className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 resize-none transition-all"
                  />
                  <div className="mt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={submitting || !newComment.trim()}
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-500/20 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      ) : (
                        <Send className="h-4 w-4" aria-hidden="true" />
                      )}
                      Post Comment
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              className="mb-8 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-secondary/30 py-4 text-sm text-muted-foreground hover:bg-accent/30 hover:text-foreground transition-all"
            >
              <LogIn className="h-4 w-4" aria-hidden="true" />
              Sign in to leave a comment
            </button>
          )}

          {/* Comments List */}
          {loadingComments ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-label="Loading comments" />
            </div>
          ) : (
            <div className="space-y-6">
              {comments.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-8">
                  No comments yet. Be the first!
                </p>
              )}
              {comments.map((comment, index) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                  className="flex gap-3"
                >
                  <div className="relative h-10 w-10 rounded-full overflow-hidden ring-2 ring-border shrink-0">
                    <ImageWithFallback
                      src={comment.avatar}
                      alt={comment.author}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="rounded-xl border border-border bg-card p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">{comment.author}</span>
                          <span className="text-xs text-muted-foreground">{commentDate(comment.createdAt)}</span>
                        </div>
                        {user?.uid === comment.uid && (
                          <button
                            onClick={() => handleDelete(comment.id)}
                            className="text-muted-foreground hover:text-red-500 transition-colors"
                            aria-label="Delete comment"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">{comment.content}</p>
                      <div className="mt-3 flex items-center gap-4">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Heart className="h-3.5 w-3.5" aria-hidden="true" />
                          {comment.likes}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      </AnimatePresence>
    </>
  );
}
