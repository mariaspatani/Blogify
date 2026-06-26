export interface BlogPost {
  id: string;
  title: string;
  description: string;
  content: string;
  coverImage: string;
  category: string;
  author: string;
  authorAvatar: string;
  publishDate: string;
  readingTime: number;
  likes: number;
  views: number;
  tags: string[];
  featured: boolean;
  trending: boolean;
}

export interface Author {
  name: string;
  avatar: string;
  bio: string;
  role: string;
}

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  date: string;
  likes: number;
}

export type Category =
  | 'Technology'
  | 'Artificial Intelligence'
  | 'Programming'
  | 'Business'
  | 'Design'
  | 'Travel'
  | 'Lifestyle'
  | 'Health'
  | 'Education'
  | 'Science';

export const CATEGORIES: Category[] = [
  'Technology',
  'Artificial Intelligence',
  'Programming',
  'Business',
  'Design',
  'Travel',
  'Lifestyle',
  'Health',
  'Education',
  'Science',
];

export const CATEGORY_COLORS: Record<string, string> = {
  Technology: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
  'Artificial Intelligence': 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  Programming: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  Business: 'bg-slate-500/10 text-slate-600 border-slate-500/20',
  Design: 'bg-pink-500/10 text-pink-600 border-pink-500/20',
  Travel: 'bg-sky-500/10 text-sky-600 border-sky-500/20',
  Lifestyle: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  Health: 'bg-teal-500/10 text-teal-600 border-teal-500/20',
  Education: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  Science: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
};
