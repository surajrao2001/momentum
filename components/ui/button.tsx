import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
    {
        variants: {
            variant: {
                primary:
                    'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]',
                secondary:
                    'border border-[var(--color-border)] bg-white/[0.05] text-[var(--color-text-secondary)] hover:bg-white/[0.08]',
                ghost: 'bg-transparent text-[var(--color-text-primary)] hover:bg-[var(--color-surface-muted)]',
                destructive: 'bg-red-600 text-white hover:bg-red-700',
            },
            size: {
                sm: 'h-9 rounded-[var(--radius-chip)] px-3 text-sm',
                md: 'min-h-11 min-w-11 rounded-[var(--radius-button)] px-4 text-[15px]',
                lg: 'h-12 rounded-[var(--radius-button)] px-6 text-base',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'md',
        },
    }
);

export interface ButtonProps
    extends
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant,
            size,
            asChild = false,
            isLoading,
            disabled,
            children,
            ...props
        },
        ref
    ) => {
        const Comp = asChild ? Slot : 'button';
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading ? 'Loading…' : children}
            </Comp>
        );
    }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
