'use client';

import { useTheme } from 'next-themes';
import { useUpdateProfile } from '@/hooks';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const updateProfile = useUpdateProfile();

    const cycle = () => {
        const next =
            theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
        setTheme(next);
        updateProfile.mutate({
            theme_preference: next as 'light' | 'dark' | 'system',
        });
    };

    const icon =
        resolvedTheme === 'dark'
            ? '🌙'
            : resolvedTheme === 'light'
              ? '☀️'
              : '💻';

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={cycle}
            aria-label="Toggle theme"
            suppressHydrationWarning
        >
            {icon}
        </Button>
    );
}
