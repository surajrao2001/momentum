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
    displayName: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
});

type FormData = z.infer<typeof schema>;

function getSignupErrorMessage(err: unknown): string {
    if (!(err instanceof Error))
        return 'We could not create your account right now. Please try again.';
    const message = err.message.toLowerCase();
    if (
        message.includes('already registered') ||
        message.includes('already exists')
    ) {
        return 'This email is already registered. Please log in instead.';
    }
    return 'We could not create your account right now. Please try again.';
}

export default function SignupPage() {
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
            const authData = await api.auth.signUp(
                data.email,
                data.password,
                data.displayName
            );
            if (authData.session) {
                router.push(ROUTES.ONBOARDING_GOALS);
            } else {
                router.push(
                    `${ROUTES.VERIFY_EMAIL}?email=${encodeURIComponent(data.email)}`
                );
            }
            router.refresh();
        } catch (err) {
            setError(getSignupErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] p-[22px]">
            <div className="w-full max-w-md">
                <div className="mb-8 flex justify-center">
                    <BrandLogo />
                </div>
                <h1 className="mb-8 text-center text-2xl font-bold tracking-tight">
                    Create account
                </h1>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-4"
                >
                    <Input
                        label="Display name"
                        error={errors.displayName?.message}
                        {...register('displayName')}
                    />
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
                        Sign up
                    </Button>
                </form>

                <p className="mt-3 text-center text-xs text-[var(--color-text-secondary)]">
                    After signup, check your inbox to verify your email before
                    your first login.
                </p>

                <p className="mt-6 text-center text-sm text-[var(--color-text-secondary)]">
                    Already have an account?{' '}
                    <Link
                        href={ROUTES.LOGIN}
                        className="font-medium text-[var(--color-primary)]"
                    >
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}
