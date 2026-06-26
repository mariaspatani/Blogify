'use client';

import { motion } from 'framer-motion';
import { BlogPost } from '@/types/blog';
import { ImageWithFallback } from '@/components/ui-custom/ImageWithFallback';
import { formatDate } from '@/utils/date';
import {
  Clock,
  Eye,
  Heart,
  Twitter,
  Facebook,
  Linkedin,
  Link as LinkIcon,
  Bookmark,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { isLiked, toggleLike, isBookmarked, toggleBookmark } from '@/lib/firestore';
import { cn } from '@/lib/utils';

interface BlogDetailProps {
  post: BlogPost;
}

function generateTOC(content: string) {
  const h2Matches = content.match(/<h2>(.*?)<\/h2>/g);
  if (!h2Matches) return [];
  return h2Matches.map((match) => {
    const title = match.replace(/<h2>(.*?)<\/h2>/, '$1');
    const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return { title, id };
  });
}

export function BlogDetail({ post }: BlogDetailProps) {
  const [copied, setCopied] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [bookmarked, setBookmarked] = useState(false);
  const [actionError, setActionError] = useState('');
  const toc = generateTOC(post.content);
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    isLiked(user.uid, post.id).then(setLiked);
    isBookmarked(user.uid, post.id).then(setBookmarked);
  }, [user, post.id]);

  const handleLike = async () => {
    if (!user) { setShowAuth(true); return; }
    setActionError('');
    const result = await toggleLike(user.uid, post.id);
    if (result.error) {
      setActionError(result.error);
      setTimeout(() => setActionError(''), 4000);
      return;
    }
    const nowLiked = result.data!;
    setLiked(nowLiked);
    setLikeCount((c) => c + (nowLiked ? 1 : -1));
  };

  const handleBookmark = async () => {
    if (!user) { setShowAuth(true); return; }
    setActionError('');
    const result = await toggleBookmark(user.uid, post.id);
    if (result.error) {
      setActionError(result.error);
      setTimeout(() => setActionError(''), 4000);
      return;
    }
    setBookmarked(result.data!);
  };

  const handleShare = (platform: string) => {
    const url = encodeURIComponent(shareUrl);
    const text = encodeURIComponent(post.title);
    const shareLinks: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    };
    if (shareLinks[platform]) {
      window.open(shareLinks[platform], '_blank', 'width=600,height=400');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-[1fr_280px] gap-12">
        {/* Main Content */}
        <div>
          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative aspect-[16/7] rounded-2xl overflow-hidden shadow-2xl shadow-black/10"
          >
            <ImageWithFallback
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) calc(100vw - 400px), 100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4">
              <span className="inline-flex items-center rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1 text-sm font-medium text-foreground">
                {post.category}
              </span>
            </div>
          </motion.div>

          {/* Title & Meta */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-8"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-tight">
              {post.title}
            </h1>

            {/* Action error */}
            {actionError && (
              <p className="mt-3 text-sm text-red-500 bg-red-500/10 rounded-lg px-3 py-2" role="alert">
                {actionError}
              </p>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 rounded-full overflow-hidden ring-2 ring-border">
                  <ImageWithFallback
                    src={post.authorAvatar}
                    alt={post.author}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{post.author}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(post.publishDate)}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" aria-hidden="true" />
                  {post.readingTime} min read
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" aria-hidden="true" />
                  {post.views.toLocaleString()} views
                </span>
                <button
                  onClick={handleLike}
                  aria-label={liked ? 'Unlike this post' : 'Like this post'}
                  className={cn(
                    'flex items-center gap-1 transition-colors',
                    liked ? 'text-red-500' : 'hover:text-red-500'
                  )}
                >
                  <Heart className={cn('h-4 w-4', liked && 'fill-red-500')} aria-hidden="true" />
                  {likeCount.toLocaleString()}
                </button>
                <button
                  onClick={handleBookmark}
                  aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark this post'}
                  className={cn(
                    'flex items-center gap-1 transition-colors',
                    bookmarked ? 'text-indigo-500' : 'hover:text-indigo-500'
                  )}
                >
                  <Bookmark className={cn('h-4 w-4', bookmarked && 'fill-indigo-500')} aria-hidden="true" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-indigo-600 prose-a:dark:text-indigo-400 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-lg prose-blockquote:border-l-indigo-500 prose-blockquote:bg-muted/50 prose-blockquote:rounded-r-lg prose-blockquote:py-2"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          <div className="mt-8 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <a
                key={tag}
                href={`/search?q=${encodeURIComponent(tag)}`}
                className="inline-flex items-center rounded-lg border border-border bg-secondary px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-indigo-500 hover:text-white hover:border-indigo-500 transition-all"
              >
                #{tag}
              </a>
            ))}
          </div>

          {/* Share */}
          <div className="mt-8 flex items-center gap-3">
            <span className="text-sm font-medium text-foreground">Share:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleShare('twitter')}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary hover:bg-[#1DA1F2] hover:text-white transition-all"
                aria-label="Share on Twitter"
              >
                <Twitter className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                onClick={() => handleShare('facebook')}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary hover:bg-[#4267B2] hover:text-white transition-all"
                aria-label="Share on Facebook"
              >
                <Facebook className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                onClick={() => handleShare('linkedin')}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary hover:bg-[#0077B5] hover:text-white transition-all"
                aria-label="Share on LinkedIn"
              >
                <Linkedin className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                onClick={handleCopyLink}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary hover:bg-indigo-500 hover:text-white transition-all"
                aria-label="Copy link"
              >
                <LinkIcon className="h-4 w-4" aria-hidden="true" />
              </button>
              {copied && (
                <span className="text-sm text-emerald-600" role="status">Copied!</span>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - TOC */}
        {toc.length > 0 && (
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="hidden lg:block"
          >
            <div className="sticky top-24">
              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="text-sm font-semibold text-foreground mb-4">Table of Contents</h3>
                <nav className="space-y-2">
                  {toc.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="block text-sm text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      {item.title}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </motion.aside>
        )}
      </div>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      </AnimatePresence>
    </div>
  );
}
