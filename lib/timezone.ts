import { formatInTimeZone } from 'date-fns-tz';

export function formatTimeForUser(time: string, timezone: string): string {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setUTCHours(hours, minutes, 0, 0);
    return formatInTimeZone(date, timezone, 'HH:mm');
}

export function todayUtc(): string {
    return new Date().toISOString().split('T')[0];
}

export function addDays(dateStr: string, days: number): string {
    const d = new Date(dateStr);
    d.setUTCDate(d.getUTCDate() + days);
    return d.toISOString().split('T')[0];
}
