'use client';

import { motion } from 'framer-motion';
import { Breadcrumb } from '@/components/blog/Breadcrumb';
import { ImageWithFallback } from '@/components/ui-custom/ImageWithFallback';
import { Target, Zap, Users, Globe, Award, Heart, BookOpen, PenLine } from 'lucide-react';

const values = [
  { icon: Target, title: 'Purpose-Driven', description: 'Every article is crafted with intention to inform, inspire, and ignite curiosity.' },
  { icon: Zap, title: 'Cutting-Edge', description: 'We cover the latest trends and emerging technologies before they hit mainstream.' },
  { icon: Users, title: 'Community First', description: 'Our readers are our partners. We listen, learn, and grow together.' },
  { icon: Globe, title: 'Global Perspective', description: 'Stories from around the world, bringing diverse voices to the forefront.' },
  { icon: Award, title: 'Quality Over Quantity', description: 'We publish fewer articles, but each one is meticulously researched and edited.' },
  { icon: Heart, title: 'Passion', description: 'We love what we do, and it shows in every word we write.' },
];

const team = [
  { name: 'Sarah Mitchell', role: 'Editor in Chief', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face', bio: 'Technology journalist with a decade of experience covering emerging tech.' },
  { name: 'James Chen', role: 'Tech Lead', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face', bio: 'AI researcher and software engineer passionate about ML and human creativity.' },
  { name: 'Alexandra Kim', role: 'Design Director', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face', bio: 'Award-winning designer shaping the future of digital experiences.' },
  { name: 'Emily Rodriguez', role: 'Travel Editor', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face', bio: 'Digital nomad exploring the world one story at a time.' },
];

export function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      <Breadcrumb items={[{ label: 'About' }]} />

      {/* Hero */}
      <div className="mt-12 text-center max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-center mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
              <PenLine className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground tracking-tight">About Blogify</h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Blogify is a premium blogging platform dedicated to curating and delivering high-quality content
            across technology, design, business, lifestyle, and beyond. We believe in the power of stories to
            inspire, educate, and transform.
          </p>
        </motion.div>
      </div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6"
      >
        {[
          { value: '12K+', label: 'Articles Published' },
          { value: '500K+', label: 'Monthly Readers' },
          { value: '150+', label: 'Contributors' },
          { value: '10', label: 'Categories' },
        ].map((stat) => (
          <div key={stat.label} className="text-center rounded-2xl border border-border bg-card p-6">
            <p className="text-3xl font-bold gradient-text">{stat.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Values */}
      <div className="mt-20">
        <h2 className="text-2xl font-bold text-foreground tracking-tight text-center mb-10">Our Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="rounded-2xl border border-border bg-card p-6 hover:shadow-lg transition-all"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-4">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{value.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{value.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Team */}
      <div className="mt-20">
        <h2 className="text-2xl font-bold text-foreground tracking-tight text-center mb-10">Meet the Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="rounded-2xl border border-border bg-card p-6 text-center hover:shadow-lg transition-all"
            >
              <div className="relative h-20 w-20 rounded-full overflow-hidden mx-auto mb-4 ring-2 ring-border">
                <ImageWithFallback
                  src={member.avatar}
                  alt={member.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
              <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">{member.role}</p>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{member.bio}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
