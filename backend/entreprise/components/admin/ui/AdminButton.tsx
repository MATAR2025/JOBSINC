import { ButtonHTMLAttributes } from 'react';

export default function AdminButton({ variant = 'primary', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' }) {
  return <button {...props} className={`admin-button admin-button-${variant} ${props.className || ''}`} />;
}
