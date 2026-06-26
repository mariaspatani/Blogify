/**
 * Firestore helpers
 * Collections: users | comments | likes | bookmarks
 * Blog post data stays in MockAPI — never touched here.
 *
 * All write helpers return a result object instead of throwing,
 * so Firestore permission errors don't crash the UI.
 */
import {
  doc,
  getDoc,
  setDoc,
  addDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  serverTimestamp,
  Timestamp,
  FirestoreError,
} from 'firebase/firestore';
import { db } from './firebase';

// ── Error helpers ────────────────────────────────────────────────────────────

export interface FirestoreResult<T> {
  data: T | null;
  error: string | null;
}

function friendlyError(e: unknown): string {
  const code = (e as FirestoreError)?.code ?? '';
  if (code === 'permission-denied') {
    return 'Permission denied. Please sign in or check Firestore rules.';
  }
  if (code === 'unavailable') {
    return 'Service temporarily unavailable. Please try again.';
  }
  if (e instanceof Error) return e.message;
  return 'An unexpected error occurred.';
}

// ── User ────────────────────────────────────────────────────────────────────

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  photoURL: string;
  bio: string;
  joinedAt: Timestamp | null;
}

/** Best-effort — will not throw even on permission errors */
export async function upsertUser(profile: Omit<UserProfile, 'joinedAt'>): Promise<void> {
  try {
    const ref = doc(db, 'users', profile.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, { ...profile, joinedAt: serverTimestamp() });
    } else {
      await setDoc(
        ref,
        { name: profile.name, email: profile.email, photoURL: profile.photoURL },
        { merge: true }
      );
    }
  } catch {
    // Silently swallow — auth still works even if user doc write fails
  }
}

export async function getUser(uid: string): Promise<UserProfile | null> {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    return snap.exists() ? (snap.data() as UserProfile) : null;
  } catch {
    return null;
  }
}

// ── Comments ────────────────────────────────────────────────────────────────

export interface FirestoreComment {
  id: string;
  postId: string;
  uid: string;
  author: string;
  avatar: string;
  content: string;
  createdAt: Timestamp | null;
  likes: number;
}

export async function getComments(postId: string): Promise<FirestoreComment[]> {
  try {
    const q = query(
      collection(db, 'comments'),
      where('postId', '==', postId),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreComment));
  } catch {
    return [];
  }
}

export async function addComment(
  postId: string,
  uid: string,
  author: string,
  avatar: string,
  content: string
): Promise<FirestoreResult<FirestoreComment>> {
  try {
    const ref = await addDoc(collection(db, 'comments'), {
      postId,
      uid,
      author,
      avatar,
      content,
      likes: 0,
      createdAt: serverTimestamp(),
    });
    return {
      data: { id: ref.id, postId, uid, author, avatar, content, likes: 0, createdAt: null },
      error: null,
    };
  } catch (e) {
    return { data: null, error: friendlyError(e) };
  }
}

export async function deleteComment(commentId: string): Promise<FirestoreResult<true>> {
  try {
    await deleteDoc(doc(db, 'comments', commentId));
    return { data: true, error: null };
  } catch (e) {
    return { data: null, error: friendlyError(e) };
  }
}

// ── Likes ───────────────────────────────────────────────────────────────────

function likeId(uid: string, postId: string) {
  return `${uid}_${postId}`;
}

export async function isLiked(uid: string, postId: string): Promise<boolean> {
  try {
    const snap = await getDoc(doc(db, 'likes', likeId(uid, postId)));
    return snap.exists();
  } catch {
    return false;
  }
}

export async function toggleLike(
  uid: string,
  postId: string
): Promise<FirestoreResult<boolean>> {
  try {
    const ref = doc(db, 'likes', likeId(uid, postId));
    const snap = await getDoc(ref);
    if (snap.exists()) {
      await deleteDoc(ref);
      return { data: false, error: null };
    }
    await setDoc(ref, { uid, postId, createdAt: serverTimestamp() });
    return { data: true, error: null };
  } catch (e) {
    return { data: null, error: friendlyError(e) };
  }
}

export async function getLikeCount(postId: string): Promise<number> {
  try {
    const q = query(collection(db, 'likes'), where('postId', '==', postId));
    const snap = await getDocs(q);
    return snap.size;
  } catch {
    return 0;
  }
}

// ── Bookmarks ────────────────────────────────────────────────────────────────

function bookmarkId(uid: string, postId: string) {
  return `${uid}_${postId}`;
}

export async function isBookmarked(uid: string, postId: string): Promise<boolean> {
  try {
    const snap = await getDoc(doc(db, 'bookmarks', bookmarkId(uid, postId)));
    return snap.exists();
  } catch {
    return false;
  }
}

export async function toggleBookmark(
  uid: string,
  postId: string
): Promise<FirestoreResult<boolean>> {
  try {
    const ref = doc(db, 'bookmarks', bookmarkId(uid, postId));
    const snap = await getDoc(ref);
    if (snap.exists()) {
      await deleteDoc(ref);
      return { data: false, error: null };
    }
    await setDoc(ref, { uid, postId, createdAt: serverTimestamp() });
    return { data: true, error: null };
  } catch (e) {
    return { data: null, error: friendlyError(e) };
  }
}

export async function getUserBookmarks(uid: string): Promise<string[]> {
  try {
    const q = query(collection(db, 'bookmarks'), where('uid', '==', uid));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data().postId as string);
  } catch {
    return [];
  }
}
