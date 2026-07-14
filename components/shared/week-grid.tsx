'use client';

import type { PlanPreviewBlock } from '@/types';
import { DAYS_OF_WEEK } from '@/types';

export interface WeekGridProps {
    blocks: PlanPreviewBlock[];
    onBlockClick?: (block: PlanPreviewBlock) => void;
}

const DAY_LABELS: Record<string, string> = {
    mon: 'MON',
    tue: 'TUE',
    wed: 'WED',
    thu: 'THU',
    fri: 'FRI',
    sat: 'SAT',
    sun: 'SUN',
};

export function WeekGrid({ blocks, onBlockClick }: WeekGridProps) {
    return (
        <div className="overflow-x-auto pb-2">
            <div className="min-w-[550px]">
                <div className="mb-2 grid grid-cols-7 gap-1 px-0.5">
                    {DAYS_OF_WEEK.map(day => (
                        <p
                            key={day}
                            className={`text-center text-[11px] font-semibold ${day === 'sun' ? 'text-[var(--color-text-muted)]' : 'text-[var(--color-text-secondary)]'}`}
                        >
                            {DAY_LABELS[day]}
                        </p>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {DAYS_OF_WEEK.map(day => {
                        const dayBlocks = blocks
                            .filter(b => b.day === day)
                            .sort((a, b) =>
                                a.start_time.localeCompare(b.start_time)
                            );
                        return (
                            <div
                                key={day}
                                className={`flex flex-col gap-0.5 ${day === 'sun' ? 'opacity-45' : ''}`}
                            >
                                {dayBlocks.map(block => {
                                    const shortTitle =
                                        block.title.length > 12
                                            ? `${block.title.slice(0, 10)}…`
                                            : block.title;
                                    const time = block.start_time
                                        .slice(0, 5)
                                        .replace(':00', '')
                                        .replace(':30', '.5');
                                    return (
                                        <button
                                            key={block.id}
                                            type="button"
                                            onClick={() =>
                                                onBlockClick?.(block)
                                            }
                                            className="rounded-[5px] px-1.5 py-1 text-left text-[9.5px] font-medium transition-opacity hover:opacity-80"
                                            style={{
                                                backgroundColor: `color-mix(in srgb, ${block.color_token} 18%, transparent)`,
                                                borderLeft: `3px solid ${block.color_token}`,
                                                color: block.color_token,
                                            }}
                                        >
                                            {shortTitle} {time}
                                        </button>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
