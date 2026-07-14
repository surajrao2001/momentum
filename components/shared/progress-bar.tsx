import { cn } from '@/lib/utils';

export interface ProgressBarProps {
    value: number;
    max?: number;
    label?: string;
    color?: string;
    showPercent?: boolean;
    className?: string;
    height?: 'sm' | 'md';
}

export function ProgressBar({
    value,
    max = 100,
    label,
    color = 'var(--color-primary)',
    showPercent = true,
    className,
    height = 'sm',
}: ProgressBarProps) {
    const pct = Math.min(100, Math.max(0, (value / max) * 100));
    return (
        <div className={cn('w-full', className)}>
            {(label || showPercent) && (
                <div className="mb-1 flex items-center justify-between">
                    {label && <span className="text-[13px]">{label}</span>}
                    {showPercent && (
                        <span
                            className="text-xs font-semibold"
                            style={{ color }}
                        >
                            {Math.round(pct)}%
                        </span>
                    )}
                </div>
            )}
            <div
                className={cn(
                    'w-full overflow-hidden rounded-sm bg-white/[0.07]',
                    height === 'sm' ? 'h-[5px]' : 'h-2'
                )}
                role="progressbar"
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
            >
                <div
                    className="h-full rounded-sm transition-[width] duration-400 ease-out motion-reduce:transition-none"
                    style={{ width: `${pct}%`, backgroundColor: color }}
                />
            </div>
        </div>
    );
}
