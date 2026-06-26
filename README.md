# Blogify

A full-featured, production-ready blogging platform built with **Next.js 13 App Router**, **TypeScript**, **Tailwind CSS**, **Firebase Authentication**, **Firestore**, and **MockAPI**. Features a premium glassmorphism UI, dark/light mode, SSR homepage, real-time comments, likes, bookmarks, and user blog authoring with localStorage persistence.

---

## Table of Contents

- [Live Demo](#live-demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Firebase Setup](#firebase-setup)
- [Firestore Security Rules](#firestore-security-rules)
- [Data Architecture](#data-architecture)
- [Authentication](#authentication)
- [Blog Authoring](#blog-authoring)
- [Deployment](#deployment)
- [Scripts](#scripts)

---

## Live Demo

> Deployed on Vercel —https://blogify-blond-theta.vercel.app/

---

## Features

### Reading (Public — No Login Required)
- Browse 13+ curated articles across 10 categories
- SSR homepage with featured post, trending, and latest articles
- Full article view with table of contents sidebar, tags, and social share
- Category filtering and browsing
- Real-time full-text search (Cmd+K) by title, author, category, tags
- Trending posts page
- Responsive dark / light mode

### Authentication
- Email & Password Sign Up and Sign In
- Forgot Password (email reset link)
- Persistent login via Firebase session tokens
- User avatar and dropdown menu in navbar

### Authenticated Features
- **Like** posts — stored in Firestore, persists across sessions
- **Bookmark** posts — stored in Firestore per user
- **Comment** on posts — stored in Firestore, publicly visible
- **Delete own comments**
- **Write** blog posts — saved to localStorage
- **Edit / Delete** your own posts
- **My Posts** dashboard — manage all your authored posts

### SEO & Performance
- Per-page dynamic metadata (Open Graph, Twitter Cards)
- `sitemap.xml` and `robots.txt` auto-generated
- ISR (Incremental Static Regeneration) — posts revalidate every 60 seconds
- `next/image` with shimmer loading and error fallback
- Zero build errors, zero TypeScript errors

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 13.5.1 | App Router, SSR, ISR, dynamic routes |
| TypeScript | 5.2.2 | Type-safe development |
| Tailwind CSS | 3.3.3 | Utility-first styling |
| Framer Motion | ^12 | Page transitions and animations |
| TanStack Query | ^5 | Client-side data fetching and caching |
| Firebase Auth | ^12 | Email/password authentication |
| Firestore | ^12 | Comments, likes, bookmarks, user profiles |
| MockAPI | REST | Blog post data (read/seeded externally) |
| next-themes | ^0.3 | Dark / light mode with no flash |
| date-fns | ^3 | Date formatting |
| lucide-react | ^0.446 | Icon set |
| clsx + tailwind-merge | latest | Conditional class utilities |

---

## Project Structure

```
Blogify/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Homepage (SSR — featured + trending + latest)
│   ├── layout.tsx                # Root layout with metadata, fonts, providers
│   ├── not-found.tsx             # Custom 404 page
│   ├── robots.ts                 # robots.txt generation
│   ├── sitemap.ts                # sitemap.xml generation
│   ├── blog/
│   │   └── [id]/
│   │       ├── page.tsx          # Blog post detail (SSR for API posts, client for local)
│   │       └── edit/
│   │           └── page.tsx      # Edit a locally-stored post
│   ├── categories/
│   │   ├── page.tsx              # All categories listing
│   │   └── [category]/
│   │       └── page.tsx          # Posts filtered by category
│   ├── trending/
│   │   └── page.tsx              # Trending posts
│   ├── search/
│   │   └── page.tsx              # Search results
│   ├── write/
│   │   └── page.tsx              # Create a new blog post (auth required)
│   ├── my-posts/
│   │   └── page.tsx              # My Posts dashboard (auth required)
│   ├── about/
│   │   └── page.tsx
│   └── contact/
│       └── page.tsx
│
├── components/
│   ├── auth/
│   │   └── AuthModal.tsx         # Sign in / Sign up / Reset password modal
│   ├── blog/
│   │   ├── BlogCard.tsx          # Article card (default, featured, compact variants)
│   │   ├── BlogDetail.tsx        # Full article view with like/bookmark/share/TOC
│   │   ├── Breadcrumb.tsx        # Accessible breadcrumb navigation
│   │   ├── CommentSection.tsx    # Firestore-backed comments with auth gate
│   │   ├── LoadingSkeleton.tsx   # Animated shimmer placeholders
│   │   ├── LocalBlogPage.tsx     # Client renderer for localStorage posts
│   │   ├── PostEditor.tsx        # Create / edit post form (saves to localStorage)
│   │   └── RelatedPosts.tsx      # Prev/next navigation + related articles grid
│   ├── categories/
│   │   ├── CategoryList.tsx      # All categories grid
│   │   └── CategoryPage.tsx      # Category detail with filtered posts
│   ├── layout/
│   │   ├── Navbar.tsx            # Responsive navbar with search, auth, write button
│   │   ├── Footer.tsx            # Footer with links and newsletter
│   │   ├── providers.tsx         # QueryClient + ThemeProvider + AuthProvider
│   │   ├── SearchBar.tsx         # Full-screen search overlay (Cmd+K)
│   │   └── ThemeToggle.tsx       # Animated dark/light toggle
│   ├── pages/
│   │   ├── AboutPage.tsx
│   │   └── ContactPage.tsx
│   ├── search/
│   │   └── SearchResults.tsx
│   ├── sections/
│   │   ├── Hero.tsx              # Homepage hero with floating stats card
│   │   ├── TrendingSection.tsx   # Client-fetched trending grid
│   │   ├── LatestArticles.tsx    # Client-fetched latest grid
│   │   ├── PopularCategories.tsx # Top 6 categories
│   │   ├── PopularTags.tsx       # Top 12 tags
│   │   └── Newsletter.tsx        # Email subscription form
│   ├── trending/
│   │   └── TrendingPage.tsx
│   └── ui-custom/
│       └── ImageWithFallback.tsx # next/image with shimmer + error fallback
│
├── context/
│   └── AuthContext.tsx           # Firebase Auth state, signIn/signUp/logout
│
├── lib/
│   ├── api.ts                    # MockAPI URL + React Query constants
│   ├── firebase.ts               # Firebase app init (auth + firestore)
│   ├── firestore.ts              # Firestore helpers: users, comments, likes, bookmarks
│   ├── localPosts.ts             # localStorage CRUD for user-authored posts
│   └── utils.ts                  # cn() — clsx + tailwind-merge
│
├── services/
│   └── blogService.ts            # All MockAPI fetch functions (read-only)
│
├── types/
│   └── blog.ts                   # BlogPost, Author, Comment interfaces + CATEGORIES
│
├── utils/
│   └── date.ts                   # formatDate, formatDistanceToNow
│
├── scripts/
│   └── seed-mockapi.mjs          # One-time script to seed 13 posts to MockAPI
│
├── firestore.rules               # Firestore security rules (deploy to Firebase)
├── VERCEL_ENV_VARS.md            # Vercel deployment variable reference
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── .env.local                    # Local environment variables (not committed)
```

---

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm 9 or later
- A Firebase project with Authentication and Firestore enabled

### Installation

```bash
# Clone the repository
git clone https://github.com/mariaspatani/Blogify.git
cd Blogify

# Install dependencies
npm install

# Create your environment file
cp .env.local.example .env.local
# Then fill in your Firebase credentials (see Environment Variables below)

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

Create a `.env.local` file at the project root with the following variables:

```env
# ── Firebase ────────────────────────────────────────────────────────────────
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# ── MockAPI ──────────────────────────────────────────────────────────────────
# Optional — defaults to the seeded endpoint if omitted
NEXT_PUBLIC_POSTS_API_URL=https://your-mockapi-endpoint.mockapi.io/api/blog/posts

# ── Site ─────────────────────────────────────────────────────────────────────
# Used for metadata base URL and sitemap generation
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

> `.env.local` is listed in `.gitignore` and will never be committed.

---

## Firebase Setup

### 1. Create a Firebase project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create a new project
3. Register a **Web app** and copy the config into `.env.local`

### 2. Enable Authentication

1. Firebase Console → Authentication → Sign-in method
2. Enable **Email/Password**

### 3. Enable Firestore

1. Firebase Console → Firestore Database → Create database
2. Start in **production mode**
3. Paste the rules from `firestore.rules` (see below) and click **Publish**

### 4. Add your domain to Authorized Domains

1. Firebase Console → Authentication → Settings → Authorized domains
2. Add your Vercel deployment URL (e.g. `your-app.vercel.app`)

---

## Firestore Security Rules

Copy the contents of `firestore.rules` and paste them in **Firebase Console → Firestore → Rules**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /users/{uid} {
      allow read: if true;
      allow create, update: if request.auth != null && request.auth.uid == uid;
    }

    match /comments/{commentId} {
      allow read: if true;
      allow create: if request.auth != null
        && request.resource.data.uid == request.auth.uid
        && request.resource.data.content is string
        && request.resource.data.content.size() > 0;
      allow delete: if request.auth != null && resource.data.uid == request.auth.uid;
    }

    match /likes/{likeId} {
      allow read: if true;
      allow create: if request.auth != null && request.resource.data.uid == request.auth.uid;
      allow delete: if request.auth != null && resource.data.uid == request.auth.uid;
    }

    match /bookmarks/{bookmarkId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.resource.data.uid == request.auth.uid;
      allow delete: if request.auth != null && resource.data.uid == request.auth.uid;
    }
  }
}
```

> **Important:** Without these rules deployed, Firestore will return `permission-denied` errors for all writes. The app handles these errors gracefully and will not crash, but likes, bookmarks, and comments won't persist.

---

## Data Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Data Sources                         │
├───────────────────┬─────────────────┬───────────────────────┤
│    MockAPI REST   │    Firestore    │     localStorage      │
│                   │                 │                       │
│  Blog post feed   │  User profiles  │  User-authored posts  │
│  (read-only for   │  Comments       │  (local- prefix IDs)  │
│   the frontend)   │  Likes          │                       │
│                   │  Bookmarks      │                       │
└───────────────────┴─────────────────┴───────────────────────┘
```

### MockAPI
- All 13 seeded posts live at the MockAPI endpoint
- Fetched with `fetch()` and `next: { revalidate: 60 }` for ISR
- Posts are **read-only** from the frontend
- Re-seed with `node scripts/seed-mockapi.mjs` if the endpoint is cleared

### Firestore Collections

| Collection | Document ID | Fields |
|---|---|---|
| `users` | Firebase UID | `uid`, `name`, `email`, `photoURL`, `bio`, `joinedAt` |
| `comments` | Auto-generated | `postId`, `uid`, `author`, `avatar`, `content`, `likes`, `createdAt` |
| `likes` | `{uid}_{postId}` | `uid`, `postId`, `createdAt` |
| `bookmarks` | `{uid}_{postId}` | `uid`, `postId`, `createdAt` |

### localStorage
- Key: `blogify_local_posts`
- Stores `BlogPost[]` serialised as JSON
- Post IDs use `local-{timestamp}` format to avoid collisions with MockAPI IDs
- Local posts are only visible to the browser that created them

---

## Authentication

Authentication is handled entirely by **Firebase Auth** with **Email/Password** only.

### Sign Up Flow
1. User fills in name, email, and password (min 6 chars)
2. Firebase creates the account
3. `updateProfile` sets the display name
4. A `users/{uid}` document is created in Firestore (best-effort)

### Sign In Flow
1. `signInWithEmailAndPassword` authenticates the user
2. `onAuthStateChanged` listener restores session on page reload
3. User avatar and dropdown appear in the navbar

### Protected Actions
Attempting any of the following without being signed in opens the **Auth Modal** automatically:

- Liking a post
- Bookmarking a post
- Posting a comment
- Navigating to `/write` or `/my-posts`

---

## Blog Authoring

### Writing a Post
1. Sign in to your account
2. Click **Write** in the navbar (or go to `/write`)
3. Fill in the post form:
   - Cover image URL (Unsplash, Picsum, or any public URL)
   - Title and short description
   - Category (10 options) and reading time
   - Tags (comma-separated)
   - Content (plain text or HTML)
   - Featured / Trending flags
4. Click **Publish Post**
5. The post is saved to `localStorage` and you are redirected to the post page

### Editing a Post
- Open any of your posts from the **My Posts** dashboard (`/my-posts`)
- Click the **Edit** button (pencil icon)
- Update the form and click **Update Post**

### Deleting a Post
- From the **My Posts** dashboard, click the **Delete** button (trash icon)
- Or open a post you authored and click **Delete** in the breadcrumb area
- Confirms before deleting

> **Note:** Posts saved to localStorage are device-specific. They will not appear on other devices or browsers. Clear browser storage to remove all local posts.

---

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in [vercel.com](https://vercel.com)
3. Set all environment variables listed above in **Settings → Environment Variables**
4. Deploy

Vercel will automatically build and deploy on every push to `main`.

### Required Vercel Environment Variables

| Variable | Required |
|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | ✅ |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | ✅ |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | ✅ |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | ✅ |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | ✅ |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | ✅ |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Optional |
| `NEXT_PUBLIC_POSTS_API_URL` | Optional (has default) |
| `NEXT_PUBLIC_SITE_URL` | Optional (has default) |

### Re-seeding MockAPI

If the MockAPI endpoint is ever cleared, run the seed script once:

```bash
node scripts/seed-mockapi.mjs
```

This creates 13 posts covering Next.js, React, AI, TypeScript, Tailwind CSS, Design, Business, Travel, Health, Lifestyle, and Education. The script is idempotent — it skips seeding if posts already exist.

---

## Scripts

```bash
# Start development server with hot reload
npm run dev

# Type check without emitting (CI-safe)
npm run typecheck

# Run ESLint
npm run lint

# Production build
npm run build

# Start production server (after build)
npm start

# Seed MockAPI with 13 blog posts (run once)
node scripts/seed-mockapi.mjs
```

---

## Contributing

Pull requests are welcome. For significant changes, open an issue first to discuss the approach.

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push: `git push origin feat/your-feature`
5. Open a Pull Request

---

## License

MIT — free to use for personal and commercial projects.

---

*Built with care by the Blogify team.*
