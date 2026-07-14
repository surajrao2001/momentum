'use client';

import { use } from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, ChevronDown, Plus } from 'lucide-react';
import {
    useCompleteTask,
    useGymLastSession,
    useLogGym,
    useTasks,
} from '@/hooks';
import { todayUtc } from '@/lib/timezone';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const EXERCISES = [
    'Bench Press',
    'Incline Press',
    'Shoulder Press',
    'Lateral Raises',
    'Triceps Pushdown',
];
const SPLITS = ['Push', 'Pull', 'Legs', 'Upper', 'Lower', 'Arms'];

export default function GymTrackerPage({
    params,
}: {
    params: Promise<{ taskId: string }>;
}) {
    const { taskId } = use(params);
    const today = todayUtc();
    const { data: tasks = [] } = useTasks(today, today);
    const task = tasks.find(t => t.id === taskId);
    const completeTask = useCompleteTask();
    const logGym = useLogGym();
    const [expanded, setExpanded] = useState<string | null>(EXERCISES[0]);
    const { data: lastSession = [] } = useGymLastSession(
        expanded ?? EXERCISES[0]
    );
    const lastWeight = lastSession[0]?.weight_kg ?? 80;
    const [sets, setSets] = useState<
        Record<string, Array<{ weight_kg: number | ''; reps: number | '' }>>
    >(() =>
        Object.fromEntries(
            EXERCISES.map(ex => [
                ex,
                [
                    { weight_kg: lastWeight, reps: 8 },
                    { weight_kg: lastWeight, reps: 8 },
                    { weight_kg: '', reps: '' },
                ],
            ])
        )
    );

    const handleLogSet = async (exercise: string, setIndex: number) => {
        const set = sets[exercise][setIndex];
        if (!set.weight_kg || !set.reps) return;
        await logGym.mutateAsync({
            taskInstanceId: taskId,
            exerciseName: exercise,
            sets: [
                { weight_kg: Number(set.weight_kg), reps: Number(set.reps) },
            ],
        });
    };

    const handleFinish = async () => {
        await completeTask.mutateAsync({ id: taskId, status: 'done' });
    };

    return (
        <div className="space-y-4 pb-8 lg:max-w-xl">
            <div className="flex items-center gap-3">
                <Link
                    href="/goals"
                    className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-white/[0.05]"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <div>
                    <p className="text-base font-semibold">
                        {task?.title ?? 'Push Day'}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                        Split 1 of 6 · {today}
                    </p>
                </div>
                <span className="ml-auto rounded-lg border border-[color-mix(in_srgb,var(--color-success)_20%,transparent)] bg-[color-mix(in_srgb,var(--color-success)_10%,transparent)] px-2.5 py-1 text-xs font-semibold text-[var(--color-success)]">
                    Week 3
                </span>
            </div>

            <div>
                <div className="flex gap-1">
                    {SPLITS.map((split, i) => (
                        <div
                            key={split}
                            className={cn(
                                'h-1 flex-1 rounded-sm',
                                i === 0
                                    ? 'bg-[var(--color-success)]'
                                    : 'bg-white/10'
                            )}
                        />
                    ))}
                </div>
                <div className="mt-1 flex justify-between">
                    {SPLITS.map((split, i) => (
                        <span
                            key={split}
                            className={cn(
                                'text-[10px]',
                                i === 0
                                    ? 'font-semibold text-[var(--color-success)]'
                                    : 'text-[var(--color-text-muted)]'
                            )}
                        >
                            {split}
                        </span>
                    ))}
                </div>
            </div>

            {EXERCISES.map(exercise => {
                const isOpen = expanded === exercise;
                const exerciseSets = sets[exercise] ?? [];
                const doneSets = exerciseSets.filter(
                    s => s.weight_kg && s.reps
                ).length;

                if (!isOpen) {
                    return (
                        <button
                            key={exercise}
                            type="button"
                            onClick={() => setExpanded(exercise)}
                            className="flex w-full items-center justify-between rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3.5"
                        >
                            <span className="text-sm font-medium">
                                {exercise}
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-[var(--color-text-muted)]">
                                    {doneSets}/{exerciseSets.length} sets
                                </span>
                                <ChevronDown className="h-4 w-4 text-[var(--color-text-muted)]" />
                            </div>
                        </button>
                    );
                }

                return (
                    <div
                        key={exercise}
                        className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
                    >
                        <div className="mb-3 flex items-center justify-between">
                            <div>
                                <p className="text-[15px] font-semibold">
                                    {exercise}
                                </p>
                                <p className="text-[11px] text-[var(--color-text-muted)]">
                                    Last: {lastWeight} kg × 8 × 3
                                </p>
                            </div>
                            <span className="rounded-lg bg-[color-mix(in_srgb,var(--color-success)_10%,transparent)] px-2 py-1 text-[11px] font-medium text-[var(--color-success)]">
                                +2.5 kg today
                            </span>
                        </div>
                        {exerciseSets.map((set, i) => (
                            <div
                                key={i}
                                className="my-1.5 flex items-center gap-2"
                            >
                                <span className="w-9 text-xs text-[var(--color-text-muted)]">
                                    Set {i + 1}
                                </span>
                                <input
                                    type="number"
                                    value={set.weight_kg}
                                    onChange={e => {
                                        const next = { ...sets };
                                        next[exercise] = [...exerciseSets];
                                        next[exercise][i] = {
                                            ...next[exercise][i],
                                            weight_kg:
                                                e.target.value === ''
                                                    ? ''
                                                    : Number(e.target.value),
                                        };
                                        setSets(next);
                                    }}
                                    className="w-[58px] rounded-[9px] border border-white/[0.12] bg-[var(--color-bg)] px-2 py-1.5 text-center text-[15px] outline-none focus:border-[var(--color-primary)]"
                                />
                                <span className="text-xs text-[var(--color-text-muted)]">
                                    kg
                                </span>
                                <input
                                    type="number"
                                    value={set.reps}
                                    onChange={e => {
                                        const next = { ...sets };
                                        next[exercise] = [...exerciseSets];
                                        next[exercise][i] = {
                                            ...next[exercise][i],
                                            reps:
                                                e.target.value === ''
                                                    ? ''
                                                    : Number(e.target.value),
                                        };
                                        setSets(next);
                                    }}
                                    className="w-[58px] rounded-[9px] border border-white/[0.12] bg-[var(--color-bg)] px-2 py-1.5 text-center text-[15px] outline-none focus:border-[var(--color-primary)]"
                                />
                                <span className="text-xs text-[var(--color-text-muted)]">
                                    reps
                                </span>
                                <button
                                    type="button"
                                    onClick={() => handleLogSet(exercise, i)}
                                    className={cn(
                                        'flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full',
                                        set.weight_kg && set.reps
                                            ? 'bg-[var(--color-success)]'
                                            : 'border-2 border-white/[0.12]'
                                    )}
                                >
                                    {set.weight_kg && set.reps && (
                                        <Check className="h-3.5 w-3.5 text-white" />
                                    )}
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            className="mt-1.5 flex w-full items-center justify-center gap-1 rounded-[9px] border border-dashed border-white/[0.08] bg-white/[0.04] py-2 text-xs text-[var(--color-text-muted)]"
                        >
                            <Plus className="h-3 w-3" /> Add set
                        </button>
                    </div>
                );
            })}

            <Button
                className="w-full rounded-2xl bg-[var(--color-success)] py-4 text-base font-bold text-[var(--color-bg)] hover:bg-[var(--color-success)]/90"
                onClick={handleFinish}
            >
                Finish Workout
            </Button>
        </div>
    );
}
