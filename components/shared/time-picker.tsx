'use client';

import { Input } from '@/components/ui/input';

export interface TimePickerProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
}

export function TimePicker({
    value,
    onChange,
    label = 'Time',
}: TimePickerProps) {
    return (
        <Input
            type="time"
            label={label}
            value={value}
            onChange={e => onChange(e.target.value)}
        />
    );
}
