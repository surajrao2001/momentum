import { NextResponse } from 'next/server';
import {
    materializeTaskInstances,
    type MaterializeRule,
} from '@/lib/scheduling/task-instances';
import { todayUtc } from '@/lib/timezone';
import { createClient } from '@/lib/supabase/server';
import type { ApiResponse, GoalCategory } from '@/types';

const REGENERATE_DAYS = 30;

export async function POST() {
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

    const { data: rules, error: rulesError } = await supabase
        .from('recurrence_rules')
        .select('*, goal:goals(category_type, title)')
        .eq('user_id', user.id)
        .eq('active', true);

    if (rulesError) {
        return NextResponse.json<ApiResponse<null>>(
            {
                success: false,
                data: null,
                error: { code: 'DB_ERROR', message: rulesError.message },
            },
            { status: 500 }
        );
    }

    if (!rules?.length) {
        return NextResponse.json<ApiResponse<null>>(
            {
                success: false,
                data: null,
                error: {
                    code: 'NO_RULES',
                    message:
                        'No schedule found. Complete onboarding first to generate your plan.',
                },
            },
            { status: 404 }
        );
    }

    const { data: completedSlots, error: completedError } = await supabase
        .from('task_instances')
        .select('recurrence_rule_id, scheduled_date')
        .eq('user_id', user.id)
        .in('status', ['done', 'partial']);

    if (completedError) {
        return NextResponse.json<ApiResponse<null>>(
            {
                success: false,
                data: null,
                error: { code: 'DB_ERROR', message: completedError.message },
            },
            { status: 500 }
        );
    }

    const preserved = new Set(
        (completedSlots ?? [])
            .filter(row => row.recurrence_rule_id)
            .map(row => `${row.recurrence_rule_id}:${row.scheduled_date}`)
    );

    const { error: deleteError } = await supabase
        .from('task_instances')
        .delete()
        .eq('user_id', user.id)
        .in('status', ['pending', 'missed', 'skipped', 'rescheduled']);

    if (deleteError) {
        return NextResponse.json<ApiResponse<null>>(
            {
                success: false,
                data: null,
                error: { code: 'DB_ERROR', message: deleteError.message },
            },
            { status: 500 }
        );
    }

    type RuleRow = (typeof rules)[number] & {
        goal: { category_type: GoalCategory; title: string } | null;
    };

    const materializeRules: MaterializeRule[] = (rules as RuleRow[]).map(
        rule => ({
            id: rule.id,
            user_id: rule.user_id,
            goal_id: rule.goal_id,
            title_template: rule.title_template,
            days_of_week: rule.days_of_week,
            start_time: rule.start_time,
            duration_minutes: rule.duration_minutes,
            rotation_set: rule.rotation_set as string[] | null,
            rotation_index_field: rule.rotation_index_field,
            is_fixed_commitment: rule.is_fixed_commitment,
            active: rule.active,
            created_at: rule.created_at,
            updated_at: rule.updated_at,
            category_type: rule.goal?.category_type,
            goal_title: rule.goal?.title,
        })
    );

    const fromDate = todayUtc();
    const generated = materializeTaskInstances(
        materializeRules,
        fromDate,
        REGENERATE_DAYS
    ).filter(
        task =>
            !preserved.has(`${task.recurrence_rule_id}:${task.scheduled_date}`)
    );

    if (generated.length) {
        const { error: insertError } = await supabase
            .from('task_instances')
            .insert(
                generated.map(task => ({
                    user_id: user.id,
                    goal_id: task.goal_id,
                    recurrence_rule_id: task.recurrence_rule_id,
                    title: task.title,
                    sub_tasks: task.sub_tasks,
                    scheduled_date: task.scheduled_date,
                    start_time: task.start_time,
                    duration_minutes: task.duration_minutes,
                    status: 'pending',
                }))
            );

        if (insertError) {
            return NextResponse.json<ApiResponse<null>>(
                {
                    success: false,
                    data: null,
                    error: { code: 'DB_ERROR', message: insertError.message },
                },
                { status: 500 }
            );
        }
    }

    return NextResponse.json<
        ApiResponse<{ created: number; preserved: number }>
    >({
        success: true,
        data: { created: generated.length, preserved: preserved.size },
        error: null,
    });
}
