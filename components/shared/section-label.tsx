import { cn } from '@/lib/utils';

export function SectionLabel({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <p
            className={cn(
                'text-[10px] font-semibold tracking-[0.07em] text-[var(--color-text-muted)] uppercase',
                className
            )}
        >
            {children}
        </p>
    );
}
