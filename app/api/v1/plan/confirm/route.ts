import { NextResponse } from 'next/server';
import { materializeTaskInstances } from '@/lib/scheduling/task-instances';
import { todayUtc } from '@/lib/timezone';
import { createClient } from '@/lib/supabase/server';
import type { ApiResponse, GoalCategory, PlanGenerateResponse } from '@/types';

const WEEKS_PER_GOAL = 8;

export async function POST(request: Request) {
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

    // Backfill profile row for accounts created before trigger existed.
    const { data: existingProfile } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

    if (!existingProfile) {
        const { error: profileInsertError } = await supabase
            .from('users')
            .insert({
                id: user.id,
                email: user.email ?? '',
                display_name:
                    (user.user_metadata?.display_name as string | undefined) ??
                    (user.email ? user.email.split('@')[0] : 'User'),
            });

        if (profileInsertError) {
            return NextResponse.json<ApiResponse<null>>(
                {
                    success: false,
                    data: null,
                    error: {
                        code: 'PROFILE_INSERT_FAILED',
                        message: profileInsertError.message,
                    },
                },
                { status: 500 }
            );
        }
    }

    const preview = (await request.json()) as PlanGenerateResponse;
    const goalIdMap = new Map<string, string>();
    const goalRules = preview.recurrence_rules.filter(
        r => r.goal_id && !r.is_fixed_commitment
    );
    const uniqueGoalIds = [...new Set(goalRules.map(r => r.goal_id!))];

    const goalMeta = new Map<
        string,
        { category: GoalCategory; title: string }
    >();
    let roadmapOffset = 0;
    for (const tempGoalId of uniqueGoalIds) {
        const block = preview.preview_blocks.find(
            b => b.goal_id === tempGoalId
        );
        if (!block || goalIdMap.has(tempGoalId)) continue;
        const category: GoalCategory =
            block.goal_title.toLowerCase().includes('muscle') ||
            block.goal_title.toLowerCase().includes('marathon')
                ? 'fitness'
                : block.goal_title.toLowerCase().includes('software') ||
                    block.goal_title.toLowerCase().includes('job')
                  ? 'career'
                  : block.goal_title.toLowerCase().includes('dance') ||
                      block.goal_title.toLowerCase().includes('guitar')
                    ? 'creative'
                    : 'custom';

        goalMeta.set(tempGoalId, { category, title: block.goal_title });

        const { data: goal, error } = await supabase
            .from('goals')
            .insert({
                user_id: user.id,
                title: block.goal_title,
                icon: block.goal_icon,
                color_token: block.color_token,
                category_type: category,
                target_weeks: WEEKS_PER_GOAL,
                weekly_hour_allocation: 4,
                status: 'active',
                progress_pct: 0,
                started_at: todayUtc(),
            })
            .select()
            .single();
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
        goalIdMap.set(tempGoalId, goal.id);

        const goalRoadmaps = preview.roadmaps.slice(
            roadmapOffset,
            roadmapOffset + WEEKS_PER_GOAL
        );
        roadmapOffset += WEEKS_PER_GOAL;
        if (goalRoadmaps.length) {
            await supabase.from('roadmaps').insert(
                goalRoadmaps.map(r => ({
                    goal_id: goal.id,
                    week_number: r.week_number,
                    theme: r.theme,
                    sub_topics: r.sub_topics,
                    status: r.status,
                }))
            );
        }
    }

    const insertedRules: Array<{
        id: string;
        goal_id: string | null;
        title_template: string;
        days_of_week: string[];
        start_time: string;
        duration_minutes: number;
        rotation_set: string[] | null;
        rotation_index_field: string | null;
        is_fixed_commitment: boolean;
        active: boolean;
        category_type?: GoalCategory;
        goal_title?: string;
    }> = [];

    for (const rule of preview.recurrence_rules) {
        const mappedGoalId = rule.goal_id
            ? (goalIdMap.get(rule.goal_id) ?? null)
            : null;
        const meta = rule.goal_id ? goalMeta.get(rule.goal_id) : null;
        const { data, error } = await supabase
            .from('recurrence_rules')
            .insert({
                user_id: user.id,
                goal_id: mappedGoalId,
                title_template: rule.title_template,
                days_of_week: rule.days_of_week,
                start_time: rule.start_time,
                duration_minutes: rule.duration_minutes,
                rotation_set: rule.rotation_set,
                rotation_index_field: rule.rotation_index_field,
                is_fixed_commitment: rule.is_fixed_commitment,
                active: rule.active,
            })
            .select()
            .single();
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
        insertedRules.push({
            ...data,
            category_type: meta?.category,
            goal_title: meta?.title,
        });
    }

    const tasks = materializeTaskInstances(
        insertedRules.map(r => ({
            ...r,
            user_id: user.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })),
        todayUtc(),
        30
    );

    if (tasks.length) {
        await supabase.from('task_instances').insert(
            tasks.map(t => ({
                user_id: user.id,
                goal_id: t.goal_id,
                recurrence_rule_id: t.recurrence_rule_id,
                title: t.title,
                sub_tasks: t.sub_tasks,
                scheduled_date: t.scheduled_date,
                start_time: t.start_time,
                duration_minutes: t.duration_minutes,
                status: 'pending',
            }))
        );
    }

    await supabase
        .from('users')
        .update({
            onboarding_completed: true,
            updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

    return NextResponse.json<ApiResponse<{ success: boolean }>>({
        success: true,
        data: { success: true },
        error: null,
    });
}
