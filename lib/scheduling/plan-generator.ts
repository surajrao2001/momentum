import {
    GOAL_COLORS,
    DAYS_OF_WEEK,
    type GoalCategory,
    type OnboardingGoalSelection,
    type PlanGenerateRequest,
    type PlanGenerateResponse,
    type PlanPreviewBlock,
} from '@/types';

const CAREER_ROADMAP = [
    {
        theme: 'React Fundamentals',
        sub_topics: ['Components & JSX', 'State vs Props', 'Hooks'],
    },
    {
        theme: 'JavaScript Deep Dive',
        sub_topics: ['Closures', 'Promises', 'Async/Await'],
    },
    {
        theme: 'DSA — Arrays & Strings',
        sub_topics: ['Arrays', 'Strings', 'Hash Maps'],
    },
    {
        theme: 'React Advanced',
        sub_topics: ['Context', 'Performance', 'Patterns'],
    },
    {
        theme: 'Machine Coding',
        sub_topics: ['UI Components', 'API Integration', 'State Management'],
    },
    {
        theme: 'Mixed Revision',
        sub_topics: ['Review weak areas', 'Practice problems'],
    },
    {
        theme: 'Mock Interviews',
        sub_topics: ['Behavioral', 'Technical', 'System design'],
    },
    {
        theme: 'Applications + Polish',
        sub_topics: ['Resume', 'Applications', 'Portfolio'],
    },
];

const FITNESS_ROADMAP = [
    { theme: 'Foundation & Form', sub_topics: ['Squat', 'Deadlift', 'Bench'] },
    { theme: 'Push Focus', sub_topics: ['Push Day', 'Chest', 'Shoulders'] },
    { theme: 'Pull Focus', sub_topics: ['Pull Day', 'Back', 'Biceps'] },
    { theme: 'Legs & Core', sub_topics: ['Leg Day', 'Core', 'Mobility'] },
    {
        theme: 'Progressive Overload',
        sub_topics: ['Increase weight', 'Track lifts'],
    },
    { theme: 'Deload Week', sub_topics: ['Light sessions', 'Recovery'] },
    { theme: 'Peak Performance', sub_topics: ['PR attempts', 'Volume'] },
    { theme: 'Maintenance', sub_topics: ['Consistency', 'Form check'] },
];

const CREATIVE_ROADMAP = [
    {
        theme: 'Basics & Posture',
        sub_topics: ['Warm-up', 'Fundamentals', 'Posture'],
    },
    {
        theme: 'Grooves & Rhythm',
        sub_topics: ['Grooves', 'Musicality', 'Timing'],
    },
    { theme: 'Footwork', sub_topics: ['Steps', 'Transitions', 'Combinations'] },
    { theme: 'Concepts', sub_topics: ['Theory', 'Practice', 'Review'] },
    {
        theme: 'Battle Prep',
        sub_topics: ['Freestyle', 'Cypher', 'Performance'],
    },
    { theme: 'Review Week', sub_topics: ['Consolidate', 'Record', 'Reflect'] },
    { theme: 'Advanced Flow', sub_topics: ['Complex combos', 'Style'] },
    { theme: 'Showcase', sub_topics: ['Routine', 'Performance', 'Celebrate'] },
];

const GYM_SPLITS = ['Push', 'Pull', 'Legs', 'Upper', 'Lower', 'Arms'];
const DANCE_THEMES = [
    'Grooves',
    'Musicality',
    'Footwork',
    'Concepts',
    'Battle',
    'Review',
];

function getActionVerb(category: GoalCategory): string {
    if (category === 'fitness') return 'Train';
    if (category === 'creative') return 'Practice';
    if (category === 'language') return 'Study';
    if (category === 'career') return 'Build';
    return 'Work on';
}

function buildActionTitle(params: {
    category: GoalCategory;
    goalTitle: string;
    weekTheme: string;
    focusTopic: string;
    rotationLabel: string | null;
}): string {
    const { category, goalTitle, weekTheme, focusTopic, rotationLabel } =
        params;
    const verb = getActionVerb(category);

    if (rotationLabel) {
        return `${verb} ${rotationLabel}: ${focusTopic}`;
    }

    if (category === 'career' || category === 'language') {
        return `${verb} ${weekTheme}: ${focusTopic}`;
    }

    return `${verb} ${goalTitle}: ${focusTopic}`;
}

function buildSubTasks(topics: string[]): string[] {
    return topics.map(topic => `Focus on ${topic}`);
}

/** Build the same actionable title used in onboarding preview, for materialized task instances. */
export function buildTaskTitleForDay(params: {
    category: GoalCategory;
    goalTitle: string;
    day: string;
    weekIndex: number;
}): { title: string; sub_tasks: string[] } {
    const { category, goalTitle, day, weekIndex } = params;
    const roadmap = getRoadmap(category, goalTitle);
    const week = roadmap[weekIndex % roadmap.length];
    const rotation =
        category === 'fitness'
            ? GYM_SPLITS
            : category === 'creative'
              ? DANCE_THEMES
              : null;
    const rotIdx =
        DAYS_OF_WEEK.indexOf(day as (typeof DAYS_OF_WEEK)[number]) %
        (rotation?.length ?? 1);
    const focusTopic =
        week.sub_topics[rotIdx % week.sub_topics.length] ??
        week.sub_topics[0] ??
        week.theme;
    const rotationLabel = rotation ? rotation[rotIdx] : null;

    return {
        title: buildActionTitle({
            category,
            goalTitle,
            weekTheme: week.theme,
            focusTopic,
            rotationLabel,
        }),
        sub_tasks: buildSubTasks(week.sub_topics),
    };
}

export function getRoadmap(category: string, customTitle?: string) {
    if (category === 'career') return CAREER_ROADMAP;
    if (category === 'fitness') return FITNESS_ROADMAP;
    if (category === 'creative') return CREATIVE_ROADMAP;
    if (category === 'language')
        return Array.from({ length: 8 }, (_, i) => ({
            theme: `Language Week ${i + 1}`,
            sub_topics: ['Vocabulary', 'Grammar', 'Speaking practice'],
        }));
    return Array.from({ length: 8 }, (_, i) => ({
        theme: `${customTitle ?? 'Custom'} Week ${i + 1}`,
        sub_topics: ['Session A', 'Session B', 'Review'],
    }));
}

function parseWakeMinutes(wakeTime: string): number {
    const [h, m] = wakeTime.split(':').map(Number);
    return h * 60 + m;
}

function minutesToTime(mins: number): string {
    const h = Math.floor(mins / 60) % 24;
    const m = mins % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`;
}

function goalDays(category: string, index: number): string[] {
    if (category === 'fitness') return ['mon', 'wed', 'fri'];
    if (category === 'career') return ['mon', 'tue', 'wed', 'thu', 'fri'];
    if (category === 'creative') return ['tue', 'thu', 'sat'];
    return DAYS_OF_WEEK.filter((_, i) => i % 2 === index % 2).slice(0, 3);
}

export function generatePlan(
    request: PlanGenerateRequest
): PlanGenerateResponse {
    const preview_blocks: PlanPreviewBlock[] = [];
    const recurrence_rules: PlanGenerateResponse['recurrence_rules'] = [];
    const roadmaps: PlanGenerateResponse['roadmaps'] = [];

    let cursorMinutes = parseWakeMinutes(request.wake_time) + 60;
    const blockBudget = Math.floor(
        (request.daily_hour_budget * 60) / Math.max(request.goals.length, 1)
    );

    request.goals.forEach((goal: OnboardingGoalSelection, goalIndex) => {
        const goalId = `goal-${goalIndex}`;
        const color = GOAL_COLORS[goalIndex % GOAL_COLORS.length];
        const roadmap = getRoadmap(goal.category_type, goal.title);
        const days = goalDays(goal.category_type, goalIndex);
        const duration = Math.min(90, Math.max(45, blockBudget));
        const rotation =
            goal.category_type === 'fitness'
                ? GYM_SPLITS
                : goal.category_type === 'creative'
                  ? DANCE_THEMES
                  : null;

        roadmap.forEach((week, wi) => {
            roadmaps.push({
                week_number: wi + 1,
                theme: week.theme,
                sub_topics: week.sub_topics,
                status: wi === 0 ? 'active' : 'upcoming',
            });
        });

        const titleTemplate =
            goal.category_type === 'fitness'
                ? 'Train {split_day} session'
                : goal.category_type === 'creative'
                  ? 'Practice {theme} session'
                  : goal.category_type === 'career'
                    ? `Build ${goal.title} momentum`
                    : goal.category_type === 'language'
                      ? `Study ${goal.title} practice`
                      : `Work on ${goal.title}`;

        recurrence_rules.push({
            goal_id: goalId,
            title_template: titleTemplate,
            days_of_week: days,
            start_time: minutesToTime(cursorMinutes),
            duration_minutes: duration,
            rotation_set: rotation,
            rotation_index_field: rotation ? 'week_count' : null,
            is_fixed_commitment: false,
            active: true,
        });

        DAYS_OF_WEEK.forEach(day => {
            if (!days.includes(day)) return;
            const weekIdx = DAYS_OF_WEEK.indexOf(day) % roadmap.length;
            const week = roadmap[weekIdx];
            const rotIdx = DAYS_OF_WEEK.indexOf(day) % (rotation?.length ?? 1);
            const focusTopic =
                week.sub_topics[rotIdx % week.sub_topics.length] ??
                week.sub_topics[0] ??
                week.theme;
            const rotationLabel = rotation ? rotation[rotIdx] : null;
            const title = buildActionTitle({
                category: goal.category_type,
                goalTitle: goal.title,
                weekTheme: week.theme,
                focusTopic,
                rotationLabel,
            });

            preview_blocks.push({
                id: `block-${goalId}-${day}`,
                goal_id: goalId,
                goal_title: goal.title,
                goal_icon: goal.icon,
                color_token: color,
                title,
                day,
                start_time: minutesToTime(cursorMinutes + goalIndex * 15),
                duration_minutes: duration,
                sub_tasks: buildSubTasks(week.sub_topics),
            });
        });

        cursorMinutes += duration + 15;
    });

    request.fixed_commitments.forEach((c, i) => {
        recurrence_rules.push({
            goal_id: null,
            title_template: c.title,
            days_of_week: c.days_of_week,
            start_time: c.start_time,
            duration_minutes: c.duration_minutes,
            rotation_set: null,
            rotation_index_field: null,
            is_fixed_commitment: true,
            active: true,
        });
        c.days_of_week.forEach(day => {
            preview_blocks.push({
                id: `commitment-${i}-${day}`,
                goal_id: `commitment-${i}`,
                goal_title: c.title,
                goal_icon: '📌',
                color_token: '#6B6B76',
                title: c.title,
                day,
                start_time: c.start_time,
                duration_minutes: c.duration_minutes,
            });
        });
    });

    return { preview_blocks, recurrence_rules, roadmaps };
}
