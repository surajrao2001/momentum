'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronRight, Plus } from 'lucide-react';
import { useCreateGoal, useGoals, useTasks } from '@/hooks';
import { GOAL_COLORS } from '@/types';
import { todayUtc, addDays } from '@/lib/timezone';
import { ProgressRing } from '@/components/shared/progress-ring';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';

export default function GoalsPage() {
    const { data: goals = [], isLoading } = useGoals();
    const today = todayUtc();
    const { data: upcomingTasks = [] } = useTasks(today, addDays(today, 14));
    const createGoal = useCreateGoal();
    const [showCreate, setShowCreate] = useState(false);
    const [title, setTitle] = useState('');
    const [icon, setIcon] = useState('🎯');

    const getNextTask = (goalId: string) =>
        upcomingTasks
            .filter(t => t.goal_id === goalId && t.status === 'pending')
            .sort((a, b) =>
                `${a.scheduled_date}T${a.start_time}`.localeCompare(
                    `${b.scheduled_date}T${b.start_time}`
                )
            )[0];

    const handleCreate = async () => {
        if (!title.trim()) return;
        await createGoal.mutateAsync({
            title,
            icon,
            color_token: GOAL_COLORS[goals.length % GOAL_COLORS.length],
            category_type: 'custom',
            target_weeks: 8,
            weekly_hour_allocation: 4,
            status: 'active',
            started_at: today,
        });
        setShowCreate(false);
        setTitle('');
    };

    if (isLoading) {
        return (
            <div className="animate-pulse space-y-3">
                {[1, 2, 3].map(i => (
                    <div
                        key={i}
                        className="h-28 rounded-[var(--radius-card)] bg-[var(--color-surface)]"
                    />
                ))}
            </div>
        );
    }

    return (
        <div>
            <div className="mb-5 flex items-center justify-between">
                <h1 className="text-[22px] font-bold tracking-tight">Goals</h1>
                <button
                    type="button"
                    onClick={() => setShowCreate(true)}
                    className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[var(--color-primary)]"
                    aria-label="Add goal"
                >
                    <Plus className="h-[18px] w-[18px] text-white" />
                </button>
            </div>

            <div className="space-y-2.5 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
                {goals.map(g => {
                    const nextTask = getNextTask(g.id);
                    return (
                        <Link
                            key={g.id}
                            href={`/goals/${g.id}`}
                            className="block rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface)] p-[18px] transition-colors hover:border-[var(--color-primary)]/20"
                        >
                            <div className="flex items-start gap-3.5">
                                <ProgressRing
                                    value={g.progress_pct}
                                    size={60}
                                    strokeWidth={5}
                                    color={g.color_token}
                                />
                                <div className="min-w-0 flex-1">
                                    <div className="mb-1 flex items-center gap-2">
                                        <span className="text-base">
                                            {g.icon}
                                        </span>
                                        <span className="text-base font-semibold">
                                            {g.title}
                                        </span>
                                    </div>
                                    <p className="mb-2 text-xs text-[var(--color-text-muted)]">
                                        Week{' '}
                                        {Math.max(
                                            1,
                                            Math.ceil(
                                                (g.progress_pct / 100) *
                                                    (g.target_weeks ?? 8)
                                            )
                                        )}{' '}
                                        of {g.target_weeks ?? 8}
                                    </p>
                                    {nextTask && (
                                        <span
                                            className="inline-block rounded-lg px-2.5 py-1.5 text-xs font-medium"
                                            style={{
                                                backgroundColor: `color-mix(in srgb, ${g.color_token} 10%, transparent)`,
                                                color: g.color_token,
                                            }}
                                        >
                                            Next: {nextTask.title}
                                        </span>
                                    )}
                                </div>
                                <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-[var(--color-text-muted)]" />
                            </div>
                        </Link>
                    );
                })}
            </div>

            <button
                type="button"
                onClick={() => setShowCreate(true)}
                className="mt-4 flex w-full items-center gap-3 rounded-2xl border border-dashed border-white/[0.07] p-3.5 lg:col-span-2"
            >
                <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[11px] bg-white/[0.04]">
                    <Plus className="h-[18px] w-[18px] text-[var(--color-text-muted)]" />
                </div>
                <div className="text-left">
                    <p className="text-sm font-medium text-[var(--color-text-muted)]">
                        Add a new goal
                    </p>
                    <p className="text-xs text-[var(--color-text-faint)]">
                        AI will generate your roadmap
                    </p>
                </div>
            </button>

            <Sheet open={showCreate} onOpenChange={setShowCreate}>
                <SheetContent
                    side="bottom"
                    className="rounded-t-[20px] border-0 bg-[var(--color-surface-muted)]"
                >
                    <SheetHeader>
                        <SheetTitle>Create a goal</SheetTitle>
                    </SheetHeader>
                    <div className="mt-4 space-y-4">
                        <Input
                            label="Title"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                        />
                        <Input
                            label="Icon"
                            value={icon}
                            onChange={e => setIcon(e.target.value)}
                            className="w-20"
                        />
                        <Button
                            onClick={handleCreate}
                            disabled={!title.trim()}
                            className="w-full rounded-2xl"
                        >
                            Save Goal
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
