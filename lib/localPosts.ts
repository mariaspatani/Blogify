/**
 * Local-storage post store.
 * User-authored posts are saved here and merged with the MockAPI feed at read time.
 * The local post ID uses a "local-" prefix so it never collides with MockAPI IDs.
 */
import { BlogPost } from '@/types/blog';

const STORAGE_KEY = 'blogify_local_posts';

function isClient() {
  return typeof window !== 'undefined';
}

/** Read all local posts (newest first) */
export function getLocalPosts(): BlogPost[] {
  if (!isClient()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: BlogPost[] = JSON.parse(raw);
    return parsed.sort(
      (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    );
  } catch {
    return [];
  }
}

/** Save a new post; returns the stored post with its generated ID */
export function saveLocalPost(
  input: Omit<BlogPost, 'id' | 'publishDate' | 'likes' | 'views'>
): BlogPost {
  const post: BlogPost = {
    ...input,
    id: `local-${Date.now()}`,
    publishDate: new Date().toISOString().split('T')[0],
    likes: 0,
    views: 0,
  };
  const existing = getLocalPosts();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([post, ...existing]));
  return post;
}

/** Update an existing local post */
export function updateLocalPost(id: string, updates: Partial<BlogPost>): BlogPost | null {
  const posts = getLocalPosts();
  const idx = posts.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  const updated = { ...posts[idx], ...updates };
  posts[idx] = updated;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  return updated;
}

/** Delete a local post */
export function deleteLocalPost(id: string): void {
  const posts = getLocalPosts().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

/** Get a single local post by ID */
export function getLocalPostById(id: string): BlogPost | null {
  return getLocalPosts().find((p) => p.id === id) ?? null;
}

/** True when the ID belongs to a locally-stored post */
export function isLocalPost(id: string): boolean {
  return id.startsWith('local-');
}
