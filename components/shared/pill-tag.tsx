import { cn } from '@/lib/utils';

export interface PillTagProps {
    children: React.ReactNode;
    color?: string;
    className?: string;
}

export function PillTag({
    children,
    color = 'var(--color-primary)',
    className,
}: PillTagProps) {
    return (
        <span
            className={cn('rounded-md px-2 py-0.5 text-[11px]', className)}
            style={{
                backgroundColor: `color-mix(in srgb, ${color} 12%, transparent)`,
                color,
            }}
        >
            {children}
        </span>
    );
}
