'use client';

import { createClient } from '@/lib/supabase/client';
import type {
    ApiResponse,
    CoachSuggestion,
    Goal,
    GymLog,
    HeatmapDay,
    NlpParseResult,
    NotificationLog,
    NotificationPreferences,
    PlanGenerateRequest,
    PlanGenerateResponse,
    ProgressOverview,
    Roadmap,
    TaskInstance,
    User,
} from '@/types';

function getSupabase() {
    return createClient();
}

async function callApi<T>(path: string, body?: unknown): Promise<T> {
    const res = await fetch(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
    });
    const json = (await res.json()) as ApiResponse<T>;
    if (!json.success || json.data === null) {
        throw new Error(json.error?.message ?? 'Request failed');
    }
    return json.data;
}

export const api = {
    auth: {
        signUp: async (
            email: string,
            password: string,
            displayName: string
        ) => {
            const { data, error } = await getSupabase().auth.signUp({
                email,
                password,
                options: { data: { display_name: displayName } },
            });
            if (error) throw error;
            return data;
        },
        signIn: async (email: string, password: string) => {
            const { data, error } = await getSupabase().auth.signInWithPassword(
                { email, password }
            );
            if (error) throw error;
            return data;
        },
        signInWithGoogle: async () => {
            const { data, error } = await getSupabase().auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });
            if (error) throw error;
            return data;
        },
        resendVerificationEmail: async (email: string) => {
            const { data, error } = await getSupabase().auth.resend({
                type: 'signup',
                email,
            });
            if (error) throw error;
            return data;
        },
        signOut: async () => {
            const { error } = await getSupabase().auth.signOut();
            if (error) throw error;
        },
        getSession: () => getSupabase().auth.getSession(),
        onAuthStateChange: (
            cb: Parameters<
                ReturnType<typeof getSupabase>['auth']['onAuthStateChange']
            >[0]
        ) => getSupabase().auth.onAuthStateChange(cb),
    },

    user: {
        getProfile: async (): Promise<User | null> => {
            const {
                data: { user },
            } = await getSupabase().auth.getUser();
            if (!user) return null;
            const { data, error } = await getSupabase()
                .from('users')
                .select('*')
                .eq('id', user.id)
                .single();
            if (error) throw error;
            return data as User;
        },
        updateProfile: async (updates: Partial<User>) => {
            const {
                data: { user },
            } = await getSupabase().auth.getUser();
            if (!user) throw new Error('Not authenticated');
            const { data, error } = await getSupabase()
                .from('users')
                .update({ ...updates, updated_at: new Date().toISOString() })
                .eq('id', user.id)
                .select()
                .single();
            if (error) throw error;
            return data as User;
        },
    },

    goals: {
        list: async (): Promise<Goal[]> => {
            const { data, error } = await getSupabase()
                .from('goals')
                .select('*')
                .neq('status', 'archived')
                .order('created_at', { ascending: true });
            if (error) throw error;
            return data as Goal[];
        },
        get: async (id: string): Promise<Goal> => {
            const { data, error } = await getSupabase()
                .from('goals')
                .select('*')
                .eq('id', id)
                .single();
            if (error) throw error;
            return data as Goal;
        },
        create: async (
            goal: Omit<
                Goal,
                'id' | 'user_id' | 'created_at' | 'updated_at' | 'progress_pct'
            >
        ) => {
            const {
                data: { user },
            } = await getSupabase().auth.getUser();
            if (!user) throw new Error('Not authenticated');
            const { data, error } = await getSupabase()
                .from('goals')
                .insert({ ...goal, user_id: user.id, progress_pct: 0 })
                .select()
                .single();
            if (error) throw error;
            return data as Goal;
        },
        update: async (id: string, updates: Partial<Goal>) => {
            const { data, error } = await getSupabase()
                .from('goals')
                .update({ ...updates, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select()
                .single();
            if (error) throw error;
            return data as Goal;
        },
        getRoadmaps: async (goalId: string): Promise<Roadmap[]> => {
            const { data, error } = await getSupabase()
                .from('roadmaps')
                .select('*')
                .eq('goal_id', goalId)
                .order('week_number');
            if (error) throw error;
            return data as Roadmap[];
        },
    },

    tasks: {
        list: async (from: string, to: string): Promise<TaskInstance[]> => {
            const { data, error } = await getSupabase()
                .from('task_instances')
                .select('*, goal:goals(*)')
                .gte('scheduled_date', from)
                .lte('scheduled_date', to)
                .order('scheduled_date')
                .order('start_time');
            if (error) throw error;
            return data as TaskInstance[];
        },
        complete: async (
            id: string,
            status: 'done' | 'partial' | 'skipped'
        ) => {
            const { data, error } = await getSupabase()
                .from('task_instances')
                .update({
                    status,
                    completed_at:
                        status === 'done' || status === 'partial'
                            ? new Date().toISOString()
                            : null,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', id)
                .select('*, goal:goals(*)')
                .single();
            if (error) throw error;
            return data as TaskInstance;
        },
        reschedule: async (
            id: string,
            newDate: string,
            newStartTime: string
        ) => {
            const { data, error } = await getSupabase()
                .from('task_instances')
                .update({
                    scheduled_date: newDate,
                    start_time: newStartTime,
                    status: 'rescheduled',
                    updated_at: new Date().toISOString(),
                })
                .eq('id', id)
                .select('*, goal:goals(*)')
                .single();
            if (error) throw error;
            return data as TaskInstance;
        },
        create: async (
            task: Omit<
                TaskInstance,
                | 'id'
                | 'user_id'
                | 'created_at'
                | 'updated_at'
                | 'completed_at'
                | 'rescheduled_from_instance_id'
            >
        ) => {
            const {
                data: { user },
            } = await getSupabase().auth.getUser();
            if (!user) throw new Error('Not authenticated');
            const { data, error } = await getSupabase()
                .from('task_instances')
                .insert({ ...task, user_id: user.id })
                .select('*, goal:goals(*)')
                .single();
            if (error) throw error;
            return data as TaskInstance;
        },
        parseNlp: (text: string, goalIds: string[]) =>
            callApi<NlpParseResult>('/api/v1/tasks/parse', {
                text,
                goal_ids: goalIds,
            }),
    },

    plan: {
        generate: (req: PlanGenerateRequest) =>
            callApi<PlanGenerateResponse>('/api/v1/plan/generate', req),
        confirm: (preview: PlanGenerateResponse) =>
            callApi<{ success: boolean }>('/api/v1/plan/confirm', preview),
        regenerate: () =>
            callApi<{ created: number; preserved: number }>(
                '/api/v1/plan/regenerate'
            ),
    },

    gym: {
        getLastSession: async (exerciseName: string): Promise<GymLog[]> => {
            const { data, error } = await getSupabase()
                .from('gym_logs')
                .select('*')
                .eq('exercise_name', exerciseName)
                .order('created_at', { ascending: false })
                .limit(10);
            if (error) throw error;
            return data as GymLog[];
        },
        log: async (
            taskInstanceId: string,
            exerciseName: string,
            sets: Array<{ weight_kg: number; reps: number }>
        ) => {
            const {
                data: { user },
            } = await getSupabase().auth.getUser();
            if (!user) throw new Error('Not authenticated');
            const rows = sets.map((s, i) => ({
                user_id: user.id,
                task_instance_id: taskInstanceId,
                exercise_name: exerciseName,
                set_number: i + 1,
                weight_kg: s.weight_kg,
                reps: s.reps,
            }));
            const { data, error } = await getSupabase()
                .from('gym_logs')
                .insert(rows)
                .select();
            if (error) throw error;
            return data as GymLog[];
        },
    },

    coach: {
        getSuggestions: async (): Promise<CoachSuggestion[]> => {
            const { data, error } = await getSupabase()
                .from('coach_suggestions')
                .select('*')
                .eq('status', 'pending')
                .order('created_at', { ascending: false });
            if (error) throw error;
            return data as CoachSuggestion[];
        },
        apply: async (id: string) => {
            const { data, error } = await getSupabase()
                .from('coach_suggestions')
                .update({
                    status: 'applied',
                    resolved_at: new Date().toISOString(),
                })
                .eq('id', id)
                .select()
                .single();
            if (error) throw error;
            return data as CoachSuggestion;
        },
        dismiss: async (id: string) => {
            const { data, error } = await getSupabase()
                .from('coach_suggestions')
                .update({
                    status: 'dismissed',
                    resolved_at: new Date().toISOString(),
                })
                .eq('id', id)
                .select()
                .single();
            if (error) throw error;
            return data as CoachSuggestion;
        },
        ask: (message: string) =>
            callApi<{ reply: string }>('/api/v1/coach/ask', { message }),
    },

    progress: {
        getOverview: async (): Promise<ProgressOverview> => {
            const res = await fetch('/api/v1/progress/overview');
            const json = (await res.json()) as ApiResponse<ProgressOverview>;
            if (!json.success || !json.data)
                throw new Error(json.error?.message ?? 'Failed');
            return json.data;
        },
        getHeatmap: async (days = 90): Promise<HeatmapDay[]> => {
            const res = await fetch(`/api/v1/progress/heatmap?days=${days}`);
            const json = (await res.json()) as ApiResponse<HeatmapDay[]>;
            if (!json.success || !json.data)
                throw new Error(json.error?.message ?? 'Failed');
            return json.data;
        },
    },

    notifications: {
        list: async (): Promise<NotificationLog[]> => {
            const { data, error } = await getSupabase()
                .from('notifications_log')
                .select('*')
                .order('sent_at', { ascending: false })
                .limit(50);
            if (error) throw error;
            return data as NotificationLog[];
        },
        getPreferences: async (): Promise<NotificationPreferences | null> => {
            const {
                data: { user },
            } = await getSupabase().auth.getUser();
            if (!user) return null;
            const { data, error } = await getSupabase()
                .from('notification_preferences')
                .select('*')
                .eq('user_id', user.id)
                .single();
            if (error && error.code !== 'PGRST116') throw error;
            return data as NotificationPreferences | null;
        },
        updatePreferences: async (prefs: Partial<NotificationPreferences>) => {
            const {
                data: { user },
            } = await getSupabase().auth.getUser();
            if (!user) throw new Error('Not authenticated');
            const { data, error } = await getSupabase()
                .from('notification_preferences')
                .upsert({ ...prefs, user_id: user.id })
                .select()
                .single();
            if (error) throw error;
            return data as NotificationPreferences;
        },
        registerDevice: async (token: string, platform: string) => {
            const {
                data: { user },
            } = await getSupabase().auth.getUser();
            if (!user) throw new Error('Not authenticated');
            const { error } = await getSupabase().from('device_tokens').upsert({
                user_id: user.id,
                token,
                platform,
            });
            if (error) throw error;
        },
    },
};
