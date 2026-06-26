'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Mail, Check, ArrowRight, Sparkles } from 'lucide-react';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setStatus('success');
    setEmail('');
    setTimeout(() => setStatus('idle'), 3000);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 p-8 lg:p-12">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="relative grid lg:grid-cols-2 gap-8 items-center">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-medium text-white/80">Weekly Newsletter</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
            Stay Ahead of the Curve
          </h2>
          <p className="mt-3 text-white/70 leading-relaxed max-w-md">
            Get curated insights on technology, design, and innovation delivered to your inbox every week. No spam, just quality content.
          </p>
        </div>

        <div>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === 'error') setStatus('idle');
                }}
                placeholder="Enter your email"
                className="w-full rounded-xl bg-white/10 border border-white/20 pl-10 pr-4 py-3 text-white placeholder:text-white/50 outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all"
                aria-label="Email address"
                disabled={status === 'loading'}
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className={cn(
                'inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-medium transition-all',
                status === 'success'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white text-indigo-600 hover:bg-white/90 shadow-lg'
              )}
            >
              {status === 'loading' ? (
                <div className="h-4 w-4 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
              ) : status === 'success' ? (
                <>
                  <Check className="h-4 w-4" />
                  Subscribed!
                </>
              ) : (
                <>
                  Subscribe
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
          {status === 'error' && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-sm text-red-300"
            >
              {errorMessage}
            </motion.p>
          )}
          <p className="mt-3 text-xs text-white/50">
            Join 25,000+ readers. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
