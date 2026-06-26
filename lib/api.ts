/** MockAPI base URL — all blog post data is served from here */
export const POSTS_API_URL =
  process.env.NEXT_PUBLIC_POSTS_API_URL ??
  'https://6a3e7d4e0443193a1a0bf936.mockapi.io/api/blog/posts';

/** Default stale time for React Query (ms) */
export const QUERY_STALE_TIME = 60 * 1000; // 1 minute

/** Default cache time for React Query (ms) */
export const QUERY_CACHE_TIME = 5 * 60 * 1000; // 5 minutes
