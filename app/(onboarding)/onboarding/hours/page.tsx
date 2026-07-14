'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Minus, Plus } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { useOnboardingStore } from '@/stores/onboarding';
import { StepIndicator } from '@/components/shared/step-indicator';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const HOUR_OPTIONS = [
    { value: 1, label: '1h' },
    { value: 2, label: '2h' },
    { value: 4, label: '4h' },
    { value: 6, label: '6h+' },
];

function formatWake(wakeTime: string): string {
    const [h, m] = wakeTime.split(':').map(Number);
    const ampm = h < 12 ? 'AM' : 'PM';
    const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
}

function adjustWake(wakeTime: string, deltaMinutes: number): string {
    const [h, m] = wakeTime.split(':').map(Number);
    let total = h * 60 + m + deltaMinutes;
    total = Math.max(5 * 60, Math.min(11 * 60, total));
    const nh = Math.floor(total / 60);
    const nm = total % 60;
    return `${String(nh).padStart(2, '0')}:${String(nm).padStart(2, '0')}:00`;
}

export default function OnboardingHoursPage() {
    const router = useRouter();
    const { dailyHourBudget, wakeTime, setDailyHourBudget, setWakeTime } =
        useOnboardingStore();

    return (
        <div className="pb-12">
            <button
                type="button"
                onClick={() => router.push(ROUTES.ONBOARDING_GOALS)}
                className="mb-5 flex items-center gap-1 text-sm text-[var(--color-text-secondary)]"
            >
                <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <StepIndicator step={2} />
            <h2 className="mb-1 text-[25px] font-bold tracking-tight">
                How much time do you have?
            </h2>
            <p className="mb-8 text-sm text-[var(--color-text-secondary)]">
                Per day, across all your goals
            </p>

            <div className="mb-8 flex gap-2.5">
                {HOUR_OPTIONS.map(opt => (
                    <button
                        key={opt.value}
                        type="button"
                        onClick={() => setDailyHourBudget(opt.value)}
                        className={cn(
                            'flex-1 rounded-xl border-[1.5px] py-2.5 text-[15px] font-medium transition-all',
                            dailyHourBudget === opt.value
                                ? 'border-[var(--color-primary)] bg-[color-mix(in_srgb,var(--color-primary)_12%,transparent)] text-[var(--color-primary)]'
                                : 'border-[var(--color-border-strong)] text-[var(--color-text-secondary)]'
                        )}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>

            <h3 className="mb-3.5 text-[17px] font-semibold">
                When do you wake up?
            </h3>
            <div className="mb-8 flex items-center justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-[18px]">
                <span className="text-sm text-[var(--color-text-secondary)]">
                    Wake time
                </span>
                <div className="flex items-center gap-3.5">
                    <button
                        type="button"
                        onClick={() => setWakeTime(adjustWake(wakeTime, -30))}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.12] text-[var(--color-text-secondary)]"
                    >
                        <Minus className="h-4 w-4" />
                    </button>
                    <span className="min-w-[80px] text-center text-[21px] font-semibold">
                        {formatWake(wakeTime)}
                    </span>
                    <button
                        type="button"
                        onClick={() => setWakeTime(adjustWake(wakeTime, 30))}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--color-primary)_30%,transparent)] bg-[color-mix(in_srgb,var(--color-primary)_10%,transparent)] text-[var(--color-primary)]"
                    >
                        <Plus className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <Button
                onClick={() => router.push(ROUTES.ONBOARDING_COMMITMENTS)}
                className="w-full rounded-2xl py-4 text-base"
            >
                Continue
            </Button>
        </div>
    );
}
