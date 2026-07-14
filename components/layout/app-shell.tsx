'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Brain, Home, LayoutList, Plus, Target, User } from 'lucide-react';
import { useState } from 'react';
import { DESKTOP_NAV_ITEMS, NAV_ITEMS, ROUTES } from '@/lib/routes';
import { useProfile } from '@/hooks';
import { cn } from '@/lib/utils';
import { BrandLogo } from '@/components/shared/brand-logo';
import { QuickAddSheet } from '@/components/shared/quick-add-sheet';

const NAV_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
    [ROUTES.TODAY]: Home,
    [ROUTES.TIMELINE]: LayoutList,
    [ROUTES.GOALS]: Target,
    [ROUTES.COACH]: Brain,
    [ROUTES.SETTINGS]: User,
};

export function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { data: profile } = useProfile();
    const [quickAddOpen, setQuickAddOpen] = useState(false);

    const isActive = (path: string) =>
        pathname === path || pathname.startsWith(`${path}/`);

    return (
        <div className="flex min-h-screen bg-[var(--color-bg)]">
            {/* Desktop sidebar */}
            <aside className="hidden w-64 shrink-0 flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)]/50 p-5 lg:flex">
                <BrandLogo className="mb-10 px-1" />
                <nav className="flex flex-1 flex-col gap-1">
                    {DESKTOP_NAV_ITEMS.map(item => {
                        const Icon = NAV_ICONS[item.path] ?? Home;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={cn(
                                    'flex min-h-[44px] items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors',
                                    isActive(item.path)
                                        ? 'bg-[color-mix(in_srgb,var(--color-primary)_12%,transparent)] text-[var(--color-primary)]'
                                        : 'text-[var(--color-text-secondary)] hover:bg-white/5 hover:text-[var(--color-text-primary)]'
                                )}
                            >
                                <Icon className="h-5 w-5" aria-hidden />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
                {profile?.display_name && (
                    <p className="px-3 text-xs text-[var(--color-text-muted)]">
                        {profile.display_name}
                    </p>
                )}
            </aside>

            <div className="flex min-w-0 flex-1 flex-col">
                <main className="mx-auto w-full max-w-2xl flex-1 px-[18px] pt-4 pb-28 lg:max-w-3xl lg:px-8 lg:pt-8 lg:pb-8 xl:max-w-4xl">
                    {children}
                </main>

                {/* Mobile bottom nav */}
                <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-border)] bg-[var(--color-bg)]/95 backdrop-blur-xl lg:hidden">
                    <div className="relative mx-auto flex max-w-lg items-start px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
                        {NAV_ITEMS.map(item => {
                            const Icon = NAV_ICONS[item.path] ?? Home;
                            const active = isActive(item.path);
                            return (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className={cn(
                                        'flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors',
                                        active
                                            ? 'text-[var(--color-primary)]'
                                            : 'text-[var(--color-text-muted)]'
                                    )}
                                >
                                    <Icon
                                        className="h-[22px] w-[22px]"
                                        aria-hidden
                                    />
                                    {item.label}
                                </Link>
                            );
                        })}
                        <button
                            type="button"
                            onClick={() => setQuickAddOpen(true)}
                            className="absolute -top-[22px] left-1/2 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full bg-[var(--color-primary)] shadow-[0_4px_24px_rgba(99,102,241,0.4)]"
                            aria-label="Quick add task"
                        >
                            <Plus
                                className="h-[22px] w-[22px] text-white"
                                aria-hidden
                            />
                        </button>
                    </div>
                </nav>

                <QuickAddSheet
                    open={quickAddOpen}
                    onOpenChange={setQuickAddOpen}
                />
            </div>
        </div>
    );
}
