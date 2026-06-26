import type { Metadata } from 'next';
import { AboutPage } from '@/components/pages/AboutPage';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Blogify - a premium blogging platform for curious minds',
};

export default function About() {
  return <AboutPage />;
}
