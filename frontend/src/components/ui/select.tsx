import * as React from 'react';
import { cn } from '../../lib/cn';

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn('border border-gray-300 rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400', className)}
        {...props}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = 'Select';


