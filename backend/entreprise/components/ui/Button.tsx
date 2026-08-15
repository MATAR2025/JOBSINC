import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'font-medium rounded transition-all duration-200 inline-flex items-center justify-center gap-2 no-underline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'bg-[#0A4F9E] text-white hover:bg-[#082B52] shadow-md hover:shadow-lg',
    secondary: 'bg-[#00A878] text-white hover:bg-[#008560] shadow-md hover:shadow-lg',
    outline: 'border-2 border-[#0A4F9E] text-[#0A4F9E] hover:bg-[#0A4F9E] hover:text-white',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const buttonClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  return (
    <button
      className={buttonClassName}
      {...props}
    >
      {children}
    </button>
  );
}
