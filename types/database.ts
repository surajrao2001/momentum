export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          display_name: string | null;
          avatar_url: string | null;
          timezone: string;
          wake_time: string;
          daily_hour_budget: number;
          onboarding_completed: boolean;
          theme_preference: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["users"]["Row"]> & {
          id: string;
          email: string;
        };
        Update: Partial<Database["public"]["Tables"]["users"]["Row"]>;
      };
      goals: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          icon: string;
          color_token: string;
          category_type: string;
          target_weeks: number | null;
          weekly_hour_allocation: number;
          status: string;
          progress_pct: number;
          started_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["goals"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
        };
        Update: Partial<Database["public"]["Tables"]["goals"]["Row"]>;
      };
      task_instances: {
        Row: {
          id: string;
          user_id: string;
          goal_id: string | null;
          recurrence_rule_id: string | null;
          title: string;
          sub_tasks: Json | null;
          scheduled_date: string;
          start_time: string;
          duration_minutes: number;
          status: string;
          completed_at: string | null;
          rescheduled_from_instance_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["task_instances"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
        };
        Update: Partial<Database["public"]["Tables"]["task_instances"]["Row"]>;
      };
    };
  };
}
