import { create } from "zustand";
import type {
  FixedCommitment,
  OnboardingGoalSelection,
  PlanGenerateResponse,
  PlanPreviewBlock,
} from "@/types";

interface OnboardingState {
  step: number;
  goals: OnboardingGoalSelection[];
  dailyHourBudget: number;
  wakeTime: string;
  fixedCommitments: FixedCommitment[];
  planPreview: PlanGenerateResponse | null;
  setStep: (step: number) => void;
  toggleGoal: (goal: OnboardingGoalSelection) => void;
  setCustomGoal: (title: string, icon: string) => void;
  setDailyHourBudget: (hours: number) => void;
  setWakeTime: (time: string) => void;
  addCommitment: (c: FixedCommitment) => void;
  removeCommitment: (index: number) => void;
  setPlanPreview: (plan: PlanGenerateResponse) => void;
  updateBlock: (block: PlanPreviewBlock) => void;
}

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  step: 1,
  goals: [],
  dailyHourBudget: 2,
  wakeTime: "07:00",
  fixedCommitments: [],
  planPreview: null,
  setStep: (step) => set({ step }),
  toggleGoal: (goal) => {
    const { goals } = get();
    const exists = goals.find((g) => g.title === goal.title);
    if (exists) set({ goals: goals.filter((g) => g.title !== goal.title) });
    else if (goals.length < 4) set({ goals: [...goals, goal] });
  },
  setCustomGoal: (title, icon) => {
    const { goals } = get();
    if (goals.length >= 4) return;
    set({ goals: [...goals, { title, icon, category_type: "custom", isCustom: true }] });
  },
  setDailyHourBudget: (hours) => set({ dailyHourBudget: hours }),
  setWakeTime: (time) => set({ wakeTime: time }),
  addCommitment: (c) => set({ fixedCommitments: [...get().fixedCommitments, c] }),
  removeCommitment: (index) =>
    set({ fixedCommitments: get().fixedCommitments.filter((_, i) => i !== index) }),
  setPlanPreview: (plan) => set({ planPreview: plan }),
  updateBlock: (block) => {
    const preview = get().planPreview;
    if (!preview) return;
    set({
      planPreview: {
        ...preview,
        preview_blocks: preview.preview_blocks.map((b) => (b.id === block.id ? block : b)),
      },
    });
  },
}));
