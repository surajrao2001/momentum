'use client';

import Link from 'next/link';
import { memo, useMemo, useState } from 'react';
import { Bell, Brain, Plus } from 'lucide-react';
import { format } from 'date-fns';
import {
    useCompleteTask,
    useProfile,
    useProgressOverview,
    useRescheduleTask,
    useTasks,
    useCoachSuggestions,
} from '@/hooks';
import { captureEvent } from '@/components/providers/posthog-provider';
import { todayUtc, addDays } from '@/lib/timezone';
import { ROUTES } from '@/lib/routes';
import { ProgressRing } from '@/components/shared/progress-ring';
import { ProgressBar } from '@/components/shared/progress-bar';
import { TaskRow } from '@/components/shared/task-row';
import { SectionLabel } from '@/components/shared/section-label';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { QuickAddSheet } from '@/components/shared/quick-add-sheet';
import type { TaskInstance, TaskStatus } from '@/types';

const MemoTaskRow = memo(TaskRow);

export default function TodayPage() {
    const today = todayUtc();
    const { data: profile } = useProfile();
    const { data: tasks = [], isLoading } = useTasks(today, today);
    const { data: upcomingTasks = [] } = useTasks(today, addDays(today, 13));
    const { data: progress } = useProgressOverview();
    const { data: suggestions = [] } = useCoachSuggestions();
    const completeTask = useCompleteTask();
    const rescheduleTask = useRescheduleTask();
    const [rescheduleTarget, setRescheduleTarget] =
        useState<TaskInstance | null>(null);
    const [quickAddOpen, setQuickAddOpen] = useState(false);

    const tasksWithMissed = useMemo(() => {
        const now = new Date();
        return tasks.map(t => {
            if (t.status !== 'pending') return t;
            const end = new Date(`${t.scheduled_date}T${t.start_time}`);
            end.setMinutes(end.getMinutes() + t.duration_minutes + 30);
            if (end < now) return { ...t, status: 'missed' as TaskStatus };
            return t;
        });
    }, [tasks]);

    const doneCount = tasksWithMissed.filter(
        t => t.status === 'done' || t.status === 'partial'
    ).length;
    const todayPct = tasksWithMissed.length
        ? Math.round((doneCount / tasksWithMissed.length) * 100)
        : 0;
    const remainingMinutes = tasksWithMissed
        .filter(t => t.status === 'pending' || t.status === 'missed')
        .reduce((sum, t) => sum + t.duration_minutes, 0);

    const hour = new Date().getHours();
    const greeting =
        hour < 12
            ? 'Good morning'
            : hour < 17
              ? 'Good afternoon'
              : 'Good evening';
    const dateLabel = format(new Date(), 'EEEE, MMM d').toUpperCase();

    const nextTask = useMemo(() => {
        return upcomingTasks
            .filter(t => t.status === 'pending' && t.scheduled_date >= today)
            .sort((a, b) =>
                `${a.scheduled_date}T${a.start_time}`.localeCompare(
                    `${b.scheduled_date}T${b.start_time}`
                )
            )[0];
    }, [upcomingTasks, today]);

    const handleToggle = (task: TaskInstance, status: TaskStatus) => {
        const next = status === 'done' ? 'pending' : 'done';
        completeTask.mutate({ id: task.id, status: next });
        if (next === 'done')
            captureEvent('task_completed', { task_id: task.id });
    };

    const handleReschedule = async (option: 'today' | 'tomorrow' | 'skip') => {
        if (!rescheduleTarget) return;
        if (option === 'skip') {
            completeTask.mutate({ id: rescheduleTarget.id, status: 'skipped' });
        } else {
            const newDate = option === 'today' ? today : addDays(today, 1);
            await rescheduleTask.mutateAsync({
                id: rescheduleTarget.id,
                newDate,
                newStartTime: '19:00:00',
            });
            captureEvent('task_rescheduled', { task_id: rescheduleTarget.id });
        }
        setRescheduleTarget(null);
    };

    if (isLoading) {
        return (
            <div className="animate-pulse space-y-4">
                {[1, 2, 3].map(i => (
                    <div
                        key={i}
                        className="h-20 rounded-[var(--radius-card)] bg-[var(--color-surface)]"
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-3 lg:grid lg:grid-cols-[1fr_1.2fr] lg:items-start lg:gap-8 lg:space-y-0">
            <div className="space-y-3">
                {/* Header */}
                <div className="mb-5 flex items-start justify-between">
                    <div>
                        <p className="mb-0.5 text-xs font-medium tracking-wide text-[var(--color-text-muted)]">
                            {dateLabel}
                        </p>
                        <h1 className="text-[22px] font-bold tracking-tight">
                            {greeting}
                            {profile?.display_name
                                ? `, ${profile.display_name}`
                                : ''}
                        </h1>
                    </div>
                    <Link
                        href={ROUTES.NOTIFICATIONS}
                        className="relative flex h-[38px] w-[38px] items-center justify-center rounded-full border border-white/[0.07] bg-[var(--color-surface)]"
                        aria-label="Notifications"
                    >
                        <Bell className="h-[18px] w-[18px] text-[var(--color-text-secondary)]" />
                        <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full border-2 border-[var(--color-bg)] bg-[var(--color-primary)]" />
                    </Link>
                </div>

                {/* Mission card */}
                <div className="rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface)] p-[18px]">
                    <div className="flex items-center gap-[18px]">
                        <ProgressRing value={todayPct} sublabel="today" />
                        <div className="min-w-0 flex-1">
                            <SectionLabel className="mb-2.5">
                                Today&apos;s mission
                            </SectionLabel>
                            {tasksWithMissed.slice(0, 3).map(task => (
                                <div
                                    key={task.id}
                                    className="mb-1.5 flex items-center gap-1.5"
                                >
                                    <div
                                        className="h-[7px] w-[7px] shrink-0 rounded-sm"
                                        style={{
                                            backgroundColor:
                                                task.goal?.color_token ??
                                                'var(--color-primary)',
                                        }}
                                    />
                                    <span className="truncate text-[13px]">
                                        {task.title}
                                    </span>
                                </div>
                            ))}
                            {tasksWithMissed.length === 0 && (
                                <p className="text-[13px] text-[var(--color-text-secondary)]">
                                    No tasks scheduled yet
                                </p>
                            )}
                            <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
                                est. {Math.floor(remainingMinutes / 60)}h{' '}
                                {remainingMinutes % 60}m remaining
                            </p>
                        </div>
                    </div>
                </div>

                {/* Goal progress */}
                {progress && progress.goals.length > 0 && (
                    <div className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface)] px-[18px] py-4">
                        <SectionLabel className="mb-3.5">
                            Goal progress
                        </SectionLabel>
                        {progress.goals.map(g => (
                            <ProgressBar
                                key={g.goal_id}
                                label={`${g.icon} ${g.title}`}
                                value={g.progress_pct}
                                color={g.color_token}
                                className="mb-2.5 last:mb-0"
                            />
                        ))}
                    </div>
                )}

                {/* Coach teaser */}
                {suggestions[0] && (
                    <Link
                        href={ROUTES.COACH}
                        className="flex items-center gap-3 rounded-2xl border border-[color-mix(in_srgb,var(--color-primary)_20%,transparent)] bg-[var(--color-surface)] p-3.5 transition-colors hover:bg-white/[0.02]"
                    >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-[color-mix(in_srgb,var(--color-primary)_15%,transparent)]">
                            <Brain className="h-[17px] w-[17px] text-[var(--color-primary)]" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="mb-0.5 text-[10px] font-semibold tracking-wide text-[var(--color-primary)] uppercase">
                                AI Coach · {suggestions.length} suggestion
                                {suggestions.length !== 1 ? 's' : ''}
                            </p>
                            <p className="truncate text-[13px] leading-snug text-[#c8cdee]">
                                {suggestions[0].message}{' '}
                                <span className="text-[var(--color-primary)]">
                                    View →
                                </span>
                            </p>
                        </div>
                    </Link>
                )}
            </div>

            {/* Schedule column */}
            <div>
                <SectionLabel className="mb-3">
                    Today&apos;s schedule
                </SectionLabel>
                {tasksWithMissed.length === 0 ? (
                    <div className="rounded-[var(--radius-chip)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm text-[var(--color-text-secondary)]">
                        <p>No tasks scheduled for today.</p>
                        {nextTask ? (
                            <p className="mt-2 text-[var(--color-text-primary)]">
                                Next up: <strong>{nextTask.title}</strong> on{' '}
                                {nextTask.scheduled_date} at{' '}
                                {nextTask.start_time.slice(0, 5)}
                                {nextTask.goal
                                    ? ` (${nextTask.goal.icon} ${nextTask.goal.title})`
                                    : ''}
                            </p>
                        ) : (
                            <p className="mt-2">
                                Your plan may only include weekday blocks. Check
                                Timeline for Mon–Fri, or add a task with +.
                            </p>
                        )}
                    </div>
                ) : (
                    tasksWithMissed.map(task => (
                        <MemoTaskRow
                            key={task.id}
                            title={task.title}
                            startTime={task.start_time}
                            durationMinutes={task.duration_minutes}
                            status={task.status}
                            color={task.goal?.color_token}
                            subTasks={task.sub_tasks}
                            onToggle={() => handleToggle(task, task.status)}
                            onReschedule={
                                task.status === 'missed'
                                    ? () => setRescheduleTarget(task)
                                    : undefined
                            }
                        />
                    ))
                )}

                <button
                    type="button"
                    onClick={() => setQuickAddOpen(true)}
                    className="mt-1 flex w-full items-center gap-3 rounded-[var(--radius-chip)] border border-dashed border-white/[0.07] bg-[var(--color-surface)] p-3.5 text-left"
                >
                    <div className="flex h-[22px] w-[22px] items-center justify-center rounded-full border-[1.5px] border-white/[0.13]">
                        <Plus className="h-3 w-3 text-[var(--color-text-muted)]" />
                    </div>
                    <span className="text-sm text-[var(--color-text-faint)]">
                        Add a task… &quot;Learn Hooks every Monday for 1h&quot;
                    </span>
                </button>
            </div>

            <Sheet
                open={!!rescheduleTarget}
                onOpenChange={open => !open && setRescheduleTarget(null)}
            >
                <SheetContent
                    side="bottom"
                    className="rounded-t-[20px] border-0 bg-[var(--color-surface-muted)]"
                >
                    <SheetHeader>
                        <SheetTitle>Let&apos;s reschedule</SheetTitle>
                    </SheetHeader>
                    <p className="mb-4 text-sm text-[var(--color-text-secondary)]">
                        No pressure. Where should we move &quot;
                        {rescheduleTarget?.title}&quot;?
                    </p>
                    <div className="flex flex-col gap-2">
                        <button
                            type="button"
                            onClick={() => handleReschedule('today')}
                            className="rounded-[14px] border border-[color-mix(in_srgb,var(--color-primary)_20%,transparent)] bg-[var(--color-surface)] p-4 text-left"
                        >
                            <p className="text-sm font-medium">
                                Today at 7:00 PM
                            </p>
                            <p className="text-xs text-[var(--color-text-muted)]">
                                Best fit for your schedule
                            </p>
                        </button>
                        <button
                            type="button"
                            onClick={() => handleReschedule('tomorrow')}
                            className="rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-left"
                        >
                            <p className="text-sm font-medium">
                                Tomorrow at 6:00 PM
                            </p>
                        </button>
                        <Button
                            variant="ghost"
                            onClick={() => handleReschedule('skip')}
                        >
                            Skip this week
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>

            <QuickAddSheet open={quickAddOpen} onOpenChange={setQuickAddOpen} />
        </div>
    );
}
