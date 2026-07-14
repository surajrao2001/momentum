import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { goals } from '@/lib/db/schema';
import { createClient } from '@/lib/supabase/server';
import type { ApiResponse, ProgressOverview } from '@/types';

export async function GET() {
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

    try {
        const db = getDb();
        const rows = await db
            .select()
            .from(goals)
            .where(eq(goals.userId, user.id));

        const active = rows.filter(g => g.status !== 'archived');
        const overall =
            active.length > 0
                ? active.reduce((sum, g) => sum + Number(g.progressPct), 0) /
                  active.length
                : 0;

        const data: ProgressOverview = {
            overall_pct: Math.round(overall),
            goals: active.map(g => ({
                goal_id: g.id,
                title: g.title,
                icon: g.icon,
                progress_pct: Number(g.progressPct),
                color_token: g.colorToken,
            })),
        };

        return NextResponse.json<ApiResponse<ProgressOverview>>({
            success: true,
            data,
            error: null,
        });
    } catch {
        const { data: goalRows } = await supabase
            .from('goals')
            .select('*')
            .neq('status', 'archived');
        const list = goalRows ?? [];
        const overall = list.length
            ? list.reduce((s, g) => s + g.progress_pct, 0) / list.length
            : 0;
        return NextResponse.json<ApiResponse<ProgressOverview>>({
            success: true,
            data: {
                overall_pct: Math.round(overall),
                goals: list.map(g => ({
                    goal_id: g.id,
                    title: g.title,
                    icon: g.icon,
                    progress_pct: g.progress_pct,
                    color_token: g.color_token,
                })),
            },
            error: null,
        });
    }
}
