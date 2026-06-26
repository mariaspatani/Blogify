'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { saveLocalPost, updateLocalPost } from '@/lib/localPosts';
import { CATEGORIES, type BlogPost } from '@/types/blog';
import { ImageWithFallback } from '@/components/ui-custom/ImageWithFallback';
import { Loader2, Save, Eye, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PostEditorProps {
  /** Pass an existing post to edit it; omit to create a new one */
  post?: BlogPost;
}

const DEFAULT_COVER =
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=675&fit=crop';

export function PostEditor({ post }: PostEditorProps) {
  const router = useRouter();
  const { user } = useAuth();

  const [title, setTitle] = useState(post?.title ?? '');
  const [description, setDescription] = useState(post?.description ?? '');
  const [content, setContent] = useState(post?.content ?? '');
  const [coverImage, setCoverImage] = useState(post?.coverImage ?? '');
  const [category, setCategory] = useState(post?.category ?? CATEGORIES[0]);
  const [tagsRaw, setTagsRaw] = useState((post?.tags ?? []).join(', '));
  const [readingTime, setReadingTime] = useState(post?.readingTime ?? 5);
  const [featured, setFeatured] = useState(post?.featured ?? false);
  const [trending, setTrending] = useState(post?.trending ?? false);
  const [previewCover, setPreviewCover] = useState(post?.coverImage ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  if (!user) return null; // guarded by parent page

  const parsedTags = tagsRaw
    .split(',')
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setError('Title is required.'); return; }
    if (!content.trim()) { setError('Content is required.'); return; }
    setError('');
    setSaving(true);

    const fields = {
      title: title.trim(),
      description: description.trim(),
      content: content.trim(),
      coverImage: coverImage.trim() || DEFAULT_COVER,
      category,
      author: user.displayName ?? user.email ?? 'Anonymous',
      authorAvatar: user.photoURL ?? '',
      readingTime,
      tags: parsedTags,
      featured,
      trending,
    };

    try {
      if (post) {
        // Edit existing local post
        const updated = updateLocalPost(post.id, fields);
        if (!updated) throw new Error('Post not found in local storage.');
        router.push(`/blog/${updated.id}`);
      } else {
        // Create new local post
        const created = saveLocalPost(fields);
        router.push(`/blog/${created.id}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save post.');
    } finally {
      setSaving(false);
    }
  };

  const labelClass = 'block text-sm font-medium text-foreground mb-1.5';
  const inputClass =
    'w-full rounded-xl border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-24 pb-16"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center rounded-lg p-2 border border-border hover:bg-accent/50 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            {post ? 'Edit Post' : 'Write a Post'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {post ? 'Update your article' : 'Share your story with the world'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <p className="text-sm text-red-500 bg-red-500/10 rounded-xl px-4 py-3" role="alert">
            {error}
          </p>
        )}

        {/* Cover Image URL */}
        <div>
          <label htmlFor="coverImage" className={labelClass}>
            Cover Image URL{' '}
            <span className="text-muted-foreground font-normal">
              (Unsplash, Picsum, or any public URL)
            </span>
          </label>
          <input
            id="coverImage"
            type="url"
            value={coverImage}
            onChange={(e) => { setCoverImage(e.target.value); setPreviewCover(e.target.value); }}
            placeholder={DEFAULT_COVER}
            className={inputClass}
          />
          {previewCover && (
            <div className="mt-3 relative aspect-[16/7] rounded-xl overflow-hidden border border-border">
              <ImageWithFallback
                src={previewCover}
                alt="Cover preview"
                fill
                className="object-cover"
                sizes="(max-width: 896px) 100vw, 896px"
              />
            </div>
          )}
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className={labelClass}>
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="An engaging article title"
            className={inputClass}
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className={labelClass}>
            Short Description
          </label>
          <textarea
            id="description"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A brief summary shown in article cards"
            className={cn(inputClass, 'resize-none')}
          />
        </div>

        {/* Category + Reading Time */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className={labelClass}>
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputClass}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="readingTime" className={labelClass}>
              Reading Time (minutes)
            </label>
            <input
              id="readingTime"
              type="number"
              min={1}
              max={60}
              value={readingTime}
              onChange={(e) => setReadingTime(Number(e.target.value))}
              className={inputClass}
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className={labelClass}>
            Tags{' '}
            <span className="text-muted-foreground font-normal">(comma-separated)</span>
          </label>
          <input
            id="tags"
            type="text"
            value={tagsRaw}
            onChange={(e) => setTagsRaw(e.target.value)}
            placeholder="nextjs, react, typescript"
            className={inputClass}
          />
          {parsedTags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {parsedTags.map((t) => (
                <span key={t} className="inline-flex items-center rounded-md bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 text-xs text-indigo-600 dark:text-indigo-400">
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className={labelClass}>
            Content <span className="text-red-500">*</span>{' '}
            <span className="text-muted-foreground font-normal">(HTML supported)</span>
          </label>
          <textarea
            id="content"
            rows={20}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            placeholder={`<p>Start writing your article here...</p>\n\n<h2>Section Heading</h2>\n<p>More content...</p>`}
            className={cn(inputClass, 'resize-y font-mono text-xs leading-relaxed')}
          />
        </div>

        {/* Flags */}
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="h-4 w-4 rounded border-border accent-indigo-600"
            />
            <span className="text-sm text-foreground">Featured</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={trending}
              onChange={(e) => setTrending(e.target.checked)}
              className="h-4 w-4 rounded border-border accent-indigo-600"
            />
            <span className="text-sm text-foreground">Trending</span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2 border-t border-border">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-indigo-500/20 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Save className="h-4 w-4" aria-hidden="true" />
            )}
            {post ? 'Update Post' : 'Publish Post'}
          </button>
          {post && (
            <a
              href={`/blog/${post.id}`}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-secondary/50 px-6 py-3 text-sm font-medium text-foreground hover:bg-accent/50 transition-all"
            >
              <Eye className="h-4 w-4" aria-hidden="true" />
              Preview
            </a>
          )}
        </div>
      </form>
    </motion.div>
  );
}
