import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getRoadmap } from '@/lib/scheduling/plan-generator';
import type { ApiResponse } from '@/types';

export async function POST(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
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

    const { data: goal, error: goalError } = await supabase
        .from('goals')
        .select('*')
        .eq('id', id)
        .single();
    if (goalError || !goal) {
        return NextResponse.json<ApiResponse<null>>(
            {
                success: false,
                data: null,
                error: { code: 'NOT_FOUND', message: 'Goal not found' },
            },
            { status: 404 }
        );
    }

    const weeks = goal.target_weeks ?? 8;
    const roadmap = getRoadmap(goal.category_type, goal.title).slice(0, weeks);
    const rows = roadmap.map((r, i) => ({
        goal_id: id,
        week_number: i + 1,
        theme: r.theme,
        sub_topics: r.sub_topics,
        status: i === 0 ? 'active' : 'upcoming',
    }));

    await supabase.from('roadmaps').delete().eq('goal_id', id);
    const { data, error } = await supabase
        .from('roadmaps')
        .insert(rows)
        .select();
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

    return NextResponse.json<ApiResponse<typeof data>>({
        success: true,
        data,
        error: null,
    });
}
