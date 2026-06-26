'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Newsletter } from '@/components/sections/Newsletter';
import { cn } from '@/lib/utils';
import {
  PenLine,
  Twitter,
  Github,
  Linkedin,
  Instagram,
  ArrowUpRight,
  Heart,
} from 'lucide-react';

const footerLinks = {
  company: [
    { label: 'About', href: '/about' },
    { label: 'Careers', href: '#' },
    { label: 'Press', href: '#' },
    { label: 'Partners', href: '#' },
  ],
  resources: [
    { label: 'Blog', href: '/' },
    { label: 'Newsletter', href: '/#newsletter' },
    { label: 'Help Center', href: '#' },
    { label: 'Contact', href: '/contact' },
  ],
  categories: [
    { label: 'Technology', href: '/categories/technology' },
    { label: 'AI & Machine Learning', href: '/categories/artificial-intelligence' },
    { label: 'Programming', href: '/categories/programming' },
    { label: 'Business', href: '/categories/business' },
    { label: 'Design', href: '/categories/design' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy', href: '#' },
  ],
};

const socialLinks = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Instagram, href: '#', label: 'Instagram' },
];

export function Footer() {
  return (
    <footer className="relative border-t border-border bg-gradient-to-b from-background to-muted/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div className="py-16">
          <Newsletter />
        </div>

        {/* Main Footer */}
        <div className="border-t border-border py-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-6">
            {/* Brand */}
            <div className="col-span-2 lg:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
                  <PenLine className="h-4 w-4 text-white" />
                </div>
                <span className="text-xl font-bold gradient-text">Blogify</span>
              </Link>
              <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                A premium blogging platform featuring curated articles on technology, design, business, and lifestyle.
              </p>
              <div className="flex items-center gap-3 mt-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/80 text-muted-foreground hover:bg-indigo-500 hover:text-white transition-all"
                      aria-label={social.label}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Company</h4>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group"
                    >
                      {link.label}
                      <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Resources</h4>
              <ul className="space-y-2">
                {footerLinks.resources.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group"
                    >
                      {link.label}
                      <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Categories</h4>
              <ul className="space-y-2">
                {footerLinks.categories.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group"
                    >
                      {link.label}
                      <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Legal</h4>
              <ul className="space-y-2">
                {footerLinks.legal.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group"
                    >
                      {link.label}
                      <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border py-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Blogify. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Crafted with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> for curious minds
          </p>
        </div>
      </div>
    </footer>
  );
}
