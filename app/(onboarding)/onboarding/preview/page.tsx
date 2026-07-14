'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { useConfirmPlan, useGeneratePlan } from '@/hooks';
import { captureEvent } from '@/components/providers/posthog-provider';
import { ROUTES } from '@/lib/routes';
import { useOnboardingStore } from '@/stores/onboarding';
import type { PlanPreviewBlock } from '@/types';
import { StepIndicator } from '@/components/shared/step-indicator';
import { WeekGrid } from '@/components/shared/week-grid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TimePicker } from '@/components/shared/time-picker';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';

export default function OnboardingPreviewPage() {
    const router = useRouter();
    const {
        goals,
        dailyHourBudget,
        wakeTime,
        fixedCommitments,
        planPreview,
        setPlanPreview,
        updateBlock,
    } = useOnboardingStore();
    const generatePlan = useGeneratePlan();
    const confirmPlan = useConfirmPlan();
    const [editingBlock, setEditingBlock] = useState<PlanPreviewBlock | null>(
        null
    );
    const [confirmError, setConfirmError] = useState<string | null>(null);
    const [regenerateError, setRegenerateError] = useState<string | null>(null);

    useEffect(() => {
        if (!planPreview && goals.length === 0 && !generatePlan.isPending) {
            router.replace(ROUTES.ONBOARDING_GOALS);
            return;
        }
        if (
            !planPreview &&
            goals.length > 0 &&
            !generatePlan.isPending &&
            !generatePlan.isSuccess
        ) {
            generatePlan.mutate(
                {
                    goals,
                    daily_hour_budget: dailyHourBudget,
                    wake_time: wakeTime,
                    fixed_commitments: fixedCommitments,
                },
                {
                    onSuccess: data => {
                        setPlanPreview(data);
                        captureEvent('plan_generated');
                    },
                }
            );
        }
    }, [
        planPreview,
        goals,
        dailyHourBudget,
        wakeTime,
        fixedCommitments,
        generatePlan.isPending,
        generatePlan.isSuccess,
        router,
        setPlanPreview,
    ]);

    const legend = useMemo(() => {
        if (!planPreview) return [];
        const seen = new Map<string, string>();
        planPreview.preview_blocks.forEach(b => {
            if (!seen.has(b.goal_id)) seen.set(b.goal_id, b.color_token);
        });
        return Array.from(seen.entries()).map(([goalId, color]) => {
            const block = planPreview.preview_blocks.find(
                b => b.goal_id === goalId
            );
            return { label: block?.goal_title ?? goalId, color };
        });
    }, [planPreview]);

    const handleConfirm = async () => {
        if (!planPreview) return;
        setConfirmError(null);
        try {
            await confirmPlan.mutateAsync(planPreview);
            captureEvent('plan_confirmed');
            captureEvent('onboarding_completed');
            router.push(ROUTES.TODAY);
            router.refresh();
        } catch (error) {
            captureEvent('plan_confirm_failed');
            setConfirmError(
                error instanceof Error
                    ? error.message
                    : 'Could not confirm plan.'
            );
        }
    };

    const handleRegenerate = () => {
        setRegenerateError(null);
        generatePlan.mutate(
            {
                goals,
                daily_hour_budget: dailyHourBudget,
                wake_time: wakeTime,
                fixed_commitments: fixedCommitments,
            },
            {
                onSuccess: data => {
                    setPlanPreview(data);
                    captureEvent('plan_regenerated');
                },
                onError: error => {
                    captureEvent('plan_regenerate_failed');
                    setRegenerateError(
                        error instanceof Error
                            ? error.message
                            : 'Could not regenerate.'
                    );
                },
            }
        );
    };

    const hasPlan = !!planPreview && planPreview.preview_blocks.length > 0;

    if (generatePlan.isPending) {
        return (
            <div className="flex flex-col items-center py-16">
                <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-primary)] border-t-transparent" />
                <p className="text-[var(--color-text-secondary)]">
                    Building your schedule…
                </p>
            </div>
        );
    }

    return (
        <div className="pb-12">
            <button
                type="button"
                onClick={() => router.push(ROUTES.ONBOARDING_COMMITMENTS)}
                className="mb-5 flex items-center gap-1 text-sm text-[var(--color-text-secondary)]"
            >
                <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <StepIndicator step={4} />
            <h2 className="mb-1 text-[23px] font-bold tracking-tight">
                Here&apos;s your first week
            </h2>
            <p className="mb-4 text-[13px] text-[var(--color-text-secondary)]">
                Tap any block to adjust · Drag to reschedule
            </p>

            {planPreview && (
                <WeekGrid
                    blocks={planPreview.preview_blocks}
                    onBlockClick={setEditingBlock}
                />
            )}

            {legend.length > 0 && (
                <div className="my-5 flex flex-wrap gap-3.5">
                    {legend.map(item => (
                        <div
                            key={item.label}
                            className="flex items-center gap-1.5"
                        >
                            <div
                                className="h-2.5 w-2.5 rounded-sm"
                                style={{ backgroundColor: item.color }}
                            />
                            <span className="text-[11px] text-[var(--color-text-secondary)]">
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {!hasPlan && (
                <div className="mb-3 rounded-[var(--radius-chip)] border border-[var(--color-warning)]/30 bg-[var(--color-surface)] p-3 text-sm text-[var(--color-text-secondary)]">
                    We could not build a valid preview yet. Go back and select
                    at least one goal.
                </div>
            )}
            {confirmError && (
                <div className="mb-3 rounded-[var(--radius-chip)] border border-[var(--color-danger)]/30 bg-[var(--color-surface)] p-3 text-sm text-[var(--color-danger)]">
                    We could not save your plan. Please retry.
                </div>
            )}
            {regenerateError && (
                <div className="mb-3 rounded-[var(--radius-chip)] border border-[var(--color-danger)]/30 bg-[var(--color-surface)] p-3 text-sm text-[var(--color-danger)]">
                    Regeneration failed. Please try again.
                </div>
            )}

            <div className="flex gap-3">
                <Button
                    variant="secondary"
                    onClick={handleRegenerate}
                    isLoading={generatePlan.isPending}
                    className="flex-1 rounded-[14px] py-3.5"
                >
                    <RefreshCw className="mr-1.5 h-4 w-4" /> Regenerate
                </Button>
                <Button
                    onClick={handleConfirm}
                    isLoading={confirmPlan.isPending}
                    disabled={!hasPlan}
                    className="flex-[2] rounded-[14px] py-3.5"
                >
                    Looks good →
                </Button>
            </div>

            <Sheet
                open={!!editingBlock}
                onOpenChange={open => !open && setEditingBlock(null)}
            >
                <SheetContent
                    side="bottom"
                    className="rounded-t-[20px] border-0 bg-[var(--color-surface-muted)]"
                >
                    <SheetHeader>
                        <SheetTitle>Edit block</SheetTitle>
                    </SheetHeader>
                    {editingBlock && (
                        <div className="mt-4 flex flex-col gap-4">
                            <Input
                                label="Title"
                                value={editingBlock.title}
                                onChange={e =>
                                    setEditingBlock({
                                        ...editingBlock,
                                        title: e.target.value,
                                    })
                                }
                            />
                            <TimePicker
                                label="Start time"
                                value={editingBlock.start_time}
                                onChange={t =>
                                    setEditingBlock({
                                        ...editingBlock,
                                        start_time: t,
                                    })
                                }
                            />
                            <Input
                                label="Duration (minutes)"
                                type="number"
                                value={editingBlock.duration_minutes}
                                onChange={e =>
                                    setEditingBlock({
                                        ...editingBlock,
                                        duration_minutes: Number(
                                            e.target.value
                                        ),
                                    })
                                }
                            />
                            <Button
                                onClick={() => {
                                    updateBlock(editingBlock);
                                    setEditingBlock(null);
                                }}
                                className="rounded-2xl"
                            >
                                Save
                            </Button>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}
