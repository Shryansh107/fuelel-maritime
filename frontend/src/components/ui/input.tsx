import * as React from 'react';
import { cn } from '../../lib/cn';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn('h-9 border border-gray-300 rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400', className)}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';


