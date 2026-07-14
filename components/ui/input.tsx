import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, error, id, ...props }, ref) => {
        const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

        return (
            <div className="flex flex-col gap-1.5">
                {label ? (
                    <label
                        htmlFor={inputId}
                        className="text-sm font-medium text-[var(--color-text-primary)]"
                    >
                        {label}
                    </label>
                ) : null}
                <input
                    type={type}
                    id={inputId}
                    className={cn(
                        'flex h-11 w-full rounded-[var(--radius-chip)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-[15px] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 disabled:cursor-not-allowed disabled:opacity-50',
                        error && 'border-red-500',
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {error ? <p className="text-sm text-red-500">{error}</p> : null}
            </div>
        );
    }
);
Input.displayName = 'Input';

export { Input };
