'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface QuickAddBarProps {
    onSubmit: (text: string) => void;
    isLoading?: boolean;
    className?: string;
}

export function QuickAddBar({
    onSubmit,
    isLoading,
    className,
}: QuickAddBarProps) {
    const [text, setText] = useState('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;
        onSubmit(text.trim());
        setText('');
    };

    return (
        <form
            onSubmit={handleSubmit}
            className={cn(
                'flex gap-2 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-2 shadow-sm',
                className
            )}
        >
            <Input
                placeholder='Try "Learn React hooks every Monday for an hour"'
                value={text}
                onChange={e => setText(e.target.value)}
                className="flex-1 border-0 focus:ring-0"
                aria-label="Quick add task"
            />
            <Button type="submit" isLoading={isLoading} disabled={!text.trim()}>
                Add
            </Button>
        </form>
    );
}
