# Blogify

A production-ready blogging platform built with Next.js 13, TypeScript, and Tailwind CSS. Features a modern glassmorphism design, dark mode, SSR, full SEO metadata, and accessible UI.

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 13 (App Router) | SSR, dynamic routing, metadata |
| TypeScript | Type-safe development |
| Tailwind CSS | Utility-first styling |
| TanStack Query v5 | Client-side data fetching and caching |
| Framer Motion | Animations and page transitions |
| Lucide React | Icon set |
| next-themes | Dark / light mode |
| date-fns | Date formatting |

## Project Structure

```
app/                   # Next.js App Router pages
  blog/[id]/           # Dynamic blog post pages (SSR)
  categories/          # Category listing + filtered views
  trending/            # Trending articles page
  search/              # Search results page
  about/               # About page
  contact/             # Contact page
  globals.css          # Global styles + Tailwind
  layout.tsx           # Root layout with metadata
  page.tsx             # Homepage (SSR)
  not-found.tsx        # Custom 404 page
  sitemap.ts           # Auto-generated sitemap
  robots.ts            # robots.txt

components/
  blog/                # Blog-specific components
  categories/          # Category page components
  layout/              # Navbar, Footer, SearchBar, ThemeToggle, Providers
  pages/               # About and Contact page components
  search/              # Search results component
  sections/            # Homepage sections (Hero, Trending, Latest, etc.)
  trending/            # Trending page component
  ui-custom/           # ImageWithFallback

lib/
  api.ts               # API configuration (base URL, cache constants)
  utils.ts             # cn() utility (clsx + tailwind-merge)

services/
  blogService.ts       # Data access layer
  mockData.ts          # Mock blog posts, comments, authors

types/
  blog.ts              # TypeScript interfaces and category constants

utils/
  date.ts              # Date formatting utilities
```

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Type check
npm run typecheck

# Lint
npm run lint

# Build for production
npm run build
```

## Environment Variables

Create a `.env.local` file at the root for optional overrides:

```env
# Public site URL (used for metadata base and sitemap)
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# API base URL (placeholder — replace with real backend when ready)
NEXT_PUBLIC_API_BASE_URL=https://yourdomain.com/api
```

## Data Layer

All content is served from `services/mockData.ts` — 12 blog posts across 10 categories, 8 authors, and sample comments. The service layer in `services/blogService.ts` exposes async functions that can be swapped for real API calls without changing any component code.

The central API configuration lives in `lib/api.ts`. Update `MOCK_API_BASE_URL` and the fetch logic in `blogService.ts` to connect a real backend (CMS, Supabase, etc.).

## Features

- **SSR Homepage** — featured post fetched server-side for fast FCP and SEO
- **Real-Time Search** — command-palette style (Cmd+K) with keyboard navigation
- **Dark / Light Mode** — via next-themes, no flash on load
- **Responsive** — mobile-first layout across all breakpoints
- **Accessible** — semantic HTML, ARIA labels, keyboard navigation, focus indicators
- **SEO** — per-page metadata, Open Graph, Twitter Cards, JSON-LD ready, sitemap, robots.txt
- **Optimized Images** — next/image with shimmer loading and error fallback

## Deployment

Deploy to any platform that supports Next.js:

```bash
# Vercel (recommended)
npx vercel --prod

# Build output for self-hosting
npm run build
npm start
```

## License

MIT
