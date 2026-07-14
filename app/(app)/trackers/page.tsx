'use client';

import Link from 'next/link';
import { useTasks } from '@/hooks';
import { todayUtc } from '@/lib/timezone';
import { Card } from '@/components/ui/card';

export default function TrackersPage() {
    const today = todayUtc();
    const { data: tasks = [] } = useTasks(today, today);
    const gymTasks = tasks.filter(
        t =>
            t.title.toLowerCase().includes('gym') ||
            t.title.toLowerCase().includes('push') ||
            t.title.toLowerCase().includes('pull')
    );

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-semibold">Trackers</h1>
            {gymTasks.length === 0 ? (
                <p className="text-[var(--color-text-secondary)]">
                    No gym sessions scheduled today.
                </p>
            ) : (
                gymTasks.map(t => (
                    <Link key={t.id} href={`/trackers/gym/${t.id}`}>
                        <Card className="hover:border-[var(--color-primary)]/30">
                            <p className="font-medium">{t.title}</p>
                            <p className="text-sm text-[var(--color-text-secondary)]">
                                {t.start_time.slice(0, 5)} ·{' '}
                                {t.duration_minutes} min
                            </p>
                        </Card>
                    </Link>
                ))
            )}
        </div>
    );
}
