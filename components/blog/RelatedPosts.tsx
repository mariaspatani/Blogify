'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { BlogPost } from '@/types/blog';
import { ImageWithFallback } from '@/components/ui-custom/ImageWithFallback';
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react';

interface RelatedPostsProps {
  posts: BlogPost[];

  adjacentPosts: {
    prev: BlogPost | null;
    next: BlogPost | null;
  };
}

export function RelatedPosts({ posts, adjacentPosts }: RelatedPostsProps) {
  return (
    <section className="py-16 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Previous/Next Navigation */}
        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          {adjacentPosts.prev && (
            <Link href={`/blog/${adjacentPosts.prev.id}`} className="group">
              <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-4 transition-all hover:border-indigo-500/30 hover:shadow-lg">
                <ArrowLeft className="h-5 w-5 text-muted-foreground mt-1 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Previous Article</p>
                  <p className="text-sm font-medium text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                    {adjacentPosts.prev.title}
                  </p>
                </div>
              </div>
            </Link>
          )}
          {adjacentPosts.next && (
            <Link href={`/blog/${adjacentPosts.next.id}`} className="group">
              <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-4 transition-all hover:border-indigo-500/30 hover:shadow-lg sm:flex-row-reverse sm:text-right">
                <ArrowRight className="h-5 w-5 text-muted-foreground mt-1 shrink-0 sm:ml-0" />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Next Article</p>
                  <p className="text-sm font-medium text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                    {adjacentPosts.next.title}
                  </p>
                </div>
              </div>
            </Link>
          )}
        </div>

        {/* Related Posts */}
        {posts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight mb-8">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Link href={`/blog/${post.id}`} className="group block">
                    <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-4">
                      <ImageWithFallback
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                      <span>{post.author}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readingTime} min
                      </span>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
