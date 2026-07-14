import { api } from "@/lib/api";
import type { Goal, PlanGenerateRequest, PlanGenerateResponse, TaskStatus, User } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const queryKeys = {
  profile: ["profile"] as const,
  goals: ["goals"] as const,
  goal: (id: string) => ["goals", id] as const,
  roadmaps: (goalId: string) => ["roadmaps", goalId] as const,
  tasks: (from: string, to: string) => ["tasks", from, to] as const,
  coach: ["coach"] as const,
  progress: ["progress"] as const,
  heatmap: ["heatmap"] as const,
  notifications: ["notifications"] as const,
  notificationPrefs: ["notificationPrefs"] as const,
  gymLast: (exercise: string) => ["gymLast", exercise] as const,
};

export function useProfile() {
  return useQuery({ queryKey: queryKeys.profile, queryFn: () => api.user.getProfile(), staleTime: 5 * 60_000 });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (updates: Partial<User>) => api.user.updateProfile(updates),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.profile }),
  });
}

export function useGoals() {
  return useQuery({ queryKey: queryKeys.goals, queryFn: () => api.goals.list(), staleTime: 60_000 });
}

export function useGoal(id: string) {
  return useQuery({ queryKey: queryKeys.goal(id), queryFn: () => api.goals.get(id), enabled: !!id });
}

export function useRoadmaps(goalId: string) {
  return useQuery({
    queryKey: queryKeys.roadmaps(goalId),
    queryFn: () => api.goals.getRoadmaps(goalId),
    enabled: !!goalId,
  });
}

export function useCreateGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (goal: Omit<Goal, "id" | "user_id" | "created_at" | "updated_at" | "progress_pct">) =>
      api.goals.create(goal),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.goals }),
  });
}

export function useTasks(from: string, to: string) {
  return useQuery({
    queryKey: queryKeys.tasks(from, to),
    queryFn: () => api.tasks.list(from, to),
    staleTime: 30_000,
  });
}

export function useCompleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
      api.tasks.complete(id, status as "done" | "partial" | "skipped"),
    onMutate: async ({ id, status }) => {
      await qc.cancelQueries({ queryKey: ["tasks"] });
      const queries = qc.getQueriesData<import("@/types").TaskInstance[]>({ queryKey: ["tasks"] });
      queries.forEach(([key, data]) => {
        if (!data) return;
        qc.setQueryData(
          key,
          data.map((t) =>
            t.id === id
              ? { ...t, status, completed_at: status === "done" ? new Date().toISOString() : null }
              : t,
          ),
        );
      });
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      qc.invalidateQueries({ queryKey: queryKeys.progress });
    },
  });
}

export function useRescheduleTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, newDate, newStartTime }: { id: string; newDate: string; newStartTime: string }) =>
      api.tasks.reschedule(id, newDate, newStartTime),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });
}

export function useParseNlp() {
  return useMutation({
    mutationFn: ({ text, goalIds }: { text: string; goalIds: string[] }) => api.tasks.parseNlp(text, goalIds),
  });
}

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.tasks.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });
}

export function useGeneratePlan() {
  return useMutation({ mutationFn: (req: PlanGenerateRequest) => api.plan.generate(req) });
}

export function useConfirmPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (preview: PlanGenerateResponse) => api.plan.confirm(preview),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.profile });
      qc.invalidateQueries({ queryKey: queryKeys.goals });
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useRegenerateSchedule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.plan.regenerate(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      qc.invalidateQueries({ queryKey: queryKeys.progress });
    },
  });
}

export function useCoachSuggestions() {
  return useQuery({
    queryKey: queryKeys.coach,
    queryFn: () => api.coach.getSuggestions(),
    staleTime: 60_000,
  });
}

export function useApplyCoachSuggestion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.coach.apply(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.coach }),
  });
}

export function useDismissCoachSuggestion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.coach.dismiss(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.coach }),
  });
}

export function useCoachAsk() {
  return useMutation({ mutationFn: (message: string) => api.coach.ask(message) });
}

export function useProgressOverview() {
  return useQuery({
    queryKey: queryKeys.progress,
    queryFn: () => api.progress.getOverview(),
    staleTime: 60_000,
  });
}

export function useHeatmap(days = 90) {
  return useQuery({
    queryKey: [...queryKeys.heatmap, days],
    queryFn: () => api.progress.getHeatmap(days),
    staleTime: 5 * 60_000,
  });
}

export function useGymLastSession(exerciseName: string) {
  return useQuery({
    queryKey: queryKeys.gymLast(exerciseName),
    queryFn: () => api.gym.getLastSession(exerciseName),
    enabled: !!exerciseName,
  });
}

export function useLogGym() {
  return useMutation({
    mutationFn: ({
      taskInstanceId,
      exerciseName,
      sets,
    }: {
      taskInstanceId: string;
      exerciseName: string;
      sets: Array<{ weight_kg: number; reps: number }>;
    }) => api.gym.log(taskInstanceId, exerciseName, sets),
  });
}

export function useNotifications() {
  return useQuery({ queryKey: queryKeys.notifications, queryFn: () => api.notifications.list() });
}

export function useNotificationPrefs() {
  return useQuery({ queryKey: queryKeys.notificationPrefs, queryFn: () => api.notifications.getPreferences() });
}

export function useUpdateNotificationPrefs() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.notifications.updatePreferences,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.notificationPrefs }),
  });
}
