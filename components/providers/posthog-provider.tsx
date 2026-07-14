'use client';

import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { useEffect } from 'react';

export function PostHogProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
        if (key && typeof window !== 'undefined') {
            posthog.init(key, {
                api_host:
                    process.env.NEXT_PUBLIC_POSTHOG_HOST ??
                    'https://us.i.posthog.com',
                capture_pageview: true,
            });
        }
    }, []);

    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
        return <>{children}</>;
    }

    return <PHProvider client={posthog}>{children}</PHProvider>;
}

export function captureEvent(
    name: string,
    properties?: Record<string, unknown>
) {
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
        posthog.capture(name, properties);
    }
}
