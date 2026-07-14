'use client';

import { useNotifications } from '@/hooks';
import { Bell } from 'lucide-react';

export function NotificationsView() {
    const { data: notifications = [] } = useNotifications();
    return (
        <div className="space-y-4 lg:max-w-xl">
            <h1 className="text-[22px] font-bold tracking-tight">
                Notifications
            </h1>
            {notifications.length === 0 ? (
                <div className="flex flex-col items-center rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-12 text-center">
                    <Bell className="mb-3 h-8 w-8 text-[var(--color-text-muted)]" />
                    <p className="text-sm text-[var(--color-text-secondary)]">
                        No notifications yet.
                    </p>
                </div>
            ) : (
                notifications.map(n => (
                    <div
                        key={n.id}
                        className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
                    >
                        <p className="text-sm leading-relaxed">{n.body}</p>
                        <p className="mt-1.5 text-xs text-[var(--color-text-muted)]">
                            {new Date(n.sent_at).toLocaleString()}
                        </p>
                    </div>
                ))
            )}
        </div>
    );
}
