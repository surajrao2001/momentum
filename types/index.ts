export type GoalCategory = "career" | "fitness" | "creative" | "language" | "custom";
export type GoalStatus = "active" | "paused" | "completed" | "archived";
export type TaskStatus = "pending" | "done" | "partial" | "missed" | "skipped" | "rescheduled";
export type RoadmapStatus = "upcoming" | "active" | "completed";
export type CoachSuggestionStatus = "pending" | "applied" | "dismissed" | "expired";
export type ThemePreference = "light" | "dark" | "system";

export interface User {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  timezone: string;
  wake_time: string;
  daily_hour_budget: number;
  onboarding_completed: boolean;
  theme_preference: ThemePreference;
  created_at: string;
  updated_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  icon: string;
  color_token: string;
  category_type: GoalCategory;
  target_weeks: number | null;
  weekly_hour_allocation: number;
  status: GoalStatus;
  progress_pct: number;
  started_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Roadmap {
  id: string;
  goal_id: string;
  week_number: number;
  theme: string;
  sub_topics: string[];
  status: RoadmapStatus;
}

export interface RecurrenceRule {
  id: string;
  user_id: string;
  goal_id: string | null;
  title_template: string;
  days_of_week: string[];
  start_time: string;
  duration_minutes: number;
  rotation_set: string[] | null;
  rotation_index_field: string | null;
  is_fixed_commitment: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TaskInstance {
  id: string;
  user_id: string;
  goal_id: string | null;
  recurrence_rule_id: string | null;
  title: string;
  sub_tasks: string[] | null;
  scheduled_date: string;
  start_time: string;
  duration_minutes: number;
  status: TaskStatus;
  completed_at: string | null;
  rescheduled_from_instance_id: string | null;
  created_at: string;
  updated_at: string;
  goal?: Goal | null;
}

export interface GymLog {
  id: string;
  user_id: string;
  task_instance_id: string;
  exercise_name: string;
  set_number: number;
  weight_kg: number | null;
  reps: number | null;
  created_at: string;
}

export interface CoachSuggestion {
  id: string;
  user_id: string;
  rule_key: string;
  message: string;
  action_payload: Record<string, unknown> | null;
  status: CoachSuggestionStatus;
  created_at: string;
  resolved_at: string | null;
}

export interface NotificationPreferences {
  user_id: string;
  pre_block_reminders: boolean;
  coach_suggestions: boolean;
  daily_brief: boolean;
  weekly_review: boolean;
  quiet_hours_start: string | null;
  quiet_hours_end: string | null;
}

export interface NotificationLog {
  id: string;
  user_id: string;
  category: string;
  body: string;
  sent_at: string;
  delivery_channel: string;
  status: string;
}

export interface OnboardingGoalSelection {
  title: string;
  icon: string;
  category_type: GoalCategory;
  isCustom?: boolean;
}

export interface FixedCommitment {
  title: string;
  days_of_week: string[];
  start_time: string;
  duration_minutes: number;
}

export interface PlanPreviewBlock {
  id: string;
  goal_id: string;
  goal_title: string;
  goal_icon: string;
  color_token: string;
  title: string;
  day: string;
  start_time: string;
  duration_minutes: number;
  sub_tasks?: string[];
}

export interface PlanGenerateRequest {
  goals: OnboardingGoalSelection[];
  daily_hour_budget: number;
  wake_time: string;
  fixed_commitments: FixedCommitment[];
}

export interface PlanGenerateResponse {
  preview_blocks: PlanPreviewBlock[];
  recurrence_rules: Omit<RecurrenceRule, "id" | "user_id" | "created_at" | "updated_at">[];
  roadmaps: Omit<Roadmap, "id" | "goal_id">[];
}

export interface NlpParseResult {
  title: string;
  goal_category_id: string | null;
  start_time: string | null;
  duration_minutes: number | null;
  recurrence: {
    type: "none" | "daily" | "weekly" | "custom";
    days_of_week: string[];
    end_condition: "none" | "count" | "date";
  };
  confidence: number;
  needs_confirmation: boolean;
}

export interface ProgressOverview {
  overall_pct: number;
  goals: Array<{
    goal_id: string;
    title: string;
    icon: string;
    progress_pct: number;
    color_token: string;
  }>;
}

export interface HeatmapDay {
  date: string;
  completion_pct: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: { code: string; message: string } | null;
}

export const GOAL_TEMPLATES = [
  { title: "Get a Software Job", icon: "💼", category_type: "career" as const, description: "Interview prep, DSA, system design" },
  { title: "Build Muscle", icon: "💪", category_type: "fitness" as const, description: "Gym splits, progressive overload" },
  { title: "Learn Dance", icon: "🕺", category_type: "creative" as const, description: "Grooves, musicality, freestyle" },
  { title: "Learn a Language", icon: "📖", category_type: "language" as const, description: "Daily practice, vocabulary" },
  { title: "Run a Marathon", icon: "🏃", category_type: "fitness" as const, description: "Training plans, long runs" },
  { title: "Learn Guitar", icon: "🎸", category_type: "creative" as const, description: "Chords, technique, songs" },
] as const;

export const GOAL_COLORS = [
  "#818CF8",
  "#34D399",
  "#F472B6",
  "#FBBF24",
  "#5BB8F0",
  "#9B5BF0",
  "#F05B5B",
  "#5BF0C8",
] as const;

export const DAYS_OF_WEEK = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
