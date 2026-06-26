'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { upsertUser } from '@/lib/firestore';

// Firebase auth error codes that should be silently ignored
const SILENT_AUTH_ERRORS = new Set([
  'auth/popup-closed-by-user',
  'auth/cancelled-popup-request',
  'auth/popup-blocked',
]);

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (name: string, email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const result = await signInWithPopup(auth, googleProvider);
    // Best-effort: if Firestore rules block writes, don't crash sign-in
    try {
      await upsertUser({
        uid: result.user.uid,
        name: result.user.displayName ?? 'Anonymous',
        email: result.user.email ?? '',
        photoURL: result.user.photoURL ?? '',
        bio: '',
      });
    } catch {
      // Firestore write failed (e.g. rules not deployed yet) — auth still succeeds
    }
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  }, []);

  const signUpWithEmail = useCallback(
    async (name: string, email: string, password: string) => {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: name });
      try {
        await upsertUser({
          uid: result.user.uid,
          name,
          email,
          photoURL: '',
          bio: '',
        });
      } catch {
        // Best-effort Firestore write
      }
    },
    []
  );

  const resetPassword = useCallback(async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        resetPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

export { SILENT_AUTH_ERRORS };
