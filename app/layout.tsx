import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/layout/providers';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'Blogify - Discover Stories That Matter',
    template: '%s | Blogify',
  },
  description:
    'Blogify is a premium blogging platform featuring curated articles on technology, design, business, and lifestyle. Discover stories that inspire and inform.',
  keywords: [
    'blog',
    'technology',
    'design',
    'business',
    'lifestyle',
    'programming',
    'AI',
    'science',
  ],
  authors: [{ name: 'Blogify' }],
  creator: 'Blogify',
  publisher: 'Blogify',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://blogify.app'
  ),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Blogify',
    title: 'Blogify - Discover Stories That Matter',
    description:
      'A premium blogging platform featuring curated articles on technology, design, business, and lifestyle.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Blogify - Discover Stories That Matter',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blogify - Discover Stories That Matter',
    description:
      'A premium blogging platform featuring curated articles on technology, design, business, and lifestyle.',
    images: ['/og-image.jpg'],
    creator: '@blogify',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body
        className={`${inter.className} min-h-screen bg-background text-foreground`}
      >
        <Providers>
          <Navbar />
          <main id="main-content">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
