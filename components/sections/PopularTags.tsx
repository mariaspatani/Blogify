'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { getPopularTags } from '@/services/blogService';
import { Tag } from 'lucide-react';

export function PopularTags() {
  const { data: tags } = useQuery({
    queryKey: ['popular-tags'],
    queryFn: getPopularTags,
  });

  return (
    <section className="py-16 lg:py-20 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 shadow-lg shadow-pink-500/20">
            <Tag className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">Popular Tags</h2>
            <p className="text-sm text-muted-foreground">Discover trending topics and keywords</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {tags?.map((tag: { tag: string; count: number }, index: number) => (
            <motion.a
              key={tag.tag}
              href={`/search?q=${encodeURIComponent(tag.tag)}`}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.03 }}
              whileHover={{ scale: 1.05, y: -2 }}
              className="group inline-flex items-center gap-2 rounded-xl border border-border bg-secondary/50 px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-indigo-500 hover:text-white hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20"
            >
              <span className="capitalize">{tag.tag}</span>
              <span className="inline-flex items-center justify-center rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground group-hover:bg-white/20 group-hover:text-white transition-all">
                {tag.count}
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
