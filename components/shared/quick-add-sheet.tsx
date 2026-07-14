'use client';

import { useState } from 'react';
import { useGoals, useParseNlp, useCreateTask } from '@/hooks';
import { todayUtc } from '@/lib/timezone';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';

export function QuickAddSheet({
    open,
    onOpenChange,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const { data: goals = [] } = useGoals();
    const parseNlp = useParseNlp();
    const createTask = useCreateTask();
    const [text, setText] = useState('');

    const handleSubmit = async () => {
        if (!text.trim()) return;
        const result = await parseNlp.mutateAsync({
            text,
            goalIds: goals.map(g => g.id),
        });
        await createTask.mutateAsync({
            goal_id: result.goal_category_id,
            recurrence_rule_id: null,
            title: result.title,
            sub_tasks: null,
            scheduled_date: todayUtc(),
            start_time: result.start_time ?? '09:00:00',
            duration_minutes: result.duration_minutes ?? 60,
            status: 'pending',
        });
        setText('');
        onOpenChange(false);
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="bottom"
                className="rounded-t-[20px] border-0 bg-[var(--color-surface-muted)] pb-10"
            >
                <SheetHeader>
                    <SheetTitle>Quick add</SheetTitle>
                </SheetHeader>
                <div className="mt-4 rounded-[14px] border-[1.5px] border-[color-mix(in_srgb,var(--color-primary)_30%,transparent)] bg-[var(--color-bg)] p-4">
                    <input
                        value={text}
                        onChange={e => setText(e.target.value)}
                        placeholder='Type naturally… "Learn React Hooks every Monday for 1h"'
                        className="w-full border-none bg-transparent text-sm outline-none"
                    />
                </div>
                <div className="mt-4 flex gap-2.5">
                    <Button
                        variant="secondary"
                        className="flex-1 rounded-xl"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="flex-[2] rounded-xl"
                        onClick={handleSubmit}
                        isLoading={parseNlp.isPending || createTask.isPending}
                    >
                        Add Task
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
