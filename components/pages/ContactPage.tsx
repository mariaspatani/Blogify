'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Breadcrumb } from '@/components/blog/Breadcrumb';
import { Mail, MapPin, Phone, Send, Check, Twitter, Github, Linkedin, Instagram } from 'lucide-react';

const socialLinks = [
  { icon: Twitter, label: 'Twitter', href: '#' },
  { icon: Github, label: 'GitHub', href: '#' },
  { icon: Linkedin, label: 'LinkedIn', href: '#' },
  { icon: Instagram, label: 'Instagram', href: '#' },
];

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    // Simulated submission — replace with a real form API (e.g. Resend, Formspree)
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setStatus('success');
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setStatus('idle'), 3000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      <Breadcrumb items={[{ label: 'Contact' }]} />

      <div className="mt-12 grid lg:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Get in Touch</h1>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Have a question, suggestion, or just want to say hello? We would love to hear from
              you. Fill out the form or reach out through any of our channels below.
            </p>
          </motion.div>

          <div className="mt-8 space-y-4">
            {[
              { icon: Mail, label: 'Email', value: 'hello@blogify.app' },
              { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567' },
              {
                icon: MapPin,
                label: 'Address',
                value: '123 Innovation Drive, San Francisco, CA 94102',
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
                  className="flex items-center gap-4 rounded-xl border border-border bg-card p-4"
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600"
                    aria-hidden="true"
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.value}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-8">
            <p className="text-sm font-medium text-foreground mb-4">Follow Us</p>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={`Follow us on ${label}`}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary hover:bg-indigo-500 hover:text-white transition-all"
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-2xl border border-border bg-card p-6 lg:p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-5" aria-label="Contact form">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  autoComplete="name"
                  className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  autoComplete="email"
                  className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                Subject
              </label>
              <input
                id="subject"
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
                className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                placeholder="What is this about?"
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 resize-none transition-all"
                placeholder="Tell us more..."
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-indigo-500/20 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {status === 'loading' ? (
                <>
                  <div
                    className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"
                    aria-hidden="true"
                  />
                  <span>Sending...</span>
                </>
              ) : status === 'success' ? (
                <>
                  <Check className="h-4 w-4" aria-hidden="true" />
                  Message Sent!
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" aria-hidden="true" />
                  Send Message
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
