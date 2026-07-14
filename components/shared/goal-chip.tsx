'use client';

import { cn } from '@/lib/utils';

export interface GoalChipProps {
    icon: string;
    label: string;
    description?: string;
    selected?: boolean;
    disabled?: boolean;
    dashed?: boolean;
    onClick?: () => void;
}

export function GoalChip({
    icon,
    label,
    description,
    selected,
    disabled,
    dashed,
    onClick,
}: GoalChipProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={cn(
                'mb-2.5 flex w-full min-h-[44px] items-center gap-2.5 rounded-[var(--radius-chip)] border-[1.5px] px-3.5 py-3 text-left transition-all',
                dashed
                    ? 'border-dashed border-[var(--color-border-strong)]'
                    : 'border-[var(--color-border-strong)]',
                selected
                    ? 'border-[var(--color-primary)] bg-[color-mix(in_srgb,var(--color-primary)_12%,transparent)]'
                    : 'bg-transparent hover:border-[var(--color-primary)]/40',
                disabled && 'cursor-not-allowed opacity-50'
            )}
            aria-pressed={selected}
        >
            <span className="text-[21px]" aria-hidden>
                {icon}
            </span>
            <div className="min-w-0 flex-1">
                <div className="text-[15px] font-medium">{label}</div>
                {description && (
                    <div className="text-xs text-[var(--color-text-secondary)]">
                        {description}
                    </div>
                )}
            </div>
            {selected && (
                <span className="text-[var(--color-primary)]" aria-hidden>
                    ✓
                </span>
            )}
        </button>
    );
}
