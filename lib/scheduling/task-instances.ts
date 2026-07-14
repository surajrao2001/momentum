import { addDays, todayUtc } from '@/lib/timezone';
import { buildTaskTitleForDay } from '@/lib/scheduling/plan-generator';
import type { GoalCategory, RecurrenceRule } from '@/types';

const DAY_MAP: Record<string, number> = {
    sun: 0,
    mon: 1,
    tue: 2,
    wed: 3,
    thu: 4,
    fri: 5,
    sat: 6,
};

export type MaterializeRule = RecurrenceRule & {
    id: string;
    category_type?: GoalCategory;
    goal_title?: string;
};

function dateForDayInWindow(
    startDate: string,
    dayName: string,
    offsetWeeks = 0
): string | null {
    const target = DAY_MAP[dayName];
    if (target === undefined) return null;
    const base = new Date(startDate);
    const current = base.getUTCDay();
    let diff = target - current;
    if (diff < 0) diff += 7;
    diff += offsetWeeks * 7;
    return addDays(startDate, diff);
}

function resolveTitle(
    rule: MaterializeRule,
    day: string,
    weekIndex: number
): { title: string; sub_tasks: string[] | null } {
    if (rule.is_fixed_commitment || !rule.category_type || !rule.goal_title) {
        if (rule.rotation_set?.length) {
            const item =
                rule.rotation_set[weekIndex % rule.rotation_set.length];
            const title = rule.title_template
                .replace('{split_day}', item)
                .replace('{theme}', item);
            return { title, sub_tasks: null };
        }
        return { title: rule.title_template, sub_tasks: null };
    }

    const built = buildTaskTitleForDay({
        category: rule.category_type,
        goalTitle: rule.goal_title,
        day,
        weekIndex,
    });
    return built;
}

export interface GeneratedTask {
    recurrence_rule_id: string;
    goal_id: string | null;
    title: string;
    sub_tasks: string[] | null;
    scheduled_date: string;
    start_time: string;
    duration_minutes: number;
}

export function materializeTaskInstances(
    rules: MaterializeRule[],
    fromDate: string,
    daysAhead = 30
): GeneratedTask[] {
    const tasks: GeneratedTask[] = [];
    const endDate = addDays(fromDate, daysAhead);

    for (const rule of rules) {
        if (!rule.active) continue;
        let cursor = fromDate;
        let weekCount = 0;

        while (cursor <= endDate) {
            for (const day of rule.days_of_week) {
                const scheduled = dateForDayInWindow(cursor, day, 0);
                if (!scheduled || scheduled < fromDate || scheduled > endDate)
                    continue;

                const { title, sub_tasks } = resolveTitle(rule, day, weekCount);
                tasks.push({
                    recurrence_rule_id: rule.id,
                    goal_id: rule.goal_id,
                    title,
                    sub_tasks,
                    scheduled_date: scheduled,
                    start_time: rule.start_time,
                    duration_minutes: rule.duration_minutes,
                });
            }
            cursor = addDays(cursor, 7);
            weekCount++;
        }
    }

    return tasks;
}

export function materializeFromDate(startDate = todayUtc(), daysAhead = 30) {
    return { startDate, endDate: addDays(startDate, daysAhead) };
}
