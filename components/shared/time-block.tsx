'use client';

import { cn } from '@/lib/utils';

export interface TimeBlockProps {
    title: string;
    subtitle?: string;
    startTime: string;
    durationMinutes: number;
    color?: string;
    completed?: boolean;
    onClick?: () => void;
    onToggleComplete?: (completed: boolean) => void;
    className?: string;
}

function formatTimeRange(startTime: string, durationMinutes: number): string {
    const [h, m] = startTime.slice(0, 5).split(':').map(Number);
    const totalMinutes = h * 60 + m + durationMinutes;
    const endH = Math.floor(totalMinutes / 60) % 24;
    const endM = totalMinutes % 60;
    const start = startTime.slice(0, 5);
    const end = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
    return `${start} – ${end}`;
}

export function TimeBlock({
    title,
    subtitle,
    startTime,
    durationMinutes,
    color = 'var(--color-primary)',
    completed,
    onClick,
    onToggleComplete,
    className,
}: TimeBlockProps) {
    const timeRange = formatTimeRange(startTime, durationMinutes);
    const interactive = Boolean(onClick);

    return (
        <div
            role={interactive ? 'button' : undefined}
            tabIndex={interactive ? 0 : undefined}
            onClick={onClick}
            onKeyDown={
                interactive
                    ? e => {
                          if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              onClick?.();
                          }
                      }
                    : undefined
            }
            className={cn(
                'w-full rounded-[var(--radius-chip)] border border-[var(--color-border)] bg-[var(--color-surface)] p-2 text-left transition-colors',
                interactive &&
                    'cursor-pointer hover:bg-[var(--color-surface-muted)]',
                className
            )}
        >
            <div className="flex items-start gap-2">
                {onToggleComplete && (
                    <button
                        type="button"
                        onClick={e => {
                            e.stopPropagation();
                            onToggleComplete(!completed);
                        }}
                        className={cn(
                            'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px] transition-colors',
                            completed
                                ? 'border-[var(--color-success)] bg-[var(--color-success)] text-white'
                                : 'border-[var(--color-border)]'
                        )}
                        aria-label={
                            completed ? 'Mark incomplete' : 'Mark complete'
                        }
                    >
                        {completed && '✓'}
                    </button>
                )}
                <div className="min-w-0 flex-1">
                    <p
                        className={cn(
                            'truncate text-xs font-medium text-[var(--color-text-primary)]',
                            completed && 'opacity-60 line-through'
                        )}
                    >
                        {title}
                    </p>
                    {subtitle && (
                        <p className="truncate text-[11px] text-[var(--color-text-secondary)]">
                            {subtitle}
                        </p>
                    )}
                    <p className="text-[11px] text-[var(--color-text-secondary)]">
                        {timeRange}
                    </p>
                </div>
                <div
                    className="w-1 shrink-0 self-stretch rounded-full"
                    style={{ backgroundColor: color }}
                />
            </div>
        </div>
    );
}
