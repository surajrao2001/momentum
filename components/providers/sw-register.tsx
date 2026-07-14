'use client';

import { useEffect } from 'react';
import { flushOfflineQueue } from '@/lib/offline-queue';

export function ServiceWorkerRegister() {
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(() => {});
        }
        const handleOnline = () => flushOfflineQueue();
        window.addEventListener('online', handleOnline);
        return () => window.removeEventListener('online', handleOnline);
    }, []);
    return null;
}
