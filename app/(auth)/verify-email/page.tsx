'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { api } from '@/lib/api';
import { ROUTES } from '@/lib/routes';
import { BrandLogo } from '@/components/shared/brand-logo';
import { Button } from '@/components/ui/button';

function maskEmail(email: string): string {
    const [name, domain] = email.split('@');
    if (!name || !domain) return email;
    if (name.length <= 2) return `${name[0] ?? '*'}*@${domain}`;
    return `${name.slice(0, 2)}***@${domain}`;
}

export default function VerifyEmailPage() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email') ?? '';
    const [isSending, setIsSending] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleResend = async () => {
        if (!email) {
            setError('Missing email address. Please sign up again.');
            return;
        }
        setError(null);
        setMessage(null);
        setIsSending(true);
        try {
            await api.auth.resendVerificationEmail(email);
            setMessage(
                'Verification email sent again. Please check your inbox and spam folder.'
            );
        } catch {
            setError(
                'Could not resend verification email right now. Please try again in a moment.'
            );
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] p-[22px]">
            <div className="w-full max-w-md">
                <div className="mb-8 flex justify-center">
                    <BrandLogo />
                </div>
                <h1 className="mb-2 text-center text-2xl font-bold tracking-tight">
                    Verify your email
                </h1>
                <p className="mb-6 text-center text-sm text-[var(--color-text-secondary)]">
                    We sent a verification link to{' '}
                    {email ? maskEmail(email) : 'your email address'}.
                </p>

                <div className="mb-6 space-y-2 rounded-[var(--radius-chip)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3.5 text-sm text-[var(--color-text-secondary)]">
                    <p>1. Open your inbox and click the verification link.</p>
                    <p>2. Return here and log in to continue onboarding.</p>
                </div>

                {message && (
                    <p className="mb-4 rounded-xl border border-[var(--color-success)]/30 bg-[var(--color-surface)] p-3 text-sm text-[var(--color-success)]">
                        {message}
                    </p>
                )}
                {error && (
                    <p className="mb-4 rounded-xl border border-[var(--color-danger)]/30 bg-[var(--color-surface)] p-3 text-sm text-[var(--color-danger)]">
                        {error}
                    </p>
                )}

                <Button
                    className="w-full rounded-2xl"
                    variant="secondary"
                    onClick={handleResend}
                    isLoading={isSending}
                >
                    Resend verification email
                </Button>

                <Link
                    href={ROUTES.LOGIN}
                    className="mt-4 block text-center text-sm font-medium text-[var(--color-primary)]"
                >
                    Back to login
                </Link>
            </div>
        </div>
    );
}
