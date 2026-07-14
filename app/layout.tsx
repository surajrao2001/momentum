import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { PostHogProvider } from '@/components/providers/posthog-provider';
import { QueryProvider } from '@/components/providers/query-provider';
import { ServiceWorkerRegister } from '@/components/providers/sw-register';
import { ThemeProvider } from '@/components/providers/theme-provider';
import './globals.css';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-sans',
});

export const metadata: Metadata = {
    title: 'Momentum',
    description: 'AI personal operating system',
    manifest: '/manifest.json',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.variable} antialiased`}>
                <ThemeProvider>
                    <QueryProvider>
                        <PostHogProvider>
                            <ServiceWorkerRegister />
                            {children}
                        </PostHogProvider>
                    </QueryProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
