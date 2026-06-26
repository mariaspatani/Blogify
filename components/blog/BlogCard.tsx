'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { BlogPost } from '@/types/blog';
import { ImageWithFallback } from '@/components/ui-custom/ImageWithFallback';
import { cn } from '@/lib/utils';
import { Clock, Eye, Heart, ArrowUpRight } from 'lucide-react';
import { formatDistanceToNow } from '@/utils/date';

interface BlogCardProps {
  post: BlogPost;
  index?: number;
  variant?: 'default' | 'featured' | 'compact';
  className?: string;
}

export function BlogCard({ post, index = 0, variant = 'default', className }: BlogCardProps) {
  const isFeatured = variant === 'featured';
  const isCompact = variant === 'compact';

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card card-shadow transition-all duration-300 hover:card-shadow-hover',
        isFeatured && 'md:flex-row md:items-center',
        className
      )}
    >
      {/* Image */}
      <div
        className={cn(
          'relative overflow-hidden shrink-0',
          isFeatured ? 'aspect-[16/10] md:aspect-auto md:w-1/2 md:h-full' : 'aspect-[16/10]',
          isCompact ? 'aspect-[16/9]' : ''
        )}
      >
        <Link href={`/blog/${post.id}`}>
          <ImageWithFallback
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes={isFeatured ? '(min-width: 768px) 50vw, 100vw' : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
          />
        </Link>
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center rounded-full border border-border bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-2.5 py-1 text-xs font-medium text-foreground">
            {post.category}
          </span>
        </div>
        {/* Trending Badge */}
        {post.trending && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-2.5 py-1 text-xs font-medium text-white shadow-lg">
              <ArrowUpRight className="h-3 w-3" />
              Trending
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className={cn('flex flex-col p-5', isFeatured && 'md:p-8 md:flex-1', isCompact && 'p-4')}>
        <Link href={`/blog/${post.id}`} className="group/link">
          <h3
            className={cn(
              'font-semibold text-foreground leading-tight transition-colors group-hover/link:text-indigo-600 dark:group-hover/link:text-indigo-400',
              isFeatured ? 'text-xl md:text-2xl' : 'text-lg',
              isCompact ? 'text-base line-clamp-2' : 'line-clamp-2'
            )}
          >
            {post.title}
          </h3>
        </Link>

        <p
          className={cn(
            'mt-2 text-muted-foreground leading-relaxed',
            isFeatured ? 'text-sm line-clamp-3' : 'text-sm line-clamp-2',
            isCompact ? 'hidden' : ''
          )}
        >
          {post.description}
        </p>

        {/* Meta */}
        <div className="mt-auto pt-4 flex items-center gap-3">
          <div className="relative h-7 w-7 rounded-full overflow-hidden ring-2 ring-border">
            <ImageWithFallback
              src={post.authorAvatar}
              alt={post.author}
              fill
              className="object-cover"
              sizes="28px"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{post.author}</p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {post.readingTime} min
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {post.views.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                {post.likes.toLocaleString()}
              </span>
            </div>
          </div>
          <span className="text-xs text-muted-foreground shrink-0">
            {formatDistanceToNow(post.publishDate)}
          </span>
        </div>
      </div>
    </motion.article>
  );
}
