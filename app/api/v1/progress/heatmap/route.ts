import { NextResponse } from 'next/server';
import { addDays, todayUtc } from '@/lib/timezone';
import { createClient } from '@/lib/supabase/server';
import type { ApiResponse, HeatmapDay } from '@/types';

export async function GET(request: Request) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json<ApiResponse<null>>(
            {
                success: false,
                data: null,
                error: { code: 'UNAUTHORIZED', message: 'Not authenticated' },
            },
            { status: 401 }
        );
    }

    const { searchParams } = new URL(request.url);
    const days = Number(searchParams.get('days') ?? 90);
    const from = addDays(todayUtc(), -days);

    const { data: tasks, error } = await supabase
        .from('task_instances')
        .select('scheduled_date, status')
        .gte('scheduled_date', from)
        .lte('scheduled_date', todayUtc());

    if (error) {
        return NextResponse.json<ApiResponse<null>>(
            {
                success: false,
                data: null,
                error: { code: 'DB_ERROR', message: error.message },
            },
            { status: 500 }
        );
    }

    const byDate = new Map<string, { total: number; done: number }>();
    (tasks ?? []).forEach(t => {
        const entry = byDate.get(t.scheduled_date) ?? { total: 0, done: 0 };
        entry.total++;
        if (t.status === 'done' || t.status === 'partial') entry.done++;
        byDate.set(t.scheduled_date, entry);
    });

    const data: HeatmapDay[] = Array.from(byDate.entries()).map(
        ([date, { total, done }]) => ({
            date,
            completion_pct: total ? Math.round((done / total) * 100) : 0,
        })
    );

    return NextResponse.json<ApiResponse<HeatmapDay[]>>({
        success: true,
        data,
        error: null,
    });
}
