'use client';

import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { searchPosts } from '@/services/blogService';
import { BlogPost } from '@/types/blog';
import { ImageWithFallback } from '@/components/ui-custom/ImageWithFallback';
import { cn } from '@/lib/utils';
import {
  Search,
  X,
  Loader2,
  ArrowRight,
  FileText,
  User,
  FolderOpen,
} from 'lucide-react';

interface SearchBarProps {
  onClose: () => void;
}

export function SearchBar({ onClose }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { data: typedResults, isLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: () => searchPosts(query),
    enabled: query.length > 1,
    staleTime: 1000,
  });

  useEffect(() => {
    inputRef.current?.focus();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [query, typedResults]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!typedResults) return;
    const totalItems = typedResults.length + 1;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % totalItems);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + totalItems) % totalItems);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex === -1 || selectedIndex === typedResults.length) {
        router.push(`/search?q=${encodeURIComponent(query)}`);
        onClose();
      } else if (selectedIndex >= 0 && selectedIndex < typedResults.length) {
        router.push(`/blog/${typedResults[selectedIndex].id}`);
        onClose();
      }
    }
  };

  const handleResultClick = (post: BlogPost) => {
    router.push(`/blog/${post.id}`);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh] bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-label="Search articles"
    >
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="w-full max-w-2xl mx-4 overflow-hidden rounded-2xl bg-card border border-border shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-4">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search articles, authors, categories..."
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-base"
            aria-label="Search articles"
            autoComplete="off"
          />
          {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          <button
            onClick={onClose}
            className="rounded-md p-1 hover:bg-accent/50 text-muted-foreground"
            aria-label="Close search"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          <AnimatePresence>
            {query.length <= 1 && !isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-6 text-center text-muted-foreground"
              >
                <Search className="h-8 w-8 mx-auto mb-3 text-muted-foreground/50" />
                <p className="text-sm">Type to search articles, authors, or topics</p>
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <kbd className="rounded border border-border bg-secondary px-1.5 py-0.5">↑↓</kbd>
                  <span>Navigate</span>
                  <kbd className="rounded border border-border bg-secondary px-1.5 py-0.5">Enter</kbd>
                  <span>Select</span>
                  <kbd className="rounded border border-border bg-secondary px-1.5 py-0.5">Esc</kbd>
                  <span>Close</span>
                </div>
              </motion.div>
            )}

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-6 text-center"
              >
                <Loader2 className="h-6 w-6 mx-auto animate-spin text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">Searching...</p>
              </motion.div>
            )}

            {typedResults && typedResults.length === 0 && query.length > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-6 text-center"
              >
                <FileText className="h-8 w-8 mx-auto mb-3 text-muted-foreground/50" />
                <p className="text-sm font-medium text-foreground">No results found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Try adjusting your search terms
                </p>
              </motion.div>
            )}

            {typedResults && typedResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Articles ({typedResults.length})
                </div>
                {typedResults.map((post: BlogPost, index: number) => (
                  <div
                    key={post.id}
                    onClick={() => handleResultClick(post)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 cursor-pointer transition-all',
                      selectedIndex === index
                        ? 'bg-indigo-500/10 border-l-2 border-indigo-500'
                        : 'hover:bg-accent/50 border-l-2 border-transparent'
                    )}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && handleResultClick(post)}
                  >
                    <div className="relative h-12 w-16 shrink-0 rounded-lg overflow-hidden">
                      <ImageWithFallback
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {post.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {post.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <FolderOpen className="h-3 w-3" />
                          {post.category}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </div>
                ))}
                <div
                  onClick={() => {
                    router.push(`/search?q=${encodeURIComponent(query)}`);
                    onClose();
                  }}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 cursor-pointer transition-all border-t border-border',
                    selectedIndex === typedResults.length
                      ? 'bg-indigo-500/10 border-l-2 border-indigo-500'
                      : 'hover:bg-accent/50 border-l-2 border-transparent'
                  )}
                  role="button"
                  tabIndex={0}
                >
                  <ArrowRight className="h-4 w-4 text-indigo-500" />
                  <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    View all results for &quot;{query}&quot;
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
