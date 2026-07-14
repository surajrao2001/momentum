'use client';

import { cn } from '@/lib/utils';

export function ToggleSwitch({
    checked,
    onChange,
    className,
}: {
    checked: boolean;
    onChange: (checked: boolean) => void;
    className?: string;
}) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={cn(
                'relative h-[26px] w-[44px] shrink-0 rounded-full transition-colors',
                checked ? 'bg-[var(--color-primary)]' : 'bg-white/15',
                className
            )}
        >
            <span
                className={cn(
                    'absolute top-[3px] h-5 w-5 rounded-full bg-white transition-all',
                    checked ? 'right-[3px]' : 'left-[3px]'
                )}
            />
        </button>
    );
}
