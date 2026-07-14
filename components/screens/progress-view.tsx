'use client';

import { useHeatmap, useProgressOverview } from '@/hooks';
import { ProgressBar } from '@/components/shared/progress-bar';
import { SectionLabel } from '@/components/shared/section-label';
import { SegmentedControl } from '@/components/shared/segmented-control';
import { useState } from 'react';

export function ProgressView() {
    const { data: progress } = useProgressOverview();
    const { data: heatmap = [] } = useHeatmap(84);
    const [period, setPeriod] = useState<'weekly' | 'monthly' | 'all'>(
        'weekly'
    );

    const overallPct = progress?.overall_pct ?? 0;

    return (
        <div className="space-y-3 lg:max-w-2xl">
            <h1 className="text-[22px] font-bold tracking-tight">Progress</h1>

            <SegmentedControl
                className="w-full"
                options={[
                    { value: 'weekly', label: 'Weekly' },
                    { value: 'monthly', label: 'Monthly' },
                    { value: 'all', label: 'All-time' },
                ]}
                value={period}
                onChange={setPeriod}
            />

            <div className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                <SectionLabel className="mb-3">This period</SectionLabel>
                <div className="mb-1 flex items-baseline gap-1.5">
                    <span className="text-[32px] font-bold text-[var(--color-primary)]">
                        {Math.round(overallPct)}%
                    </span>
                    <span className="text-sm text-[var(--color-text-secondary)]">
                        complete
                    </span>
                </div>
                {progress && (
                    <div className="mt-3 flex gap-2">
                        {progress.goals.slice(0, 3).map(g => (
                            <div
                                key={g.goal_id}
                                className="flex-1 rounded-[10px] border p-2.5 text-center"
                                style={{
                                    backgroundColor: `color-mix(in srgb, ${g.color_token} 8%, transparent)`,
                                    borderColor: `color-mix(in srgb, ${g.color_token} 12%, transparent)`,
                                }}
                            >
                                <div
                                    className="text-base font-bold"
                                    style={{ color: g.color_token }}
                                >
                                    {Math.round(g.progress_pct)}%
                                </div>
                                <div className="mt-0.5 text-[11px] text-[var(--color-text-muted)]">
                                    {g.icon} {g.title.split(' ')[0]}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                <SectionLabel className="mb-3">
                    Consistency · last 12 weeks
                </SectionLabel>
                <div className="flex flex-wrap gap-0.5">
                    {heatmap.slice(-84).map(d => {
                        const opacity = d.completion_pct / 100;
                        const bg =
                            opacity < 0.15
                                ? 'rgba(129,140,248,0.07)'
                                : opacity < 0.35
                                  ? 'rgba(129,140,248,0.2)'
                                  : opacity < 0.6
                                    ? 'rgba(129,140,248,0.42)'
                                    : opacity < 0.8
                                      ? 'rgba(129,140,248,0.7)'
                                      : '#818CF8';
                        return (
                            <div
                                key={d.date}
                                title={`${d.date}: ${d.completion_pct}%`}
                                className="h-[13px] w-[13px] shrink-0 rounded-sm"
                                style={{ backgroundColor: bg }}
                            />
                        );
                    })}
                </div>
            </div>

            {progress && (
                <div className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                    <SectionLabel className="mb-3.5">
                        This week vs goal
                    </SectionLabel>
                    {progress.goals.map(g => (
                        <ProgressBar
                            key={g.goal_id}
                            label={`${g.icon} ${g.title}`}
                            value={g.progress_pct}
                            color={g.color_token}
                            height="md"
                            className="mb-2.5 last:mb-0"
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
