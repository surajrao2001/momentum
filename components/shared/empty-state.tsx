'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
    title: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
    className?: string;
}

export function EmptyState({
    title,
    description,
    actionLabel,
    onAction,
    className,
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center rounded-[var(--radius-card)] border border-dashed border-[var(--color-border)] bg-[var(--color-surface-muted)] px-6 py-12 text-center',
                className
            )}
        >
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                {title}
            </h3>
            {description && (
                <p className="mt-2 max-w-sm text-[15px] text-[var(--color-text-secondary)]">
                    {description}
                </p>
            )}
            {actionLabel && onAction && (
                <Button className="mt-6" onClick={onAction}>
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}
