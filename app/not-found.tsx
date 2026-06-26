import Link from 'next/link';
import { Search, Home, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
            <Search className="h-10 w-10 text-white" />
          </div>
        </div>
        <h1 className="text-6xl font-bold gradient-text">404</h1>
        <h2 className="mt-2 text-xl font-semibold text-foreground">Page Not Found</h2>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-indigo-500/20 hover:shadow-xl transition-all"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-secondary px-6 py-3 text-sm font-medium text-foreground hover:bg-accent/50 transition-all"
          >
            Browse Categories
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
