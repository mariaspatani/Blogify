import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPostById, getRelatedPosts, getAdjacentPosts } from '@/services/blogService';
import { BlogDetail } from '@/components/blog/BlogDetail';
import { RelatedPosts } from '@/components/blog/RelatedPosts';
import { CommentSection } from '@/components/blog/CommentSection';
import { Breadcrumb } from '@/components/blog/Breadcrumb';
import { LocalBlogPage } from '@/components/blog/LocalBlogPage';

interface BlogPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  // Local posts can't be resolved server-side — return generic title
  if (params.id.startsWith('local-')) {
    return { title: 'Blog Post | Blogify' };
  }
  const post = await getPostById(params.id);
  if (!post) return { title: 'Article Not Found' };
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.id}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.publishDate,
      authors: [post.author],
      images: [{ url: post.coverImage, width: 1200, height: 675, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [post.coverImage],
    },
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  // Local posts are stored in localStorage — delegate rendering to a client component
  if (params.id.startsWith('local-')) {
    return <LocalBlogPage id={params.id} />;
  }

  const post = await getPostById(params.id);
  if (!post) notFound();

  const [relatedPosts, adjacentPosts] = await Promise.all([
    getRelatedPosts(post.id, post.category),
    getAdjacentPosts(post.id),
  ]);

  return (
    <article>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        <Breadcrumb
          items={[
            { label: post.category, href: `/categories/${encodeURIComponent(post.category.toLowerCase())}` },
            { label: post.title },
          ]}
        />
      </div>
      <BlogDetail post={post} />
      <RelatedPosts posts={relatedPosts} adjacentPosts={adjacentPosts} />
      <CommentSection postId={post.id} />
    </article>
  );
}
