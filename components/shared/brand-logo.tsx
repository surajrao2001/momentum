import { Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BrandLogo({ className }: { className?: string }) {
    return (
        <div className={cn('flex items-center gap-2.5', className)}>
            <div className="flex h-[30px] w-[30px] items-center justify-center rounded-[9px] bg-[var(--color-primary)]">
                <Zap className="h-4 w-4 text-white" aria-hidden />
            </div>
            <span className="text-lg font-bold tracking-tight">momentum</span>
        </div>
    );
}
