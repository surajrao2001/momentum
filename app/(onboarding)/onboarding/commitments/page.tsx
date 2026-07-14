'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { useOnboardingStore } from '@/stores/onboarding';
import { StepIndicator } from '@/components/shared/step-indicator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function OnboardingCommitmentsPage() {
    const router = useRouter();
    const { fixedCommitments, addCommitment, removeCommitment } =
        useOnboardingStore();
    const [text, setText] = useState('');

    const handleAdd = () => {
        if (!text.trim()) return;
        addCommitment({
            title: text,
            days_of_week: ['mon', 'tue', 'wed', 'thu', 'fri'],
            start_time: '09:00:00',
            duration_minutes: 480,
        });
        setText('');
    };

    return (
        <div className="pb-12">
            <button
                type="button"
                onClick={() => router.push(ROUTES.ONBOARDING_HOURS)}
                className="mb-5 flex items-center gap-1 text-sm text-[var(--color-text-secondary)]"
            >
                <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <StepIndicator step={3} />
            <div className="mb-1 flex items-center gap-2.5">
                <h2 className="text-[25px] font-bold tracking-tight">
                    Any fixed blocks?
                </h2>
                <span className="rounded-md bg-white/[0.07] px-2 py-0.5 text-[11px] text-[var(--color-text-secondary)]">
                    Optional
                </span>
            </div>
            <p className="mb-6 text-sm text-[var(--color-text-secondary)]">
                We&apos;ll schedule around these automatically
            </p>

            {fixedCommitments.map((c, i) => (
                <div
                    key={i}
                    className="mb-2.5 flex items-center gap-3 rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3.5"
                >
                    <span className="text-lg">🏢</span>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{c.title}</p>
                        <p className="text-xs text-[var(--color-text-secondary)]">
                            Mon – Fri · scheduled block
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => removeCommitment(i)}
                        className="flex h-5 w-5 items-center justify-center rounded-full border border-white/[0.12]"
                    >
                        <X className="h-2.5 w-2.5 text-[var(--color-text-secondary)]" />
                    </button>
                </div>
            ))}

            <div className="mb-7 flex items-center gap-3 rounded-[14px] border border-dashed border-white/[0.07] bg-[var(--color-surface)] px-4 py-3.5">
                <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[9px] bg-white/[0.05]">
                    <Plus className="h-4 w-4 text-[var(--color-text-secondary)]" />
                </div>
                <Input
                    placeholder='Add a commitment… "Class 6–8 PM Tuesdays"'
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAdd()}
                    className="border-none bg-transparent p-0 shadow-none"
                />
            </div>

            <div className="flex gap-2.5">
                <Button
                    variant="secondary"
                    onClick={() => router.push(ROUTES.ONBOARDING_PREVIEW)}
                    className="flex-1 rounded-[14px] py-3.5"
                >
                    Skip
                </Button>
                <Button
                    onClick={() => router.push(ROUTES.ONBOARDING_PREVIEW)}
                    className="flex-[2] rounded-[14px] py-3.5"
                >
                    Continue
                </Button>
            </div>
        </div>
    );
}
