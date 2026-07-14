'use client';

import { Check, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TaskStatus } from '@/types';
import { PillTag } from './pill-tag';

export interface TaskRowProps {
    title: string;
    startTime: string;
    durationMinutes?: number;
    status: TaskStatus;
    color?: string;
    contextLabel?: string;
    subTasks?: string[] | null;
    onToggle?: (status: TaskStatus) => void;
    onReschedule?: () => void;
}

function formatMeta(startTime: string, durationMinutes?: number): string {
    const time = startTime.slice(0, 5);
    if (!durationMinutes) return time;
    return `${time} · ${durationMinutes} min`;
}

export function TaskRow({
    title,
    startTime,
    durationMinutes,
    status,
    color = 'var(--color-primary)',
    subTasks,
    onToggle,
    onReschedule,
}: TaskRowProps) {
    const isDone = status === 'done' || status === 'partial';
    const isMissed = status === 'missed';

    if (isMissed) {
        return (
            <button
                type="button"
                onClick={onReschedule}
                className="mb-2 flex w-full items-start gap-3 rounded-[var(--radius-chip)] border border-[color-mix(in_srgb,var(--color-danger)_13%,transparent)] bg-[color-mix(in_srgb,var(--color-danger)_4%,transparent)] p-3.5 text-left"
                style={{
                    borderLeftWidth: 3,
                    borderLeftColor: 'var(--color-danger)',
                }}
            >
                <div className="mt-0.5 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-2 border-[color-mix(in_srgb,var(--color-danger)_40%,transparent)]">
                    <Clock
                        className="h-3 w-3 text-[var(--color-danger)]"
                        aria-hidden
                    />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="mb-0.5 text-[11px] font-medium text-[var(--color-danger)]">
                        {formatMeta(startTime, durationMinutes)} · Missed
                    </p>
                    <p className="text-[15px] font-medium">{title}</p>
                    <span className="mt-2 inline-flex items-center gap-1 rounded-lg bg-[color-mix(in_srgb,var(--color-danger)_10%,transparent)] px-2.5 py-1 text-xs font-medium text-[var(--color-danger)]">
                        Tap to reschedule
                    </span>
                </div>
            </button>
        );
    }

    return (
        <div
            className={cn(
                'mb-2 flex items-start gap-3 rounded-[var(--radius-chip)] border border-white/[0.04] bg-[var(--color-surface)] p-3.5 transition-opacity',
                isDone && 'opacity-60'
            )}
            style={{ borderLeftWidth: 3, borderLeftColor: color }}
        >
            <button
                type="button"
                onClick={() =>
                    onToggle?.(status === 'done' ? 'pending' : 'done')
                }
                className={cn(
                    'mt-0.5 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-2 transition-all',
                    isDone
                        ? 'border-[var(--color-success)] bg-[var(--color-success)]'
                        : 'border-white/20'
                )}
                style={
                    isDone
                        ? { borderColor: color, backgroundColor: color }
                        : undefined
                }
                aria-label={isDone ? 'Mark incomplete' : 'Mark complete'}
            >
                {isDone && <Check className="h-3 w-3 text-white" aria-hidden />}
            </button>
            <div className="min-w-0 flex-1">
                <p className="mb-0.5 text-[11px] text-[var(--color-text-muted)]">
                    {formatMeta(startTime, durationMinutes)}
                </p>
                <p
                    className={cn(
                        'text-[15px] font-medium',
                        isDone && 'text-[#6b708a] line-through'
                    )}
                >
                    {title}
                </p>
                {subTasks && subTasks.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                        {subTasks.map(st => (
                            <PillTag key={st} color={color}>
                                {st}
                            </PillTag>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
