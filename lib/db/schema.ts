import {
    date,
    integer,
    jsonb,
    numeric,
    pgTable,
    text,
    time,
    timestamp,
    uuid,
} from 'drizzle-orm/pg-core';

export const goals = pgTable('goals', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull(),
    title: text('title').notNull(),
    icon: text('icon').notNull(),
    colorToken: text('color_token').notNull(),
    categoryType: text('category_type').notNull(),
    targetWeeks: integer('target_weeks'),
    weeklyHourAllocation: numeric('weekly_hour_allocation').notNull(),
    status: text('status').notNull(),
    progressPct: numeric('progress_pct').notNull(),
    startedAt: date('started_at'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
});

export const taskInstances = pgTable('task_instances', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull(),
    goalId: uuid('goal_id'),
    recurrenceRuleId: uuid('recurrence_rule_id'),
    title: text('title').notNull(),
    subTasks: jsonb('sub_tasks'),
    scheduledDate: date('scheduled_date').notNull(),
    startTime: time('start_time').notNull(),
    durationMinutes: integer('duration_minutes').notNull(),
    status: text('status').notNull(),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    rescheduledFromInstanceId: uuid('rescheduled_from_instance_id'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
});

export const gymLogs = pgTable('gym_logs', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull(),
    taskInstanceId: uuid('task_instance_id').notNull(),
    exerciseName: text('exercise_name').notNull(),
    setNumber: integer('set_number').notNull(),
    weightKg: numeric('weight_kg'),
    reps: integer('reps'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
});
