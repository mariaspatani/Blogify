import { getAllPosts } from '@/services/blogService';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();
  const baseUrl = 'https://blogify.app';

  const staticRoutes = [
    '',
    '/about',
    '/contact',
    '/categories',
    '/trending',
  ];

  const staticUrls = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  const categories = [
    'technology',
    'artificial-intelligence',
    'programming',
    'business',
    'design',
    'travel',
    'lifestyle',
    'health',
    'education',
    'science',
  ];

  const categoryUrls = categories.map((category) => ({
    url: `${baseUrl}/categories/${category}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const postUrls = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.id}`,
    lastModified: post.publishDate,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticUrls, ...categoryUrls, ...postUrls];
}
