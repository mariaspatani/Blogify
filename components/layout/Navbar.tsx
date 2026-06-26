'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';
import { SearchBar } from './SearchBar';
import { AuthModal } from '@/components/auth/AuthModal';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import {
  Menu,
  X,
  Home,
  Grid3X3,
  Flame,
  Info,
  Mail,
  PenLine,
  Search,
  LogOut,
  LogIn,
  SquarePen,
  FileText,
} from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/categories', label: 'Categories', icon: Grid3X3 },
  { href: '/trending', label: 'Trending', icon: Flame },
  { href: '/about', label: 'About', icon: Info },
  { href: '/contact', label: 'Contact', icon: Mail },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'glass shadow-lg shadow-black/5'
            : 'bg-transparent'
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between lg:h-18">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group" aria-label="Blogify Home">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
                <PenLine className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight gradient-text">
                Blogify
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href || pathname?.startsWith(link.href + '/');
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="hidden lg:flex items-center gap-2 rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm text-muted-foreground transition-all hover:bg-accent/50 hover:text-foreground"
                aria-label="Open search"
              >
                <Search className="h-4 w-4" />
                <span className="hidden xl:inline">Search...</span>
                <kbd className="hidden xl:inline-flex items-center rounded border border-border bg-muted px-1.5 py-0.5 text-xs font-medium">
                  ⌘K
                </kbd>
              </button>
              <ThemeToggle />

              {/* Auth */}
              {user ? (
                <div className="relative flex items-center gap-2">
                  {/* Write button — desktop */}
                  <Link
                    href="/write"
                    className="hidden lg:inline-flex items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 transition-all"
                    aria-label="Write a post"
                  >
                    <SquarePen className="h-4 w-4" aria-hidden="true" />
                    Write
                  </Link>
                  <button
                    onClick={() => setUserMenuOpen((v) => !v)}
                    className="flex items-center justify-center h-9 w-9 rounded-full overflow-hidden ring-2 ring-border hover:ring-indigo-500 transition-all"
                    aria-label="User menu"
                    aria-expanded={userMenuOpen}
                  >
                    {user.photoURL ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={user.photoURL} alt={user.displayName ?? 'User'} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                        {(user.displayName ?? user.email ?? 'U')[0].toUpperCase()}
                      </div>
                    )}
                  </button>
                  <AnimatePresence>
                    {userMenuOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} aria-hidden="true" />
                        <motion.div
                          initial={{ opacity: 0, y: 6, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-11 z-20 w-52 rounded-xl border border-border bg-card shadow-xl overflow-hidden"
                        >
                          <div className="px-4 py-3 border-b border-border">
                            <p className="text-sm font-medium text-foreground truncate">{user.displayName ?? 'User'}</p>
                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                          </div>
                          <Link
                            href="/my-posts"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex w-full items-center gap-2 px-4 py-3 text-sm text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-colors"
                          >
                            <FileText className="h-4 w-4" aria-hidden="true" />
                            My Posts
                          </Link>
                          <Link
                            href="/write"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex w-full items-center gap-2 px-4 py-3 text-sm text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-colors"
                          >
                            <SquarePen className="h-4 w-4" aria-hidden="true" />
                            Write a Post
                          </Link>
                          <div className="border-t border-border" />
                          <button
                            onClick={async () => { setUserMenuOpen(false); await logout(); }}
                            className="flex w-full items-center gap-2 px-4 py-3 text-sm text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-colors"
                          >
                            <LogOut className="h-4 w-4" aria-hidden="true" />
                            Sign out
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="hidden lg:flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-500/20 hover:shadow-xl transition-all"
                  aria-label="Sign in"
                >
                  <LogIn className="h-4 w-4" aria-hidden="true" />
                  Sign In
                </button>
              )}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden flex items-center justify-center rounded-lg p-2 text-foreground hover:bg-accent/50"
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMobileMenuOpen}
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="h-5 w-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 z-50 h-full w-80 max-w-[85vw] bg-card border-l border-border shadow-2xl"
              role="dialog"
              aria-label="Mobile menu"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                    <PenLine className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xl font-bold gradient-text">Blogify</span>
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-lg p-2 hover:bg-accent/50"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-4">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsSearchOpen(true);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-2.5 text-sm text-muted-foreground mb-4"
                >
                  <Search className="h-4 w-4" />
                  Search articles...
                </button>
                {!user && (
                  <button
                    onClick={() => { setIsMobileMenuOpen(false); setIsAuthOpen(true); }}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-2.5 text-sm font-medium text-white"
                  >
                    <LogIn className="h-4 w-4" aria-hidden="true" />
                    Sign In
                  </button>
                )}
                {user && (
                  <Link
                    href="/write"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 px-3 py-2.5 text-sm font-medium text-indigo-600 dark:text-indigo-400"
                  >
                    <SquarePen className="h-4 w-4" aria-hidden="true" />
                    Write a Post
                  </Link>
                )}
              </div>
              <nav className="flex flex-col px-4 gap-1">
                {navLinks.map((link, index) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all',
                          isActive
                            ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                        )}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Icon className="h-4 w-4" />
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <SearchBar onClose={() => setIsSearchOpen(false)} />
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      <AnimatePresence>
        {isAuthOpen && <AuthModal onClose={() => setIsAuthOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
