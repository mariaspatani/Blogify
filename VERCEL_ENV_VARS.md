# Vercel Environment Variables

Add these in your Vercel project → Settings → Environment Variables.
Set them for **Production**, **Preview**, and **Development**.

## Required

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIzaSyDHhn-szjOvUNDejZVCQ2T9HLR-Bt8RtJM` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `blogy-55018.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `blogy-55018` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `blogy-55018.firebasestorage.app` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `799701760257` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:799701760257:web:70bc69f1b86f6c13cbc300` |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | `G-V4W5G5LP8F` |

## Optional (have sensible defaults)

| Variable | Default | Notes |
|---|---|---|
| `NEXT_PUBLIC_POSTS_API_URL` | `https://6a3e7d4e0443193a1a0bf936.mockapi.io/api/blog/posts` | MockAPI endpoint |
| `NEXT_PUBLIC_SITE_URL` | `https://blogify.app` | Used for metadata base URL |

## Firebase — Additional Setup

1. In Firebase Console → Authentication → Settings → **Authorized domains**
   add your Vercel deployment domain: `your-project.vercel.app`

2. In Firebase Console → Firestore → **Rules**, paste the contents of `firestore.rules`
   and click **Publish**.
