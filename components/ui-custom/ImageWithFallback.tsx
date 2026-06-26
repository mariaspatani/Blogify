'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ImageIcon } from 'lucide-react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export function ImageWithFallback({
  src,
  alt,
  fill,
  width,
  height,
  className,
  sizes,
  priority,
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (hasError) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700',
          fill ? 'absolute inset-0' : '',
          className
        )}
        style={!fill ? { width, height } : undefined}
        role="img"
        aria-label={alt}
      >
        <ImageIcon className="h-8 w-8 text-muted-foreground/50" aria-hidden="true" />
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div
          className={cn(
            'bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 animate-shimmer bg-[length:200%_100%]',
            fill ? 'absolute inset-0' : '',
            className
          )}
          style={!fill ? { width, height } : undefined}
          aria-hidden="true"
        />
      )}
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        className={cn(
          'object-cover transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          className
        )}
        sizes={sizes}
        priority={priority}
        onError={() => setHasError(true)}
        onLoad={() => setIsLoading(false)}
      />
    </>
  );
}
