'use client';

import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
    DndContext,
    type DragEndEvent,
    useDraggable,
    useDroppable,
} from '@dnd-kit/core';
import { useCompleteTask, useRescheduleTask, useTasks } from '@/hooks';
import { todayUtc, addDays } from '@/lib/timezone';
import { SegmentedControl } from '@/components/shared/segmented-control';
import { TaskRow } from '@/components/shared/task-row';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import type { TaskInstance, TaskStatus } from '@/types';
import { format, parseISO } from 'date-fns';

function DraggableBlock({
    task,
    onSelect,
}: {
    task: TaskInstance;
    onSelect: (task: TaskInstance) => void;
}) {
    const color = task.goal?.color_token ?? 'var(--color-primary)';
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: task.id,
    });
    const style = transform
        ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
        : undefined;
    const shortTitle =
        task.title.length > 16 ? `${task.title.slice(0, 14)}…` : task.title;
    const time = task.start_time.slice(0, 5);

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
            <button
                type="button"
                onClick={() => onSelect(task)}
                className="w-full rounded-[5px] px-1.5 py-1 text-left text-[9.5px] font-medium transition-opacity hover:opacity-80"
                style={{
                    backgroundColor: `color-mix(in srgb, ${color} ${task.status === 'done' ? '10%' : '18%'})`,
                    borderLeft: `3px solid ${color}`,
                    color,
                }}
            >
                {shortTitle} {time}
            </button>
        </div>
    );
}

function DayColumn({
    label,
    date,
    tasks,
    onSelect,
}: {
    label: string;
    date: string;
    tasks: TaskInstance[];
    onSelect: (task: TaskInstance) => void;
}) {
    const { setNodeRef } = useDroppable({ id: date });
    const isToday = date === todayUtc();

    return (
        <div ref={setNodeRef} className="min-w-[72px]">
            <p
                className={`mb-2 text-center text-[11px] font-semibold uppercase ${isToday ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)]'}`}
            >
                {label}
            </p>
            <div className="flex flex-col gap-0.5">
                {tasks.map(t => (
                    <DraggableBlock key={t.id} task={t} onSelect={onSelect} />
                ))}
            </div>
        </div>
    );
}

export default function TimelinePage() {
    const [view, setView] = useState<'day' | 'week'>('week');
    const [dateOffset, setDateOffset] = useState(0);
    const [selectedTask, setSelectedTask] = useState<TaskInstance | null>(null);
    const baseDate = addDays(todayUtc(), dateOffset);
    const weekEnd = addDays(baseDate, 6);
    const { data: tasks = [] } = useTasks(baseDate, weekEnd);
    const completeTask = useCompleteTask();
    const rescheduleTask = useRescheduleTask();

    const weekDates = useMemo(
        () => Array.from({ length: 7 }, (_, i) => addDays(baseDate, i)),
        [baseDate]
    );

    const dayTasks = tasks.filter(t => t.scheduled_date === baseDate);

    const tasksByDate = useMemo(() => {
        const grouped = new Map<string, TaskInstance[]>();
        weekDates.forEach(d => grouped.set(d, []));
        tasks.forEach(task => {
            const existing = grouped.get(task.scheduled_date) ?? [];
            existing.push(task);
            grouped.set(task.scheduled_date, existing);
        });
        return grouped;
    }, [tasks, weekDates]);

    const dayTasksByHour = useMemo(() => {
        const grouped = new Map<number, TaskInstance[]>();
        dayTasks.forEach(task => {
            const hour = parseInt(task.start_time.split(':')[0], 10);
            const existing = grouped.get(hour) ?? [];
            existing.push(task);
            grouped.set(hour, existing);
        });
        return grouped;
    }, [dayTasks]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;
        const task = tasks.find(t => t.id === active.id);
        if (!task) return;
        const newDate = over.id as string;
        if (!weekDates.includes(newDate)) return;
        rescheduleTask.mutate({
            id: task.id,
            newDate,
            newStartTime: task.start_time,
        });
    };

    const handleToggle = (task: TaskInstance, status: TaskStatus) => {
        const next = status === 'done' ? 'pending' : 'done';
        completeTask.mutate({ id: task.id, status: next });
        if (next === 'done') setSelectedTask(null);
    };

    const dateLabel =
        view === 'week'
            ? `${format(parseISO(baseDate), 'MMM d')} – ${format(parseISO(weekEnd), 'MMM d')}`
            : format(parseISO(baseDate), 'EEE, MMM d');

    return (
        <div className="space-y-3">
            <div>
                <h1 className="text-[22px] font-bold tracking-tight">
                    Timeline
                </h1>
                <p className="text-sm text-[var(--color-text-secondary)]">
                    Tap a block to complete or review. Drag to another day to
                    reschedule.
                </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
                <SegmentedControl
                    options={[
                        { value: 'day', label: 'Day' },
                        { value: 'week', label: 'Week' },
                    ]}
                    value={view}
                    onChange={setView}
                />
                <div className="flex items-center gap-2.5">
                    <button
                        type="button"
                        onClick={() =>
                            setDateOffset(d => d - (view === 'week' ? 7 : 1))
                        }
                        className="text-[var(--color-text-secondary)]"
                    >
                        <ChevronLeft className="h-[18px] w-[18px]" />
                    </button>
                    <span className="text-sm font-semibold">{dateLabel}</span>
                    <button
                        type="button"
                        onClick={() =>
                            setDateOffset(d => d + (view === 'week' ? 7 : 1))
                        }
                        className="text-[var(--color-primary)]"
                    >
                        <ChevronRight className="h-[18px] w-[18px]" />
                    </button>
                </div>
            </div>

            {view === 'day' ? (
                <div className="relative max-h-[660px] overflow-y-auto pl-11">
                    <div className="relative" style={{ height: 840 }}>
                        {Array.from({ length: 15 }, (_, i) => i + 8).map(
                            hour => (
                                <div
                                    key={hour}
                                    className="absolute right-0 left-0 border-t border-white/[0.05]"
                                    style={{ top: (hour - 8) * 60, height: 60 }}
                                >
                                    <span className="absolute -left-11 -top-2 w-10 text-right text-[10px] font-medium text-[var(--color-text-muted)]">
                                        {hour > 12
                                            ? `${hour - 12} PM`
                                            : hour === 12
                                              ? '12 PM'
                                              : `${hour} AM`}
                                    </span>
                                    {(dayTasksByHour.get(hour) ?? []).map(
                                        (task, idx) => {
                                            const color =
                                                task.goal?.color_token ??
                                                'var(--color-primary)';
                                            const [, m] = task.start_time
                                                .split(':')
                                                .map(Number);
                                            const top =
                                                (hour - 8) * 60 +
                                                (m / 60) * 60 +
                                                idx * 4;
                                            const height = Math.max(
                                                30,
                                                (task.duration_minutes / 60) *
                                                    60
                                            );
                                            const isDone =
                                                task.status === 'done';
                                            return (
                                                <button
                                                    key={task.id}
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedTask(task)
                                                    }
                                                    className="absolute right-0 left-0 overflow-hidden rounded-lg px-2.5 py-1.5 text-left"
                                                    style={{
                                                        top,
                                                        height,
                                                        backgroundColor: `color-mix(in srgb, ${color} ${isDone ? '8%' : '12%'})`,
                                                        borderLeft: `3px solid ${color}`,
                                                        opacity: isDone
                                                            ? 0.55
                                                            : 1,
                                                    }}
                                                >
                                                    <p
                                                        className="text-xs font-semibold"
                                                        style={{
                                                            color,
                                                            textDecoration:
                                                                isDone
                                                                    ? 'line-through'
                                                                    : undefined,
                                                        }}
                                                    >
                                                        {task.title}
                                                    </p>
                                                    {task.goal && (
                                                        <p
                                                            className="text-[10px] opacity-70"
                                                            style={{ color }}
                                                        >
                                                            {task.goal.icon}{' '}
                                                            {task.goal.title}
                                                        </p>
                                                    )}
                                                </button>
                                            );
                                        }
                                    )}
                                </div>
                            )
                        )}
                    </div>
                </div>
            ) : (
                <DndContext onDragEnd={handleDragEnd}>
                    <div className="overflow-x-auto pb-2">
                        <div className="grid min-w-[550px] grid-cols-7 gap-1">
                            {weekDates.map(date => (
                                <DayColumn
                                    key={date}
                                    date={date}
                                    label={format(parseISO(date), 'EEE d')}
                                    tasks={tasksByDate.get(date) ?? []}
                                    onSelect={setSelectedTask}
                                />
                            ))}
                        </div>
                    </div>
                </DndContext>
            )}

            {tasks.length === 0 && (
                <div className="rounded-[var(--radius-chip)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm text-[var(--color-text-secondary)]">
                    No scheduled tasks in this range. Career goals run on
                    weekdays — try navigating to Mon–Fri, or use + to add a
                    task.
                </div>
            )}

            <Sheet
                open={!!selectedTask}
                onOpenChange={open => !open && setSelectedTask(null)}
            >
                <SheetContent
                    side="bottom"
                    className="rounded-t-[20px] border-0 bg-[var(--color-surface-muted)]"
                >
                    <SheetHeader>
                        <SheetTitle>Task details</SheetTitle>
                    </SheetHeader>
                    {selectedTask && (
                        <div className="mt-2 space-y-4">
                            <TaskRow
                                title={selectedTask.title}
                                startTime={selectedTask.start_time}
                                durationMinutes={selectedTask.duration_minutes}
                                status={selectedTask.status}
                                color={selectedTask.goal?.color_token}
                                subTasks={selectedTask.sub_tasks}
                                onToggle={() =>
                                    handleToggle(
                                        selectedTask,
                                        selectedTask.status
                                    )
                                }
                            />
                            {selectedTask.goal && (
                                <p className="text-sm text-[var(--color-text-secondary)]">
                                    Goal: {selectedTask.goal.icon}{' '}
                                    {selectedTask.goal.title}
                                </p>
                            )}
                            <Button
                                variant="ghost"
                                className="w-full"
                                onClick={() => setSelectedTask(null)}
                            >
                                Close
                            </Button>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}
