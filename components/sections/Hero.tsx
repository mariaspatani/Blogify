'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { BlogPost } from '@/types/blog';
import { ImageWithFallback } from '@/components/ui-custom/ImageWithFallback';
import { cn } from '@/lib/utils';
import { ArrowRight, Clock, Eye, Heart, TrendingUp } from 'lucide-react';

interface HeroProps {
  featuredPost: BlogPost;
}

export function Hero({ featuredPost }: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-20 lg:pt-24">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-emerald-500/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <div className="flex items-center gap-2 mb-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-3 py-1 text-xs font-medium text-white shadow-lg shadow-indigo-500/20">
                <TrendingUp className="h-3 w-3" />
                Featured Story
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs font-medium text-muted-foreground">
                {featuredPost.category}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight">
              {featuredPost.title}
            </h1>

            <p className="mt-4 text-lg text-muted-foreground leading-relaxed max-w-xl">
              {featuredPost.description}
            </p>

            <div className="mt-6 flex items-center gap-4 flex-wrap">
              <div className="relative h-10 w-10 rounded-full overflow-hidden ring-2 ring-border">
                <ImageWithFallback
                  src={featuredPost.authorAvatar}
                  alt={featuredPost.author}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{featuredPost.author}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {featuredPost.readingTime} min
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {featuredPost.views.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    {featuredPost.likes.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <Link
                href={`/blog/${featuredPost.id}`}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 transition-all hover:-translate-y-0.5"
              >
                Read Article
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/#latest"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-secondary/50 px-6 py-3 text-sm font-medium text-foreground hover:bg-accent/50 transition-all"
              >
                Explore More
              </Link>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className="relative"
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-indigo-500/10">
              <ImageWithFallback
                src={featuredPost.coverImage}
                alt={featuredPost.title}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>
            {/* Floating elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-4 -right-4 rounded-xl bg-white dark:bg-slate-800 p-3 shadow-xl border border-border"
            >
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground">Trending</p>
                  <p className="text-xs text-muted-foreground">{featuredPost.views.toLocaleString()} views</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
