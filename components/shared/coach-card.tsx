'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export interface CoachCardProps {
    message: string;
    onApply?: () => void;
    onDismiss?: () => void;
    applyLabel?: string;
}

export function CoachCard({
    message,
    onApply,
    onDismiss,
    applyLabel = 'View suggestion',
}: CoachCardProps) {
    return (
        <Card className="border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5">
            <CardContent>
                <p className="text-[15px] text-[var(--color-text-primary)]">
                    {message}
                </p>
                <div className="mt-3 flex gap-2">
                    {onApply && (
                        <Button size="sm" onClick={onApply}>
                            {applyLabel}
                        </Button>
                    )}
                    {onDismiss && (
                        <Button size="sm" variant="ghost" onClick={onDismiss}>
                            Dismiss
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
