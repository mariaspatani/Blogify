'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { X, Mail, Lock, User, Eye, EyeOff, Loader2, Chrome } from 'lucide-react';
import { cn } from '@/lib/utils';

type View = 'signin' | 'signup' | 'reset';

interface AuthModalProps {
  onClose: () => void;
}

export function AuthModal({ onClose }: AuthModalProps) {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword } = useAuth();
  const [view, setView] = useState<View>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const clearState = () => { setError(''); setSuccess(''); };

  const handleGoogle = async () => {
    clearState();
    setLoading(true);
    try {
      await signInWithGoogle();
      onClose();
    } catch (e: unknown) {
      // Silently ignore popup-closed and cancelled-popup errors
      const code = (e as { code?: string })?.code ?? '';
      if (
        code === 'auth/popup-closed-by-user' ||
        code === 'auth/cancelled-popup-request' ||
        code === 'auth/popup-blocked'
      ) {
        // User dismissed the popup — not an error
        return;
      }
      const msg = e instanceof Error ? e.message : 'Google sign-in failed';
      setError(msg.replace('Firebase: ', '').replace(/\(auth\/.*\)\.?/, '').trim());
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearState();
    setLoading(true);
    try {
      if (view === 'signin') {
        await signInWithEmail(email, password);
        onClose();
      } else if (view === 'signup') {
        await signUpWithEmail(name, email, password);
        onClose();
      } else {
        await resetPassword(email);
        setSuccess('Password reset email sent. Check your inbox.');
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Something went wrong';
      setError(msg.replace('Firebase: ', '').replace(/\(auth\/.*\)\.?/, '').trim());
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Authentication"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="w-full max-w-md rounded-2xl bg-card border border-border shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {view === 'signin' && 'Welcome back'}
              {view === 'signup' && 'Create account'}
              {view === 'reset' && 'Reset password'}
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {view === 'signin' && 'Sign in to like, comment and bookmark'}
              {view === 'signup' && 'Join Blogify today'}
              {view === 'reset' && 'We will send you a reset link'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-accent/50 text-muted-foreground transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-6 space-y-4">
          {/* Google */}
          {view !== 'reset' && (
            <>
              <button
                onClick={handleGoogle}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm font-medium text-foreground hover:bg-accent/50 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Chrome className="h-4 w-4 text-[#4285F4]" aria-hidden="true" />
                )}
                Continue with Google
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">or</span>
                <div className="flex-1 h-px bg-border" />
              </div>
            </>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {view === 'signup' && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  required
                  autoComplete="name"
                  className="w-full rounded-xl border border-border bg-secondary/50 pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
                autoComplete={view === 'signup' ? 'email' : 'username'}
                className="w-full rounded-xl border border-border bg-secondary/50 pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>

            {view !== 'reset' && (
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  minLength={6}
                  autoComplete={view === 'signup' ? 'new-password' : 'current-password'}
                  className="w-full rounded-xl border border-border bg-secondary/50 pl-10 pr-10 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            )}

            {error && (
              <p className="text-sm text-red-500 bg-red-500/10 rounded-lg px-3 py-2" role="alert">
                {error}
              </p>
            )}
            {success && (
              <p className="text-sm text-emerald-600 bg-emerald-500/10 rounded-lg px-3 py-2" role="status">
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-indigo-500/20 hover:shadow-xl transition-all disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {view === 'signin' && 'Sign In'}
              {view === 'signup' && 'Create Account'}
              {view === 'reset' && 'Send Reset Link'}
            </button>
          </form>

          {/* Footer links */}
          <div className="flex flex-col items-center gap-2 pt-1">
            {view === 'signin' && (
              <>
                <button
                  onClick={() => { clearState(); setView('reset'); }}
                  className="text-xs text-muted-foreground hover:text-indigo-600 transition-colors"
                >
                  Forgot password?
                </button>
                <p className="text-xs text-muted-foreground">
                  No account?{' '}
                  <button
                    onClick={() => { clearState(); setView('signup'); }}
                    className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                  >
                    Sign up
                  </button>
                </p>
              </>
            )}
            {view === 'signup' && (
              <p className="text-xs text-muted-foreground">
                Already have an account?{' '}
                <button
                  onClick={() => { clearState(); setView('signin'); }}
                  className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                >
                  Sign in
                </button>
              </p>
            )}
            {view === 'reset' && (
              <button
                onClick={() => { clearState(); setView('signin'); }}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Back to sign in
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
