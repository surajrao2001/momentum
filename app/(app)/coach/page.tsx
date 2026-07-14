'use client';

import { useState } from 'react';
import { ArrowUp, Briefcase, Check, TrendingDown } from 'lucide-react';
import {
    useApplyCoachSuggestion,
    useCoachAsk,
    useCoachSuggestions,
    useDismissCoachSuggestion,
} from '@/hooks';
import { captureEvent } from '@/components/providers/posthog-provider';
import { SectionLabel } from '@/components/shared/section-label';
import { Button } from '@/components/ui/button';

export default function CoachPage() {
    const { data: suggestions = [] } = useCoachSuggestions();
    const apply = useApplyCoachSuggestion();
    const dismiss = useDismissCoachSuggestion();
    const ask = useCoachAsk();
    const [message, setMessage] = useState('');
    const [reply, setReply] = useState('');
    const [hidden, setHidden] = useState<Set<string>>(new Set());

    const active = suggestions.filter(
        s => s.status === 'pending' && !hidden.has(s.id)
    );
    const applied = suggestions.filter(s => s.status === 'applied');

    const handleAsk = async () => {
        if (!message.trim()) return;
        const result = await ask.mutateAsync(message);
        setReply(result.reply);
        setMessage('');
    };

    const handleDismiss = (id: string) => {
        setHidden(prev => new Set(prev).add(id));
        dismiss.mutate(id);
        captureEvent('coach_suggestion_dismissed', { id });
    };

    return (
        <div className="space-y-5 lg:max-w-2xl">
            <div>
                <h1 className="text-[22px] font-bold tracking-tight">Coach</h1>
                <p className="mt-1 text-[13px] text-[var(--color-text-muted)]">
                    Watching your patterns, nudging at the right time
                </p>
            </div>

            <SectionLabel>Active suggestions · {active.length}</SectionLabel>
            {active.length === 0 ? (
                <div className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm text-[var(--color-text-secondary)]">
                    No suggestions right now. Keep going!
                </div>
            ) : (
                active.map((s, i) => (
                    <div
                        key={s.id}
                        className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
                    >
                        <div className="mb-3 flex items-start gap-3">
                            <div
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px]"
                                style={{
                                    backgroundColor:
                                        i % 2 === 0
                                            ? 'color-mix(in srgb, var(--color-danger) 12%, transparent)'
                                            : 'color-mix(in srgb, var(--color-warning) 12%, transparent)',
                                }}
                            >
                                {i % 2 === 0 ? (
                                    <TrendingDown className="h-[18px] w-[18px] text-[var(--color-danger)]" />
                                ) : (
                                    <Briefcase className="h-[18px] w-[18px] text-[var(--color-warning)]" />
                                )}
                            </div>
                            <p className="text-sm leading-relaxed text-[#e2e8f0]">
                                {s.message}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="secondary"
                                size="sm"
                                className="flex-1 rounded-[10px]"
                                onClick={() => handleDismiss(s.id)}
                            >
                                Dismiss
                            </Button>
                            <Button
                                size="sm"
                                className="flex-[2] rounded-[10px]"
                                onClick={() => {
                                    apply.mutate(s.id);
                                    captureEvent('coach_suggestion_applied', {
                                        id: s.id,
                                    });
                                }}
                            >
                                Apply suggestion
                            </Button>
                        </div>
                    </div>
                ))
            )}

            {applied.length > 0 && (
                <>
                    <SectionLabel className="mt-2">
                        Applied · {applied.length}
                    </SectionLabel>
                    {applied.slice(0, 3).map(s => (
                        <div
                            key={s.id}
                            className="flex items-center gap-2.5 rounded-xl border border-[color-mix(in_srgb,var(--color-success)_10%,transparent)] bg-[color-mix(in_srgb,var(--color-success)_5%,transparent)] p-3 opacity-60"
                        >
                            <Check className="h-4 w-4 text-[var(--color-success)]" />
                            <span className="text-[13px] text-[var(--color-text-secondary)]">
                                {s.message}
                            </span>
                        </div>
                    ))}
                </>
            )}

            <SectionLabel>Ask coach</SectionLabel>
            <div className="flex items-center gap-2.5 rounded-[14px] border border-white/[0.07] bg-[var(--color-surface)] p-3.5">
                <input
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAsk()}
                    placeholder="Ask anything… 'Am I on track for the interview?'"
                    className="min-w-0 flex-1 border-none bg-transparent text-sm outline-none"
                />
                <button
                    type="button"
                    onClick={handleAsk}
                    disabled={ask.isPending}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] disabled:opacity-50"
                >
                    <ArrowUp className="h-4 w-4 text-white" />
                </button>
            </div>
            {reply && (
                <div className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm leading-relaxed">
                    {reply}
                </div>
            )}
        </div>
    );
}
