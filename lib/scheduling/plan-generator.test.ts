import { describe, expect, it } from 'vitest';
import { generatePlan } from '@/lib/scheduling/plan-generator';
import { materializeTaskInstances } from '@/lib/scheduling/task-instances';
import { addDays, todayUtc } from '@/lib/timezone';

describe('plan-generator', () => {
    it('generates preview blocks for selected goals', () => {
        const result = generatePlan({
            goals: [
                { title: 'Build Muscle', icon: '💪', category_type: 'fitness' },
            ],
            daily_hour_budget: 2,
            wake_time: '07:00',
            fixed_commitments: [],
        });
        expect(result.preview_blocks.length).toBeGreaterThan(0);
        expect(result.recurrence_rules.length).toBe(1);
        expect(result.roadmaps.length).toBe(8);
    });
});

describe('task-instances', () => {
    it('materializes instances within date window', () => {
        const start = todayUtc();
        const tasks = materializeTaskInstances(
            [
                {
                    id: 'rule-1',
                    user_id: 'user-1',
                    goal_id: 'goal-1',
                    title_template: 'Study',
                    days_of_week: ['mon', 'wed'],
                    start_time: '09:00:00',
                    duration_minutes: 60,
                    rotation_set: null,
                    rotation_index_field: null,
                    is_fixed_commitment: false,
                    active: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                },
            ],
            start,
            14
        );
        expect(tasks.length).toBeGreaterThan(0);
        tasks.forEach(t => {
            expect(t.scheduled_date >= start).toBe(true);
            expect(t.scheduled_date <= addDays(start, 14)).toBe(true);
        });
    });
});
