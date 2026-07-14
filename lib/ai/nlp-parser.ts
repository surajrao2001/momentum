import type { NlpParseResult } from '@/types';

const DAY_PATTERNS: Record<string, string[]> = {
    monday: ['mon'],
    tuesday: ['tue'],
    wednesday: ['wed'],
    thursday: ['thu'],
    friday: ['fri'],
    saturday: ['sat'],
    sunday: ['sun'],
    weekdays: ['mon', 'tue', 'wed', 'thu', 'fri'],
    weekends: ['sat', 'sun'],
};

export function parseTaskNlp(text: string, goalIds: string[]): NlpParseResult {
    const lower = text.toLowerCase();
    let confidence = 0.85;
    let days: string[] = [];

    for (const [pattern, mapped] of Object.entries(DAY_PATTERNS)) {
        if (lower.includes(pattern)) {
            days = mapped;
            break;
        }
    }

    const durationMatch = lower.match(
        /(\d+)\s*(min|minute|minutes|hour|hours|h)/
    );
    let duration_minutes: number | null = 60;
    if (durationMatch) {
        const n = Number(durationMatch[1]);
        duration_minutes = durationMatch[2].startsWith('h') ? n * 60 : n;
    } else {
        confidence -= 0.1;
        duration_minutes = null;
    }

    const recurrenceType = days.length
        ? 'weekly'
        : lower.includes('every day')
          ? 'daily'
          : 'none';
    if (recurrenceType === 'daily')
        days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

    const goal_category_id = goalIds[0] ?? null;
    if (!goal_category_id) confidence = Math.min(confidence, 0.6);

    return {
        title: text.replace(/\bevery\b.*/i, '').trim() || text,
        goal_category_id,
        start_time: null,
        duration_minutes,
        recurrence: {
            type: recurrenceType as NlpParseResult['recurrence']['type'],
            days_of_week: days,
            end_condition: 'none',
        },
        confidence,
        needs_confirmation: confidence < 0.7 || !goal_category_id,
    };
}
