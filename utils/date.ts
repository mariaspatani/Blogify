import { format, formatDistanceToNow as fDTN } from 'date-fns';

export function formatDate(dateString: string): string {
  return format(new Date(dateString), 'MMM d, yyyy');
}

export function formatDistanceToNow(dateString: string): string {
  return fDTN(new Date(dateString), { addSuffix: true });
}
