'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import {
    useNotificationPrefs,
    useProfile,
    useRegenerateSchedule,
    useUpdateNotificationPrefs,
    useUpdateProfile,
} from '@/hooks';
import { api } from '@/lib/api';
import { ROUTES } from '@/lib/routes';
import type { User } from '@/types';
import { SectionLabel } from '@/components/shared/section-label';
import { ToggleSwitch } from '@/components/shared/toggle-switch';
import { Button } from '@/components/ui/button';

function SettingsRow({
    label,
    value,
    onClick,
    danger,
}: {
    label: string;
    value?: string;
    onClick?: () => void;
    danger?: boolean;
}) {
    const Comp = onClick ? 'button' : 'div';
    return (
        <Comp
            type={onClick ? 'button' : undefined}
            onClick={onClick}
            className="flex w-full items-center justify-between border-b border-white/[0.05] py-[15px] last:border-b-0"
        >
            <span
                className={`text-sm ${danger ? 'text-[var(--color-danger)]' : ''}`}
            >
                {label}
            </span>
            <div className="flex items-center gap-1.5">
                {value && (
                    <span className="text-sm font-medium text-[var(--color-primary)]">
                        {value}
                    </span>
                )}
                {onClick && !danger && (
                    <ChevronRight className="h-4 w-4 text-[var(--color-text-muted)]" />
                )}
            </div>
        </Comp>
    );
}

function SettingsForm({ profile }: { profile: User }) {
    const updateProfile = useUpdateProfile();
    const { data: prefs } = useNotificationPrefs();
    const updatePrefs = useUpdateNotificationPrefs();
    const regenerateSchedule = useRegenerateSchedule();
    const router = useRouter();
    const [hours, setHours] = useState(profile.daily_hour_budget);
    const [wakeTime, setWakeTime] = useState(
        profile.wake_time?.slice(0, 5) ?? '07:00'
    );
    const [regenMessage, setRegenMessage] = useState<{
        type: 'success' | 'error';
        text: string;
    } | null>(null);

    const formatWake = (t: string) => {
        const [h, m] = t.split(':').map(Number);
        const ampm = h < 12 ? 'AM' : 'PM';
        const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
        return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
    };

    const saveSchedule = () => {
        updateProfile.mutate({ daily_hour_budget: hours, wake_time: wakeTime });
    };

    const handleLogout = async () => {
        await api.auth.signOut();
        router.push(ROUTES.LOGIN);
        router.refresh();
    };

    const handleRegenerateSchedule = async () => {
        const confirmed = window.confirm(
            'Rebuild your upcoming tasks with correct titles and subtasks? Completed tasks are kept.'
        );
        if (!confirmed) return;

        setRegenMessage(null);
        try {
            const result = await regenerateSchedule.mutateAsync();
            setRegenMessage({
                type: 'success',
                text: `Schedule rebuilt — ${result.created} upcoming tasks refreshed${result.preserved ? ` (${result.preserved} completed kept)` : ''}.`,
            });
        } catch (error) {
            setRegenMessage({
                type: 'error',
                text:
                    error instanceof Error
                        ? error.message
                        : 'Could not rebuild schedule. Complete onboarding first if you have no plan yet.',
            });
        }
    };

    const initial = (profile.display_name ??
        profile.email ??
        'U')[0]?.toUpperCase();

    return (
        <div className="space-y-3 lg:max-w-xl">
            <h1 className="text-[22px] font-bold tracking-tight">Settings</h1>

            <div className="flex items-center gap-3.5 rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[#c084fc] text-xl font-bold">
                    {initial}
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-base font-semibold">
                        {profile.display_name ?? 'User'}
                    </p>
                    <p className="truncate text-[13px] text-[var(--color-text-muted)]">
                        {profile.email}
                    </p>
                </div>
                <ChevronRight className="h-4 w-4 text-[var(--color-text-muted)]" />
            </div>

            <div className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface)] px-[18px] py-1.5">
                <SectionLabel className="py-3">Schedule</SectionLabel>
                <SettingsRow
                    label="Wake time"
                    value={formatWake(wakeTime)}
                    onClick={() => {
                        const next = prompt('Wake time (HH:MM)', wakeTime);
                        if (next) {
                            setWakeTime(next);
                            updateProfile.mutate({ wake_time: next });
                        }
                    }}
                />
                <SettingsRow
                    label="Daily budget"
                    value={`${hours} hours`}
                    onClick={() => {
                        const next = prompt('Daily hours', String(hours));
                        if (next) {
                            setHours(Number(next));
                            saveSchedule();
                        }
                    }}
                />
                <SettingsRow
                    label="Timezone"
                    value={profile.timezone ?? 'UTC'}
                />
                <div className="border-t border-white/[0.05] py-4">
                    <p className="mb-1 text-sm font-medium">
                        Regenerate schedule
                    </p>
                    <p className="mb-3 text-xs leading-relaxed text-[var(--color-text-muted)]">
                        Fix task titles after onboarding or plan changes.
                        Rebuilds the next 30 days from your recurrence rules.
                        Completed tasks are preserved.
                    </p>
                    <Button
                        variant="secondary"
                        className="w-full rounded-xl"
                        onClick={handleRegenerateSchedule}
                        isLoading={regenerateSchedule.isPending}
                    >
                        Regenerate my schedule
                    </Button>
                    {regenMessage && (
                        <p
                            className={`mt-3 text-xs ${regenMessage.type === 'success' ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}
                        >
                            {regenMessage.text}
                        </p>
                    )}
                </div>
            </div>

            <div className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface)] px-[18px] py-1.5">
                <SectionLabel className="py-3">Notifications</SectionLabel>
                {(
                    [
                        'pre_block_reminders',
                        'coach_suggestions',
                        'daily_brief',
                        'weekly_review',
                    ] as const
                ).map(key => (
                    <div
                        key={key}
                        className="flex items-center justify-between border-b border-white/[0.05] py-[15px] last:border-b-0"
                    >
                        <span className="text-sm capitalize">
                            {key.replace(/_/g, ' ')}
                        </span>
                        <ToggleSwitch
                            checked={prefs?.[key] ?? true}
                            onChange={checked =>
                                updatePrefs.mutate({ [key]: checked })
                            }
                        />
                    </div>
                ))}
            </div>

            <div className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface)] px-[18px] py-1.5">
                <SectionLabel className="py-3">Account</SectionLabel>
                <SettingsRow label="Log out" onClick={handleLogout} danger />
            </div>
        </div>
    );
}

export default function SettingsPage() {
    const { data: profile, isLoading } = useProfile();
    if (isLoading || !profile) {
        return (
            <div className="animate-pulse h-40 rounded-[var(--radius-card)] bg-[var(--color-surface)]" />
        );
    }
    return <SettingsForm key={profile.id} profile={profile} />;
}
