'use client';

import { cn } from '@/lib/utils';

export interface ProgressRingProps {
    value: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
    label?: string;
    sublabel?: string;
    className?: string;
}

export function ProgressRing({
    value,
    size = 84,
    strokeWidth = 6,
    color = 'var(--color-primary)',
    label,
    sublabel,
    className,
}: ProgressRingProps) {
    const pct = Math.min(100, Math.max(0, value));
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (pct / 100) * circumference;

    return (
        <div
            className={cn('relative shrink-0', className)}
            style={{ width: size, height: size }}
        >
            <svg width={size} height={size} className="-rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className="transition-[stroke-dashoffset] duration-500 ease-out motion-reduce:transition-none"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold" style={{ color }}>
                    {Math.round(pct)}%
                </span>
                {sublabel && (
                    <span className="text-[9px] text-[var(--color-text-muted)]">
                        {sublabel}
                    </span>
                )}
                {label && !sublabel && (
                    <span className="text-[10px] text-[var(--color-text-muted)]">
                        {label}
                    </span>
                )}
            </div>
        </div>
    );
}
