import { BlogPost } from '@/types/blog';
import { POSTS_API_URL } from '@/lib/api';

// ─── helpers ────────────────────────────────────────────────────────────────

function normaliseTags(tags: unknown): string[] {
  if (Array.isArray(tags)) return tags as string[];
  if (typeof tags === 'string') {
    return tags
      .replace(/[\[\]"]/g, '')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return [];
}

async function fetchPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch(POSTS_API_URL, {
      next: { revalidate: 60 }, // ISR — revalidate every 60 s
    });
    if (!res.ok) {
      console.error(`MockAPI responded with ${res.status}`);
      return [];
    }
    const data: BlogPost[] = await res.json();
    return data.map((p) => ({ ...p, tags: normaliseTags(p.tags) }));
  } catch (err) {
    console.error('fetchPosts failed:', err);
    return [];
  }
}

// ─── public API ─────────────────────────────────────────────────────────────

export async function getAllPosts(): Promise<BlogPost[]> {
  const posts = await fetchPosts();
  return posts.sort(
    (a, b) =>
      new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );
}

export async function getPostById(id: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${POSTS_API_URL}/${id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const post: BlogPost = await res.json();
    return { ...post, tags: normaliseTags(post.tags) };
  } catch {
    return null;
  }
}

export async function getFeaturedPosts(): Promise<BlogPost[]> {
  const posts = await fetchPosts();
  return posts.filter((p) => p.featured);
}

export async function getTrendingPosts(): Promise<BlogPost[]> {
  const posts = await fetchPosts();
  return posts
    .filter((p) => p.trending)
    .sort((a, b) => b.views - a.views);
}

export async function getLatestPosts(limit = 6): Promise<BlogPost[]> {
  const posts = await fetchPosts();
  return posts
    .sort(
      (a, b) =>
        new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    )
    .slice(0, limit);
}

export async function getPostsByCategory(category: string): Promise<BlogPost[]> {
  const posts = await fetchPosts();
  return posts.filter(
    (p) => p.category.toLowerCase() === category.toLowerCase()
  );
}

export async function searchPosts(query: string): Promise<BlogPost[]> {
  const posts = await fetchPosts();
  const q = query.toLowerCase();
  return posts.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.author.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tags.some((tag) => tag.toLowerCase().includes(q))
  );
}

export async function getRelatedPosts(
  currentId: string,
  category: string,
  limit = 3
): Promise<BlogPost[]> {
  const posts = await fetchPosts();
  return posts
    .filter((p) => p.id !== currentId && p.category === category)
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
}

export async function getAdjacentPosts(
  currentId: string
): Promise<{ prev: BlogPost | null; next: BlogPost | null }> {
  const posts = await fetchPosts();
  const sorted = posts.sort(
    (a, b) =>
      new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime()
  );
  const idx = sorted.findIndex((p) => p.id === currentId);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? sorted[idx - 1] : null,
    next: idx < sorted.length - 1 ? sorted[idx + 1] : null,
  };
}

export async function getPopularTags(): Promise<{ tag: string; count: number }[]> {
  const posts = await fetchPosts();
  const tagMap = new Map<string, number>();
  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagMap.set(tag, (tagMap.get(tag) ?? 0) + 1);
    });
  });
  return Array.from(tagMap.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);
}

export async function getCategoriesWithCounts(): Promise<
  { category: string; count: number }[]
> {
  const posts = await fetchPosts();
  const map = new Map<string, number>();
  posts.forEach((post) => {
    map.set(post.category, (map.get(post.category) ?? 0) + 1);
  });
  return Array.from(map.entries()).map(([category, count]) => ({
    category,
    count,
  }));
}

export async function getPopularCategories(): Promise<
  { category: string; count: number }[]
> {
  const categories = await getCategoriesWithCounts();
  return categories.sort((a, b) => b.count - a.count).slice(0, 6);
}

// comments are now managed by Firestore — see lib/firestore.ts

// ─── mutations (Create / Edit / Delete — authenticated users only) ──────────

export interface CreatePostInput {
  title: string;
  description: string;
  content: string;
  coverImage: string;
  category: string;
  author: string;
  authorAvatar: string;
  readingTime: number;
  tags: string[];
  featured: boolean;
  trending: boolean;
}

export async function createPost(input: CreatePostInput): Promise<BlogPost> {
  const body: Omit<BlogPost, 'id'> = {
    ...input,
    publishDate: new Date().toISOString().split('T')[0],
    likes: 0,
    views: 0,
  };
  const res = await fetch(POSTS_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Failed to create post: ${res.status}`);
  const post: BlogPost = await res.json();
  return { ...post, tags: normaliseTags(post.tags) };
}

export async function updatePost(
  id: string,
  input: Partial<CreatePostInput>
): Promise<BlogPost> {
  const res = await fetch(`${POSTS_API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`Failed to update post: ${res.status}`);
  const post: BlogPost = await res.json();
  return { ...post, tags: normaliseTags(post.tags) };
}

export async function deletePost(id: string): Promise<void> {
  const res = await fetch(`${POSTS_API_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Failed to delete post: ${res.status}`);
}
