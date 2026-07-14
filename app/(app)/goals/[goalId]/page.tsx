'use client';

import Link from 'next/link';
import { use } from 'react';
import { ArrowLeft, Check, MoreHorizontal } from 'lucide-react';
import { useGoal, useRoadmaps, useTasks } from '@/hooks';
import { addDays, todayUtc } from '@/lib/timezone';
import { ProgressRing } from '@/components/shared/progress-ring';
import { SectionLabel } from '@/components/shared/section-label';
import { PillTag } from '@/components/shared/pill-tag';

export default function GoalDetailPage({
    params,
}: {
    params: Promise<{ goalId: string }>;
}) {
    const { goalId } = use(params);
    const { data: goal } = useGoal(goalId);
    const { data: roadmaps = [] } = useRoadmaps(goalId);
    const today = todayUtc();
    const { data: upcomingTasks = [] } = useTasks(today, addDays(today, 14));

    if (!goal) {
        return (
            <div className="animate-pulse h-40 rounded-[var(--radius-card)] bg-[var(--color-surface)]" />
        );
    }

    const activeWeek =
        roadmaps.find(r => r.status === 'active')?.week_number ?? 1;
    const weeksLeft = (goal.target_weeks ?? 8) - activeWeek;
    const nextTasks = upcomingTasks
        .filter(task => task.goal_id === goalId && task.status === 'pending')
        .slice(0, 4);

    return (
        <div className="pb-8">
            <div className="mb-4 flex items-center gap-3">
                <Link
                    href="/goals"
                    className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-white/[0.05]"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <span className="text-[17px] font-semibold">{goal.title}</span>
                <button
                    type="button"
                    className="ml-auto flex h-[30px] w-[30px] items-center justify-center rounded-full bg-white/[0.05]"
                >
                    <MoreHorizontal className="h-4 w-4 text-[var(--color-text-secondary)]" />
                </button>
            </div>

            <div className="mb-6 flex items-center gap-5 lg:mb-8">
                <ProgressRing
                    value={goal.progress_pct}
                    size={90}
                    strokeWidth={7}
                    color={goal.color_token}
                    label="complete"
                />
                <div>
                    <p className="text-2xl font-bold tracking-tight">
                        Week {activeWeek}
                    </p>
                    <p className="mb-2 text-sm text-[var(--color-text-secondary)]">
                        of {goal.target_weeks ?? 8} · {goal.title}
                    </p>
                    <div className="flex gap-1.5">
                        <span
                            className="rounded-lg px-2.5 py-1 text-xs font-medium"
                            style={{
                                backgroundColor: `color-mix(in srgb, ${goal.color_token} 10%, transparent)`,
                                color: goal.color_token,
                            }}
                        >
                            On track
                        </span>
                        <span className="rounded-lg bg-white/[0.06] px-2.5 py-1 text-xs text-[var(--color-text-secondary)]">
                            {weeksLeft} weeks left
                        </span>
                    </div>
                </div>
            </div>

            <SectionLabel className="mb-3">Roadmap</SectionLabel>
            <div className="space-y-1.5 lg:grid lg:grid-cols-2 lg:gap-2 lg:space-y-0">
                {roadmaps.map(r => {
                    const isActive = r.status === 'active';
                    const isCompleted = r.status === 'completed';
                    return (
                        <div
                            key={r.id}
                            className="flex items-start gap-3 rounded-xl p-3.5"
                            style={{
                                background: isActive
                                    ? 'color-mix(in srgb, var(--color-primary) 10%, transparent)'
                                    : isCompleted
                                      ? 'color-mix(in srgb, var(--color-success) 6%, transparent)'
                                      : 'var(--color-surface)',
                                border: isActive
                                    ? '1.5px solid color-mix(in srgb, var(--color-primary) 30%, transparent)'
                                    : isCompleted
                                      ? '1px solid color-mix(in srgb, var(--color-success) 12%, transparent)'
                                      : '1px solid var(--color-border)',
                            }}
                        >
                            <div
                                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
                                style={
                                    isCompleted
                                        ? {
                                              backgroundColor:
                                                  'var(--color-success)',
                                          }
                                        : isActive
                                          ? {
                                                backgroundColor:
                                                    'var(--color-primary)',
                                            }
                                          : {
                                                border: '2px solid rgba(255,255,255,0.1)',
                                                color: 'var(--color-text-muted)',
                                            }
                                }
                            >
                                {isCompleted ? (
                                    <Check className="h-3.5 w-3.5 text-white" />
                                ) : isActive ? (
                                    <span className="h-2 w-2 rounded-full bg-white" />
                                ) : (
                                    r.week_number
                                )}
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="mb-1 flex items-center gap-1.5">
                                    <p
                                        className={`text-[13px] font-medium ${isCompleted ? 'text-[#6b708a] line-through' : isActive ? 'font-semibold text-[#a5b4fc]' : ''}`}
                                    >
                                        Week {r.week_number} · {r.theme}
                                    </p>
                                    {isActive && (
                                        <span className="rounded bg-[var(--color-primary)] px-1.5 py-0.5 text-[10px] font-semibold text-white">
                                            NOW
                                        </span>
                                    )}
                                </div>
                                {r.sub_topics.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        {r.sub_topics.map(topic => (
                                            <PillTag
                                                key={topic}
                                                color={
                                                    isActive
                                                        ? 'var(--color-primary)'
                                                        : 'var(--color-text-secondary)'
                                                }
                                            >
                                                {topic}
                                            </PillTag>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {nextTasks.length > 0 && (
                <>
                    <SectionLabel className="mt-8 mb-3">
                        Upcoming blocks
                    </SectionLabel>
                    <div className="space-y-2">
                        {nextTasks.map(task => (
                            <div
                                key={task.id}
                                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3.5"
                            >
                                <p className="text-sm font-medium">
                                    {task.title}
                                </p>
                                <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
                                    {task.scheduled_date} at{' '}
                                    {task.start_time.slice(0, 5)}
                                </p>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
