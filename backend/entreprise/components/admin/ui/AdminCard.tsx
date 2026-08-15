import { HTMLAttributes } from 'react';

export default function AdminCard({ variant = 'default', ...props }: HTMLAttributes<HTMLElement> & { variant?: 'default' | 'interactive' | 'outlined' | 'danger' | 'success' }) {
  return <section {...props} className={`admin-card admin-card-${variant} ${props.className || ''}`} />;
}
