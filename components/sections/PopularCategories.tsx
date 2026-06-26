'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { getPopularCategories } from '@/services/blogService';
import { CATEGORIES, CATEGORY_COLORS } from '@/types/blog';
import { cn } from '@/lib/utils';
import { FolderOpen, ArrowRight } from 'lucide-react';

export function PopularCategories() {
  const { data: popularCategories } = useQuery({
    queryKey: ['popular-categories'],
    queryFn: getPopularCategories,
  });

  const categories = popularCategories || CATEGORIES.slice(0, 6).map(c => ({ category: c, count: 0 }));

  return (
    <section className="py-16 lg:py-20 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/20">
              <FolderOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground tracking-tight">Popular Categories</h2>
              <p className="text-sm text-muted-foreground">Explore topics that matter to you</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat: { category: string; count: number }, index: number) => (
            <motion.a
              key={cat.category}
              href={`/categories/${encodeURIComponent(cat.category.toLowerCase())}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className={cn(
                'group flex flex-col items-center justify-center gap-2 rounded-2xl border border-border p-6 text-center transition-all hover:shadow-lg',
                'bg-card hover:border-indigo-500/30'
              )}
            >
              <div className={cn(
                'flex h-12 w-12 items-center justify-center rounded-xl border text-sm font-bold',
                CATEGORY_COLORS[cat.category] || 'bg-slate-500/10 text-slate-600 border-slate-500/20'
              )}>
                {cat.category.charAt(0)}
              </div>
              <span className="text-sm font-medium text-foreground">{cat.category}</span>
              <span className="text-xs text-muted-foreground">{cat.count} articles</span>
              <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
