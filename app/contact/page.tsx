import type { Metadata } from 'next';
import { ContactPage } from '@/components/pages/ContactPage';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with the Blogify team',
};

export default function Contact() {
  return <ContactPage />;
}
