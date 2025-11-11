import * as React from 'react';
import { cn } from '../../lib/cn';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'secondary' | 'destructive' | 'success' | 'ghost' | 'outline';
  size?: 'sm' | 'md';
};

const base = 'inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';
const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
  default: 'bg-gray-900 text-white hover:bg-gray-800 focus-visible:ring-gray-400',
  secondary: 'bg-white text-gray-900 hover:bg-gray-50 focus-visible:ring-gray-300',
  destructive: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-300',
  success: 'bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-300',
  ghost: 'bg-transparent text-gray-900 hover:bg-gray-100 focus-visible:ring-gray-300',
  outline: 'border border-gray-300 text-gray-900 hover:bg-gray-100 focus-visible:ring-gray-300',
};
const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'h-8',
  md: 'h-9',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    return <button ref={ref} className={cn(base, variants[variant], sizes[size], className)} {...props} />;
  }
);
Button.displayName = 'Button';


