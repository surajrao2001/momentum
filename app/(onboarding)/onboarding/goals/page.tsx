'use client';

import { useRouter } from 'next/navigation';
import { GOAL_TEMPLATES } from '@/types';
import { ROUTES } from '@/lib/routes';
import { useOnboardingStore } from '@/stores/onboarding';
import { BrandLogo } from '@/components/shared/brand-logo';
import { StepIndicator } from '@/components/shared/step-indicator';
import { GoalChip } from '@/components/shared/goal-chip';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function OnboardingGoalsPage() {
    const router = useRouter();
    const { goals, toggleGoal, setCustomGoal } = useOnboardingStore();
    const [showCustom, setShowCustom] = useState(false);
    const [customTitle, setCustomTitle] = useState('');
    const [customIcon, setCustomIcon] = useState('✦');

    return (
        <div className="pb-12">
            <BrandLogo className="mb-9 mt-2.5" />
            <StepIndicator step={1} />
            <h2 className="mb-1 text-[25px] font-bold tracking-tight">
                What&apos;s your goal?
            </h2>
            <p className="mb-6 text-sm text-[var(--color-text-secondary)]">
                Pick up to 4 — we&apos;ll build the plan
            </p>

            <div>
                {GOAL_TEMPLATES.map(g => (
                    <GoalChip
                        key={g.title}
                        icon={g.icon}
                        label={g.title}
                        description={g.description}
                        selected={goals.some(s => s.title === g.title)}
                        disabled={
                            !goals.some(s => s.title === g.title) &&
                            goals.length >= 4
                        }
                        onClick={() => toggleGoal(g)}
                    />
                ))}
                {showCustom ? (
                    <div className="mb-2 flex gap-2">
                        <Input
                            value={customIcon}
                            onChange={e => setCustomIcon(e.target.value)}
                            className="w-16"
                        />
                        <Input
                            value={customTitle}
                            onChange={e => setCustomTitle(e.target.value)}
                            placeholder="Custom goal"
                            className="flex-1"
                        />
                        <Button
                            onClick={() => {
                                if (customTitle.trim()) {
                                    setCustomGoal(
                                        customTitle.trim(),
                                        customIcon
                                    );
                                    setShowCustom(false);
                                    setCustomTitle('');
                                }
                            }}
                        >
                            Add
                        </Button>
                    </div>
                ) : (
                    <GoalChip
                        icon="✦"
                        label="Custom Goal"
                        description="AI generates your roadmap"
                        dashed
                        onClick={() => setShowCustom(true)}
                    />
                )}
            </div>

            <Button
                disabled={goals.length === 0}
                onClick={() => router.push(ROUTES.ONBOARDING_HOURS)}
                className="mt-2 w-full rounded-2xl py-4 text-base"
            >
                Continue
            </Button>
        </div>
    );
}
