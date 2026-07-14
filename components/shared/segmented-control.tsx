'use client';

import { cn } from '@/lib/utils';

export interface SegmentedControlProps<T extends string> {
    options: Array<{ value: T; label: string }>;
    value: T;
    onChange: (value: T) => void;
    className?: string;
}

export function SegmentedControl<T extends string>({
    options,
    value,
    onChange,
    className,
}: SegmentedControlProps<T>) {
    return (
        <div
            className={cn(
                'inline-flex gap-0.5 rounded-[10px] bg-[var(--color-surface)] p-[3px]',
                className
            )}
            role="group"
        >
            {options.map(opt => (
                <button
                    key={opt.value}
                    type="button"
                    onClick={() => onChange(opt.value)}
                    className={cn(
                        'min-h-[36px] flex-1 rounded-lg px-4 text-[13px] font-medium transition-colors',
                        value === opt.value
                            ? 'bg-[var(--color-primary)] text-white'
                            : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                    )}
                    aria-pressed={value === opt.value}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
}
