import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'card' | 'detail' | 'list';
}

export function LoadingSkeleton({ className, variant = 'card' }: LoadingSkeletonProps) {
  if (variant === 'detail') {
    return (
      <div className={cn('animate-pulse space-y-8', className)}>
        <div className="aspect-[16/7] w-full rounded-2xl bg-muted" />
        <div className="space-y-4 max-w-4xl mx-auto">
          <div className="h-8 w-3/4 rounded-lg bg-muted" />
          <div className="h-8 w-1/2 rounded-lg bg-muted" />
          <div className="flex items-center gap-4 py-4">
            <div className="h-12 w-12 rounded-full bg-muted" />
            <div className="space-y-2">
              <div className="h-4 w-32 rounded bg-muted" />
              <div className="h-3 w-24 rounded bg-muted" />
            </div>
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-4 rounded bg-muted" />
            ))}
            <div className="h-4 rounded bg-muted w-4/6" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className={cn('animate-pulse space-y-4', className)}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4 rounded-xl border border-border p-4">
            <div className="h-16 w-24 rounded-lg bg-muted shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 rounded bg-muted w-3/4" />
              <div className="h-3 rounded bg-muted w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('animate-pulse', className)}>
      <div className="aspect-[16/10] rounded-t-2xl bg-muted" />
      <div className="space-y-3 p-5">
        <div className="h-4 rounded bg-muted w-1/4" />
        <div className="h-5 rounded bg-muted w-3/4" />
        <div className="h-4 rounded bg-muted w-1/2" />
        <div className="flex items-center gap-3 pt-2">
          <div className="h-7 w-7 rounded-full bg-muted" />
          <div className="space-y-1.5 flex-1">
            <div className="h-3 rounded bg-muted w-24" />
            <div className="h-2 rounded bg-muted w-32" />
          </div>
        </div>
      </div>
    </div>
  );
}
