'use client';

import { motion } from 'framer-motion';
import { Breadcrumb } from '@/components/blog/Breadcrumb';
import { CATEGORIES, CATEGORY_COLORS } from '@/types/blog';
import { cn } from '@/lib/utils';
import { FolderOpen, ArrowRight, BookOpen } from 'lucide-react';

interface CategoryListProps {
  categories: { category: string; count: number }[];
}

export function CategoryList({ categories }: CategoryListProps) {
  const allCategories = CATEGORIES.map(cat => {
    const found = categories.find(c => c.category === cat);
    return { category: cat, count: found?.count || 0 };
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      <Breadcrumb items={[{ label: 'Categories' }]} />

      <div className="mt-8 mb-12">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">All Categories</h1>
        <p className="text-muted-foreground mt-2">Explore topics across all our content areas</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {allCategories.map((cat, index) => (
          <motion.a
            key={cat.category}
            href={`/categories/${encodeURIComponent(cat.category.toLowerCase())}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-lg hover:border-indigo-500/30"
          >
            <div className={cn(
              'flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border text-lg font-bold',
              CATEGORY_COLORS[cat.category] || 'bg-slate-500/10 text-slate-600 border-slate-500/20'
            )}>
              <BookOpen className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {cat.category}
              </h3>
              <p className="text-sm text-muted-foreground">{cat.count} articles</p>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          </motion.a>
        ))}
      </div>
    </div>
  );
}
