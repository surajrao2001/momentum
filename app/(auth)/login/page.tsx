'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@/lib/api';
import { ROUTES } from '@/lib/routes';
import { BrandLogo } from '@/components/shared/brand-logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

type FormData = z.infer<typeof schema>;

function getLoginErrorMessage(err: unknown): string {
    if (!(err instanceof Error)) return 'Login failed. Please try again.';
    const message = err.message.toLowerCase();
    if (
        message.includes('email not confirmed') ||
        message.includes('not confirmed')
    ) {
        return 'Please verify your email first. Check your inbox, then try again.';
    }
    if (message.includes('invalid login credentials')) {
        return 'Incorrect email or password. Please try again.';
    }
    return 'Login failed. Please try again.';
}

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        setError('');
        setLoading(true);
        try {
            await api.auth.signIn(data.email, data.password);
            router.push(ROUTES.TODAY);
            router.refresh();
        } catch (err) {
            setError(getLoginErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    const handleGoogle = async () => {
        try {
            await api.auth.signInWithGoogle();
        } catch {
            setError('Google sign-in failed. Please try again.');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] p-[22px]">
            <div className="w-full max-w-md">
                <div className="mb-8 flex justify-center">
                    <BrandLogo />
                </div>
                <h1 className="mb-1 text-center text-2xl font-bold tracking-tight">
                    Welcome back
                </h1>
                <p className="mb-8 text-center text-sm text-[var(--color-text-secondary)]">
                    Tell us your goal. We&apos;ll build your day.
                </p>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-4"
                >
                    <Input
                        label="Email"
                        type="email"
                        error={errors.email?.message}
                        {...register('email')}
                    />
                    <Input
                        label="Password"
                        type="password"
                        error={errors.password?.message}
                        {...register('password')}
                    />
                    {error && (
                        <div className="rounded-xl border border-[var(--color-danger)]/30 bg-[var(--color-surface)] p-3 text-sm text-[var(--color-danger)]">
                            {error}
                        </div>
                    )}
                    <Button
                        type="submit"
                        isLoading={loading}
                        className="w-full rounded-2xl py-4"
                    >
                        Log in
                    </Button>
                </form>

                <div className="my-5 flex items-center gap-3">
                    <div className="h-px flex-1 bg-[var(--color-border)]" />
                    <span className="text-xs text-[var(--color-text-muted)]">
                        or
                    </span>
                    <div className="h-px flex-1 bg-[var(--color-border)]" />
                </div>

                <Button
                    variant="secondary"
                    className="w-full rounded-2xl py-4"
                    onClick={handleGoogle}
                >
                    Continue with Google
                </Button>

                <p className="mt-8 text-center text-sm text-[var(--color-text-secondary)]">
                    New here?{' '}
                    <Link
                        href={ROUTES.SIGNUP}
                        className="font-medium text-[var(--color-primary)]"
                    >
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
