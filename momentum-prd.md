# Momentum — AI Personal Operating System (POS)

## Complete Product Requirements Document (PRD) v1.0

**Document Owner:** Suraj
**Status:** Draft for Engineering / Build (Cursor-ready)
**Last Updated:** June 30, 2026

---

## Table of Contents

1. Executive Summary
2. Vision & Mission
3. Product Philosophy
4. Market & Competitor Analysis
5. User Personas
6. User Journeys
7. Information Architecture
8. Core Feature List (MVP / V2 / V3)
9. Screen-by-Screen UI Specifications (Text Wireframes)
10. Design System
11. AI Architecture (Coach, Planner, Scheduler, NLP Input)
12. Notification System
13. Database Design (Full Schema)
14. API Specification
15. Authentication & Permissions
16. Tech Stack & Rationale
17. Frontend Architecture & Folder Structure
18. Offline Support & Sync Engine
19. Security
20. Performance Requirements
21. Accessibility
22. Analytics & Success Metrics
23. Admin Dashboard
24. Monetization
25. Testing Strategy
26. CI/CD & Deployment
27. MVP Roadmap & Sprint Breakdown
28. Risks & Open Questions
29. Future Vision (V2 / V3)

---

## 1. Executive Summary

Momentum is an AI-powered personal operating system that converts a user's stated goals (career, fitness, learning, creative skills, etc.) into a fully structured, day-by-day execution plan — then adapts that plan continuously based on real behavior. Unlike calendar or to-do apps, which require the user to design their own system, Momentum builds the system for the user and only asks them to follow it.

The core loop is: **State a goal → Momentum builds a plan → Momentum schedules it → Momentum reminds, tracks, and adapts → User sees cumulative progress, not guilt-inducing streaks.**

The differentiating feature is the **AI Coach**: a proactive agent that observes patterns in completion, performance, and consistency, and surfaces timely, specific suggestions (e.g., "you've plateaued at the gym for two weeks, consider a deload") rather than waiting to be asked.

This document specifies the full product — UX, UI, data model, APIs, AI logic, architecture, and roadmap — in enough detail to be handed to an AI coding agent (e.g., Cursor) or a small engineering team to implement without further product clarification for the MVP scope.

---

## 2. Vision & Mission

**Vision:** A world where anyone can state an ambitious personal goal and immediately know exactly what to do today, tomorrow, and every day after — without having to design a system, research a curriculum, or maintain a calendar themselves.

**Mission:** Remove the "system design" tax from personal growth. Momentum turns goals into daily action automatically, adapts when life interferes, and keeps users motivated through visible cumulative progress rather than shame-based streaks.

**One-line pitch:** _"Tell us your goal. We'll build your day."_

**Positioning statement:** For ambitious individuals juggling multiple personal goals (career switch, fitness, a creative skill) who feel overwhelmed by planning their own systems, Momentum is an AI personal operating system that auto-generates and adapts a daily execution plan — unlike Notion, Todoist, or Motion, which require users to build their own structure, Momentum builds the structure for them and coaches them through it.

---

## 3. Product Philosophy

These are non-negotiable principles. Every feature decision in this document should be checked against them.

1. **Zero system design from the user.** The user should never have to invent a project structure, a folder hierarchy, or a curriculum. Momentum proposes one; the user approves or tweaks.
2. **Plans, not lists.** A flat to-do list has no notion of sequence or pacing. Every goal becomes a structured, time-boxed roadmap (e.g., an 8-week interview prep plan with daily topics), not a backlog.
3. **Progress over streaks.** Streaks punish a single missed day disproportionately and cause users to quit entirely after one slip ("streak anxiety"). Momentum always shows cumulative, rolling progress percentages instead.
4. **Natural language first.** Creating or modifying a task should never require filling out a multi-field form. A single sentence ("Learn React hooks every Monday for an hour") must be sufient input.
5. **Reactive AND proactive.** The AI must not only answer when asked — it must notice patterns (plateaus, missed sessions, improving performance) and proactively suggest next actions.
6. **Adapt, don't guilt.** When something is missed, the default response is "let's reschedule this," never "you failed."
7. **One coherent system, many goal types.** Career prep, fitness, creative skills, and language learning all live in the same data model and UI, not as bolted-on separate modules.
8. **Calm UI.** No noisy gamification (badges, confetti spam, leaderboards) in MVP. Motivation should come from clarity and visible progress, not dopamine tricks.

---

## 4. Market & Competitor Analysis

| Product                       | Core model                                   | Strength                                                                  | Gap Momentum exploits                                                                                                |
| ----------------------------- | -------------------------------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **Notion**                    | Flexible blank-canvas workspace              | Infinite flexibility                                                      | User must build their own system from scratch; high setup cost; no AI-generated daily plan                           |
| **Todoist**                   | Task list + projects                         | Simple, reliable, fast capture                                            | No goal-to-plan generation; no adaptive AI coaching; tasks, not roadmaps                                             |
| **Motion**                    | AI auto-scheduling of tasks/calendar         | Strong auto-scheduling engine                                             | Optimizes calendar slots, but doesn't generate the underlying curriculum/plan content (e.g., what to actually study) |
| **Sunsama**                   | Daily planning ritual, calendar-centric      | Beautiful daily planning UX                                               | Manual; requires the user to already know what to plan; no goal-to-roadmap generation                                |
| **Structured**                | Visual timeline / day planner                | Clean visual day timeline                                                 | Purely a scheduling UI, zero AI plan generation or coaching                                                          |
| **Routine**                   | Tasks + calendar + notes combined            | Good all-in-one basic features                                            | No AI goal decomposition; no adaptive coaching; generic notifications                                                |
| **TickTick**                  | Task manager + habit tracker + calendar      | Mature, full-featured                                                     | Same problem as Todoist — requires user-built structure; habit streaks (punishing)                                   |
| **Duolingo (reference only)** | Single-domain AI-guided curriculum + streaks | Proven model for "tell us nothing, we guide everything" within one domain | Confined to language learning; doesn't generalize across goal types                                                  |

**Key insight:** No competitor combines (a) AI-generated multi-domain roadmaps, (b) adaptive daily scheduling, and (c) proactive coaching, in a single product. Each competitor solves one slice. Momentum's whitespace is the intersection of all three.

**Competitive risk:** Motion or Notion AI could add goal-decomposition features. Momentum's defensibility is depth of the coaching loop and cross-domain pattern recognition (gym + study + job search signals feeding one unified coach), which is hard to bolt onto an existing task-list-first product.

---

## 5. User Personas

### Persona 1 — "Career-Switch Suraj" (Primary persona, validated by founder's own use case)

- 24–32, currently employed or recently laid off, self-teaching to switch into / level up in tech roles.
- Juggling 3–4 simultaneous goals: interview prep, fitness, a creative hobby (dance, music), job applications.
- Pain: knows _what_ to learn in theory but wastes time every day deciding _what specifically_ to study, in what order, and re-planning when life gets in the way.
- Wants: open the app, see exactly today's tasks pre-sequenced, do them, move on.

### Persona 2 — "Fitness-First Farah"

- 28–40, has a stable job, fitness and health are the primary goal, secondary goal might be a language or hobby.
- Pain: doesn't know how to structure a workout split (push/pull/legs rotation) or progressive overload; uses 2–3 separate apps (gym tracker, calendar, notes) that don't talk to each other.
- Wants: one place that tells her today's workout, logs her lifts, and nudges her about plateaus.

### Persona 3 — "Multi-Hobby Mike"

- 20–28, student or early-career, wants to build several skills in parallel (guitar, a language, a side project) without any single "do or die" deadline.
- Pain: motivation dies because there's no sense of cumulative progress — every week feels like starting over.
- Wants: visible, compounding progress bars per goal; low-pressure scheduling (lighter Sundays, no punishing streaks).

### Persona 4 — "Time-Boxed Tara" (low time budget)

- Working parent or full-time employee with 1–2 hours/day available across all goals.
- Pain: most planning tools assume unlimited time and produce unrealistic schedules.
- Wants: the app to respect a hard daily time ceiling and pick the highest-leverage tasks within it.

---

## 6. User Journeys

### Journey A — First-Time Onboarding to First Completed Day

1. User signs up (email or OAuth).
2. Onboarding asks: primary goal(s) → realistic daily hours → wake-up time → (optional) existing fixed commitments (work hours, classes).
3. Momentum generates a first draft 7-day schedule across all chosen goals, allocating time blocks that respect the stated hour budget and wake time.
4. User reviews the generated week on a preview screen, can drag-adjust block times or swap a day's focus, then confirms.
5. User lands on the Dashboard / Today view showing the current day's blocks with 0% progress.
6. User completes a task (marks done, or AI detects completion via check-in); progress bar updates live.
7. End of day: a short "Day Recap" surfaces (completed vs missed, tomorrow's preview).

### Journey B — Adding a Task via Natural Language

1. User taps the "+" / quick-add bar, types: "Learn React hooks every Monday for an hour."
2. NLP parser extracts: title="Learn React hooks", recurrence=weekly(Monday), duration=60min, goal-category inferred = "Interview Prep" (or asks user to confirm category if ambiguous).
3. Task is inserted into the recurring schedule; user sees a confirmation chip with an "Edit" affordance before final save (low-friction confirm, not silent auto-accept for ambiguous parses).

### Journey C — Missed Task → Adaptive Reschedule

1. A scheduled block's end time passes without the task being marked done.
2. At a defined grace window (e.g., +30 min, configurable), the task is flagged "Missed" (not "Overdue" / not styled as failure).
3. A reschedule prompt appears (in-app and/or push): "Looks like you skipped Gym. Move it to: Today 7 PM / Tomorrow 6 PM / Skip this week."
4. User taps one option; task is moved; no guilt copy, no red overdue badges piling up.

### Journey D — AI Coach Proactive Intervention

1. AI Coach service runs a nightly batch (plus lightweight real-time checks) analyzing completion rate, performance trend (e.g., logged weights plateauing), and goal velocity.
2. When a rule/heuristic fires (see Section 11.3), a coach message is generated and surfaced on the Dashboard "Coach" card and optionally as a push notification.
3. User can tap a coach suggestion to accept it (e.g., "Add a deload week") which directly mutates the schedule, or dismiss it.

### Journey E — Weekly Review

1. Every Sunday, a lighter-day view surfaces a "Week in Review": per-goal progress %, completed vs. planned blocks, and a forward-looking prompt to adjust next week's hour budget or focus.

---

## 7. Information Architecture

```
Momentum
├── Auth (Sign up / Login / OAuth)
├── Onboarding (Goal selection → Hours → Wake time → Fixed commitments → Plan preview → Confirm)
├── Today (Dashboard / primary landing screen post-onboarding)
├── Timeline (Day/Week calendar view)
├── Goals
│   ├── Goal Detail (per goal: roadmap, progress, sub-topics)
│   └── Add/Edit Goal (manual or AI-generated roadmap)
├── AI Coach (feed of suggestions + chat-style ask box)
├── Trackers (domain-specific structured logging)
│   ├── Gym Tracker (sets/reps/weight, split rotation)
│   ├── Job Tracker (applications, interview stages)
│   ├── Dance/Skill Tracker (session logs, video notes)
│   ├── Nutrition Tracker (optional, V2)
│   └── Sleep Tracker (optional, V2)
├── Notes / Journal (lightweight freeform notes attached to goals or days)
├── Progress / Analytics (cross-goal charts, weekly review)
├── Notifications Center
├── Settings
│   ├── Profile
│   ├── Schedule Preferences (hours, wake time, working hours)
│   ├── Notification Preferences
│   ├── Integrations (calendar sync, etc.)
│   ├── Subscription / Billing (V2)
│   └── Data Export / Privacy
└── Widgets (iOS/Android/Web home-screen "Today's Mission")
```

**Primary navigation (mobile, bottom tab bar):** Today | Timeline | Goals | Coach | Profile
**Primary navigation (desktop/web, left sidebar):** Today, Timeline, Goals, Trackers, Coach, Notes, Progress, Settings

---

## 8. Core Feature List

### 8.1 MVP (Phase 1 — ship first, must be airtight)

- Auth (email/password + Google OAuth)
- Onboarding flow (goal selection, hours/day, wake time, fixed commitments)
- AI plan generation engine (goal → weekly recurring schedule, single pass, editable before confirm)
- Today / Dashboard view with per-goal progress bars + overall daily %
- Timeline view (day + week, drag to reschedule)
- Natural language quick-add (parses title, time, recurrence, duration, goal category)
- Task completion (manual tap; "done / partial / skip")
- Missed-task adaptive reschedule flow (no punishing overdue UI)
- Basic notifications (push, motivational copy templates, not yet AI-personalized)
- Goal detail screen with roadmap (topic list, weekly structure)
- Gym Tracker (basic: log sets/reps/weight per exercise, auto-rotating split)
- Progress/Analytics: per-goal % and overall %, simple weekly view
- Settings (profile, schedule prefs, notification prefs)
- PWA installable (web app, "Add to Home Screen")
- Web responsive (desktop + mobile browser)

### 8.2 V2 (Phase 2 — depth and retention)

- AI Coach proactive suggestions (pattern detection: plateaus, skipped streaks, momentum surges)
- AI-personalized notification copy (not just templates)
- Voice input (mobile, via device speech-to-text → same NLP parser)
- Job Tracker (application pipeline: applied → screen → interview → offer)
- Dance/Skill tracker with session notes (no video processing in V2; just structured logs)
- Notes/Journal module
- Home-screen widgets (iOS/Android)
- Calendar sync (Google Calendar two-way sync)
- Weekly Review screen (auto-generated recap + next-week planning prompt)
- Native push via FCM + APNs (full mobile wrapper, e.g., Capacitor/Expo)
- Smart suggestions on task creation ("Would you like an 8-week roadmap for this?")
- Deload/adjustment recommendations for fitness goals (rule-based, not full ML)

### 8.3 V3 (Phase 3 — platform maturity)

- Nutrition Tracker, Sleep Tracker
- Cross-goal correlation insights (e.g., "your study completion drops on days you sleep < 6 hours")
- Social/accountability layer (optional: share progress with a friend, opt-in only — no public leaderboards by default, respecting Philosophy #8)
- Offline-first full sync engine with conflict resolution
- Admin dashboard for support/ops
- Monetization: subscription tiers, possibly coach marketplace (human coach add-on)
- Multi-language support
- Native mobile apps (full feature parity, not just wrapper)
- Advanced ML-based plateau/performance detection (replacing V2's rule-based heuristics)

---

## 9. Screen-by-Screen UI Specifications (Text Wireframes)

> Format per screen: Purpose → Layout (text wireframe) → Components → States → Interactions.

### 9.1 Onboarding — Step 1: Goal Selection

**Purpose:** Capture 1–4 goals with zero friction.

```
┌─────────────────────────────────────┐
│  Step 1 of 4                         │
│  "What's your goal?"                 │
│  (subtext: pick up to 4)             │
│                                       │
│  [💼 Get a Software Job]             │
│  [💪 Build Muscle]                   │
│  [🕺 Learn Dance]                    │
│  [📖 Learn a Language]               │
│  [🏃 Run a Marathon]                 │
│  [🎸 Learn Guitar]                   │
│  [➕ Create Custom Goal]             │
│                                       │
│              [Continue →]            │
└─────────────────────────────────────┘
```

- Components: GoalChip (icon + label, multi-select toggle, max 4 selectable, disabled state once 4 picked), PrimaryButton.
- States: 0 selected (Continue disabled), 1–4 selected (Continue enabled), Custom goal opens an inline text field + emoji picker.
- Interaction: Tapping a chip toggles selected (filled background + checkmark). No page navigation needed for selection itself.

### 9.2 Onboarding — Step 2: Hours & Wake Time

```
┌─────────────────────────────────────┐
│  Step 2 of 4                         │
│  "How many hours can you realistically│
│   commit each day?"                  │
│  [ 1h ] [ 2h ] [ 4h ] [ 6h+ ]         │
│                                       │
│  "When do you usually wake up?"      │
│  [ Time Picker: 06:30 AM ]           │
│                                       │
│  [← Back]            [Continue →]    │
└─────────────────────────────────────┘
```

- Components: SegmentedControl (hours), TimePicker.
- Validation: hours required; wake time defaults to 07:00 if skipped.

### 9.3 Onboarding — Step 3: Fixed Commitments (optional)

```
┌─────────────────────────────────────┐
│  Step 3 of 4 (optional — skip ok)    │
│  "Any fixed commitments we should    │
│   work around?"                      │
│                                       │
│  [+ Add commitment]                  │
│   e.g. Work 9–5 Mon–Fri              │
│                                       │
│  List of added commitments (chips,   │
│  removable)                          │
│                                       │
│  [Skip]               [Continue →]   │
└─────────────────────────────────────┘
```

- Each commitment: free-text NLP input (reuses the same natural-language parser as quick-add) — "Work 9 to 5 weekdays" → structured recurring busy block.

### 9.4 Onboarding — Step 4: Plan Preview & Confirm

```
┌─────────────────────────────────────┐
│  "Here's your first week"            │
│                                       │
│  Mon  Tue  Wed  Thu  Fri  Sat  Sun    │
│  [day columns, each showing stacked  │
│   colored time blocks labeled with   │
│   goal name + time range]            │
│                                       │
│  Tap any block to edit time/duration │
│  Drag to move within the day         │
│                                       │
│  [Regenerate Plan]   [Looks good →]  │
└─────────────────────────────────────┘
```

- Components: WeekGrid (7 columns × hour rows), TimeBlock (color-coded by goal), drag-and-drop reposition (snap to 15-min increments), tap-to-edit modal (title, start time, duration, recurrence).
- "Regenerate Plan" re-calls the AI generation engine with same inputs but requests a variant.
- On confirm, plan is persisted and recurrence rules are written to the schedule engine (Section 11).

### 9.5 Today / Dashboard (primary landing screen)

```
┌─────────────────────────────────────┐
│  Good morning, Suraj          [🔔][⚙]│
│                                       │
│  Today's focus                       │
│  ✓ 3 job applications                │
│  ✓ React Hooks                       │
│  ✓ Push Day                          │
│  ✓ Dance Musicality                  │
│  Estimated completion: 6h 20m        │
│                                       │
│  ── Per-goal progress ──             │
│  Interview Prep   ██████░░░  68%     │
│  Gym               ██████████  77%   │
│  Dance              ███░░░░░░  41%   │
│  Job Search          █████████  82%  │
│                                       │
│  Overall            71%              │
│                                       │
│  ── AI Coach card ──                 │
│  "Your gym performance has plateaued │
│   for two weeks. Consider a deload." │
│  [View suggestion]                   │
│                                       │
│  ── Today's blocks (chronological) ──│
│  9:30  React Fundamentals      [✓]   │
│  11:00 Home Workout             [ ]  │
│  1:00  Learning: Performance    [ ]  │
│  3:30  Gym – Push Day           [ ]  │
│  7:30  Dance – Grooves          [ ]  │
│  9:00  Evening Stretch          [ ]  │
│                                       │
│  [Bottom Tab Bar: Today|Timeline|    │
│   Goals|Coach|Profile]               │
└─────────────────────────────────────┘
```

- Components: GreetingHeader, AIDailyBriefCard, ProgressBar (per goal, animated fill), CoachCard (dismissible, single most relevant suggestion only — never a stacked feed on the dashboard), BlockListItem (checkbox, title, time, tap-to-expand for sub-tasks e.g. "Components & JSX, State vs Props, Hooks").
- States: BlockListItem has 3 states — pending (default), done (checkmark, strikethrough optional via setting), missed (shown after grace window with a "Reschedule" inline action instead of a red flag).
- Empty state: if no plan exists yet (shouldn't happen post-onboarding, but as a fallback) → CTA "Build your first plan."

### 9.6 Timeline (Day/Week Calendar View)

```
┌─────────────────────────────────────┐
│  [Day] [Week]      < Jun 30 >  [Today]│
│                                       │
│  8am ─────────────────────────────   │
│  9am ─[React Fundamentals]────────   │
│  10am ─────────────────────────────  │
│  11am ─[Home Workout]──────────────  │
│  12pm ─────────────────────────────  │
│  1pm ──[Learning: Performance]─────  │
│  ...                                 │
│                                       │
│  [+ Quick Add bar at bottom]         │
└─────────────────────────────────────┘
```

- Week view: 7-column grid, same TimeBlock component as onboarding preview, drag to move/resize, color-coded by goal category.
- Quick Add bar: persistent text input, natural-language parsing (Section 11.4), pressing enter shows a confirmation chip before commit if confidence < threshold.

### 9.7 Goals — List

```
┌─────────────────────────────────────┐
│  Your Goals                  [+ Add] │
│                                       │
│  💼 Interview Prep        68%  >     │
│  💪 Build Muscle           77%  >    │
│  🕺 Learn Dance             41%  >   │
│                                       │
└─────────────────────────────────────┘
```

### 9.8 Goal Detail

```
┌─────────────────────────────────────┐
│  ← 💼 Interview Prep                 │
│  Overall: 68%   8-week roadmap       │
│  Week 3 of 8                         │
│                                       │
│  Roadmap                             │
│  ✓ Week 1: React Fundamentals        │
│  ✓ Week 2: JavaScript Deep Dive      │
│  ▶ Week 3: DSA — Arrays/Strings/     │
│     Hash Maps/Two Pointers           │
│  ○ Week 4: React Advanced            │
│  ○ Week 5: Machine Coding            │
│  ○ Week 6: Mixed Revision            │
│  ○ Week 7: Mock Interviews           │
│  ○ Week 8: Applications + Polish     │
│                                       │
│  [Edit Roadmap]  [Regenerate Week]   │
│                                       │
│  Recent activity (log of completions)│
└─────────────────────────────────────┘
```

- Roadmap items expandable to show daily sub-topics (matches the structure from the original weekly plan: Monday→React Fundamentals→Components & JSX/State vs Props/Hooks/Build a component).

### 9.9 Add/Edit Goal (manual or AI-generated)

```
┌─────────────────────────────────────┐
│  Create a goal                       │
│  Title: [______________]             │
│  Icon: [emoji picker]                │
│  Target duration: [4 / 8 / 12 weeks /│
│   Ongoing]                            │
│  Weekly hours allocation: [slider]    │
│                                       │
│  "Would you like an AI-generated     │
│   roadmap for this?"  [Yes] [No]     │
│                                       │
│  If Yes → loading state →            │
│  AI-generated roadmap preview        │
│  (editable list, same as 9.8)        │
│                                       │
│  [Save Goal]                         │
└─────────────────────────────────────┘
```

### 9.10 AI Coach

```
┌─────────────────────────────────────┐
│  Coach                               │
│                                       │
│  ── Suggestions ──                   │
│  🏋️ "Gym plateaued 2 weeks. Add a    │
│      deload week?"      [Apply][✕]   │
│  📅 "No applications in 3 days. Add  │
│      a 20-min block today?" [Apply]  │
│  🎯 "All interview sessions done     │
│      this week — move to advanced    │
│      React?"            [Apply][✕]   │
│                                       │
│  ── Ask Coach (chat input) ──        │
│  [Type a question or request...]     │
└─────────────────────────────────────┘
```

- Suggestion cards: each has a structured "Apply" action mapped to a concrete schedule mutation (not just text), plus dismiss. Dismissed suggestions are logged (used to tune future suggestion frequency — avoid nagging).
- Chat input: free-form ask box, backed by the same LLM context used for plan generation (read access to user's schedule/progress, write access gated behind explicit confirmation for any mutating action).

### 9.11 Gym Tracker

```
┌─────────────────────────────────────┐
│  Push Day — Today                    │
│                                       │
│  Bench Press                         │
│   Set 1: [80kg] x [8]  ✓             │
│   Set 2: [80kg] x [8]  ✓             │
│   Set 3: [_____] x [__]              │
│   [+ Add set]                        │
│  Incline Press  ...                  │
│  Shoulder Press ...                  │
│  Lateral Raises ...                  │
│  Triceps ...                         │
│                                       │
│  [Finish Workout]                    │
│                                       │
│  Split rotation: Push→Pull→Legs→     │
│  Upper→Lower→Arms (auto-advances)    │
└─────────────────────────────────------┘
```

- Pre-fills weights from the last session of the same exercise (progressive overload reference).
- "Finish Workout" triggers completion of the linked schedule block + feeds the AI Coach's plateau-detection signal (Section 11.3).

### 9.12 Job Tracker (V2)

```
┌─────────────────────────────────────┐
│  Job Search            82%           │
│  Applied(12) Screen(4) Interview(2)  │
│  Offer(0)                            │
│                                       │
│  [Kanban columns, draggable cards]   │
│  Each card: Company, Role, Date,     │
│  Notes                               │
└─────────────────────────────────────┘
```

### 9.13 Progress / Analytics

```
┌─────────────────────────────────────┐
│  Progress                            │
│  [Weekly] [Monthly] [All-time]       │
│                                       │
│  Overall trend (line chart)          │
│  Per-goal bars (current %)           │
│  Consistency heatmap (calendar grid, │
│   color intensity = completion %)    │
│                                       │
│  Week in Review (Sundays):           │
│  "You completed 27 of 34 planned     │
│   blocks (79%) this week."           │
└─────────────────────────────────────┘
```

- Heatmap intentionally avoids the word "streak" — labelled "Consistency" — and never breaks/resets visually on a missed day, it just dims that day.

### 9.14 Notifications Center

```
┌─────────────────────────────────────┐
│  Notifications                       │
│  🏋️ Push Day starts in 10 min.       │
│     Today you're increasing bench    │
│     by 2.5kg.                        │
│  🎵 Today's challenge: Stay in the   │
│     pocket for a full minute.        │
│  💬 Yesterday's Event Loop questions │
│     were tough. Let's finish today.  │
└─────────────────────────────────────┘
```

### 9.15 Settings

```
┌─────────────────────────────────────┐
│  Settings                            │
│  Profile                             │
│  Schedule Preferences (hours/day,    │
│   wake time, working hours)          │
│  Notification Preferences (toggle    │
│   per category + quiet hours)        │
│  Integrations (Google Calendar sync) │
│  Data Export / Privacy               │
│  Subscription (V2)                   │
│  Log out                             │
└─────────────────────────────────────┘
```

## 10. Design System

### 10.1 Color Palette

| Token                    | Hex                                                       | Usage                                                                                       |
| ------------------------ | --------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `--color-primary`        | #5B5BF0 (indigo-violet)                                   | Primary actions, active nav, brand                                                          |
| `--color-primary-dark`   | #4040C2                                                   | Hover/pressed states                                                                        |
| `--color-success`        | #2FB67C                                                   | Completed states, progress fill                                                             |
| `--color-warning`        | #E8A33D                                                   | Missed/reschedule prompts (never pure red — avoid alarm framing)                            |
| `--color-bg`             | #FAFAFC (light) / #0E0E12 (dark)                          | App background                                                                              |
| `--color-surface`        | #FFFFFF (light) / #18181F (dark)                          | Cards, sheets                                                                               |
| `--color-border`         | #E6E6EC (light) / #2A2A33 (dark)                          | Dividers, card borders                                                                      |
| `--color-text-primary`   | #16161D (light) / #F2F2F5 (dark)                          | Headings, primary text                                                                      |
| `--color-text-secondary` | #6B6B76 (light) / #9B9BA6 (dark)                          | Subtext, captions                                                                           |
| Goal category colors     | Auto-assigned from a fixed 8-color set (rotated per goal) | Used for TimeBlock and progress bar coloring, stable per-goal-id hash so colors don't shift |

### 10.2 Typography

- Font: **Inter** (system fallback: -apple-system, Segoe UI, Roboto).
- Scale: `display` 32/40, `h1` 24/32, `h2` 20/28, `h3` 17/24, `body` 15/22, `caption` 13/18, `micro` 11/16.
- Weight usage: 600 for headings and emphasis, 500 for interactive labels, 400 for body.

### 10.3 Spacing & Grid

- 4px base unit. Spacing scale: 4/8/12/16/24/32/48/64.
- Mobile container padding: 16px. Desktop max content width: 1080px, centered, 24px gutter.
- Card border radius: 16px (large cards), 10px (chips/buttons), 999px (pills).

### 10.4 Core Components (build as a shared component library)

- `Button` (primary/secondary/ghost/destructive, sm/md/lg)
- `GoalChip` (selectable, with icon)
- `ProgressBar` (animated, color-coded by goal, supports label + %)
- `TimeBlock` (calendar event card — color, title, time range, completion checkbox)
- `Checkbox` / `TaskRow`
- `CoachCard` (icon, message, primary action, dismiss)
- `BottomSheet` (mobile modal pattern for edit/confirm flows)
- `SegmentedControl`
- `TimePicker`
- `Toast` (lightweight confirmation, e.g., "Task rescheduled to 7 PM")
- `Heatmap` (consistency calendar)
- `EmptyState`
- `QuickAddBar` (persistent text input + send, used in Timeline and as a global FAB on mobile)

### 10.5 Motion & Micro-interactions

- Progress bar fills animate over 400ms ease-out on value change.
- Task completion: checkbox check + row strikethrough fade (200ms) + progress bar increments visibly — this small feedback loop is core to the "everything feels like progress" philosophy.
- Coach card entrance: slide-up + fade, max once per app open (not re-triggered on every screen focus).
- No celebratory confetti/animations in MVP (kept calm per Philosophy #8); revisit in V2 only as an optional, toggle-able setting.

### 10.6 Dark Mode

- Full dark mode required at MVP (not optional/V2) since target users (Persona 1/3) frequently use the app at night (evening stretch sessions, late study blocks).

---

## 11. AI Architecture

### 11.1 Overview of AI Surfaces

1. **Plan Generation Engine** — goal(s) + constraints → structured weekly recurring schedule.
2. **Natural Language Task Parser** — free text → structured task object.
3. **AI Coach (proactive)** — behavioral signals → suggestion objects.
4. **AI Coach (reactive/chat)** — user question + context → answer, optionally a proposed schedule mutation.
5. **AI Daily Brief** — today's blocks + recent performance → short motivational summary string.
6. **Notification Copywriter** — template + context variables → personalized notification text (V2).

### 11.2 Plan Generation Engine

**Input:** selected goal categories, hours/day, wake time, fixed commitments, (optional) target deadline.
**Process:**

1. For each goal, retrieve or generate a **roadmap template** (e.g., "Software Job — 8 week" defines week-by-week topic themes: Week1=React Fundamentals, Week2=JavaScript, Week3=DSA, etc., as seeded in Section 9.8). Custom goals get an LLM-generated roadmap on the fly via a structured prompt (Section 11.5).
2. A **scheduling allocator** assigns each day's roadmap topic into time blocks, respecting: total daily hour budget, fixed commitments (never overlaps), preferred time-of-day defaults per goal type (e.g., learning blocks default morning, gym default afternoon/evening, evening stretch fixed late), and a maximum of ~5–6 blocks/day to avoid overload.
3. Output is a set of **recurrence rules** (see DB schema 13.4) — not just one-off events — so the schedule auto-rotates (e.g., gym split Push→Pull→Legs→Upper→Lower→Arms cycling weekly, dance theme rotating Grooves→Musicality→Footwork→Concepts→Battle→Review, matching the original spec).
4. Returned as a preview object the client renders in the Onboarding Step 4 / Goal regeneration screens; nothing is persisted until user confirms.

**Determinism vs. AI:** the weekly _rotation logic_ (split rotation, dance theme rotation) is deterministic/rule-based, not LLM-generated, for reliability. The LLM is used for: (a) generating roadmap templates for _custom_ goals not in the seed library, (b) producing the human-readable daily sub-topic descriptions, and (c) the preview/regenerate variation. This hybrid approach avoids relying on an LLM for time-math correctness.

### 11.3 AI Coach — Heuristic Rule Set (V2, rule-based first; V3 upgrades to ML)

Each rule below runs nightly and/or near-real-time against the relevant event:

| Trigger                 | Condition                                                                                     | Suggestion                                                                                            |
| ----------------------- | --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Fitness plateau         | Same exercise, top working weight unchanged or decreased across last 4 logged sessions        | "Your gym performance has plateaued for two weeks. Consider a deload week."                           |
| Consistency surge       | 100% completion in a goal category for 7 consecutive days                                     | "You've completed every [goal] session this week. Ready to move to advanced [topic]?"                 |
| Job search drop-off     | Zero job-application tasks completed in last 3 days (only relevant if Job Search goal active) | "You haven't applied to any jobs in three days. Here's a 20-minute application block this afternoon." |
| Repeated topic struggle | Same sub-topic marked "skipped" or "partial" 2+ times                                         | "Yesterday's [topic] was tough. Let's finish it today."                                               |
| Overload detection      | Daily planned hours consistently exceeds completion rate < 50% for 5+ days                    | "Your schedule might be too packed. Want me to trim it to your actual available hours?"               |
| Goal stagnation         | A goal's progress % hasn't moved in 10+ days                                                  | Prompt to review/regenerate that goal's roadmap.                                                      |

- Suggestions are deduplicated (don't re-show a dismissed suggestion type for 7 days) and capped at **max 1 suggestion shown on Dashboard at a time**, with the rest queued in the Coach screen's list.

### 11.4 Natural Language Task Parser

**Input:** raw user string (typed or voice-transcribed).
**Output schema (JSON):**

```json
{
  "title": "string",
  "goal_category_id": "uuid | null",
  "start_time": "ISO8601 | null",
  "duration_minutes": "number | null",
  "recurrence": {
    "type": "none | daily | weekly | custom",
    "days_of_week": ["mon", ...] ,
    "end_condition": "none | count | date"
  },
  "confidence": 0.0-1.0,
  "needs_confirmation": true|false
}
```

- If `confidence < 0.7` or `goal_category_id` is null, the UI shows a confirmation chip ("Add to Interview Prep? [Yes][Change]") before saving — never silently misfiles a task.
- Implementation: LLM call (function-calling / structured output mode) against the user's existing goal list as context, so category inference is grounded in the user's actual goals rather than guessing generically.

### 11.5 Roadmap Generation Prompt (Custom Goals) — Reference Prompt

```
System: You are a curriculum planner. Given a user's goal and timeframe,
produce a week-by-week roadmap as structured JSON. Each week has a theme
and 3-6 daily sub-topics. Keep scope realistic for the stated weekly hour
budget. Do not exceed the timeframe. Output strict JSON matching schema: {schema}.

User: Goal: "{goal_title}". Timeframe: {N} weeks. Hours/week: {H}.
Context: user already has these other active goals: {other_goals}.
```

- Output validated against a JSON schema server-side before being shown to the user; malformed output triggers one automatic retry, then falls back to a generic template if it still fails.

### 11.6 AI Daily Brief Prompt — Reference

```
System: Write a short (max 3 sentences), warm, non-cheesy morning summary
for a personal productivity app. Use the user's first name. Reference
today's task count and any one notable recent achievement or trend if
available. Avoid generic motivational clichés.

User: Name: {name}. Today's blocks: {block_titles}. Estimated time: {hours}.
Recent note: {optional_recent_achievement}.
```

### 11.7 Guardrails

- AI never auto-deletes a goal or task without explicit user confirmation.
- AI never sends more than one proactive "nag" notification per category per day.
- All AI-mutating actions (apply coach suggestion, regenerate plan) are reversible via a simple "Undo" toast for at least 10 seconds post-action.
- LLM calls related to scheduling never have unrestricted write access — they return structured proposals; a deterministic server-side function performs the actual DB mutation after validation.

---

## 12. Notification System

### 12.1 Notification Categories

1. **Pre-block reminder** (default: 10 min before a scheduled block) — motivational, context-specific copy.
2. **Missed-task reschedule prompt** — fires after grace window (default 30 min, user-configurable).
3. **AI Coach proactive suggestion** — capped at 1/day unless user opts into "frequent coaching" in settings.
4. **Daily Brief** — fires at user's wake time.
5. **Weekly Review** — Sundays, configurable time.
6. **Streak-free consistency nudge** — e.g., "You're at 71% this week — finish strong" (never punitive).

### 12.2 Copy Templates (MVP — static; V2 — AI-personalized via 11.1.6)

- Gym: "🏋️ {block_title} starts in {n} minutes. Today you're {dynamic_detail}."
- Dance: "🎵 Today's challenge: {challenge_text}."
- Study: "📚 Time for {topic}. {context_line}."
- Generic fallback: "{block_title} starts in {n} minutes."

### 12.3 Delivery Architecture

- Web/Android: Firebase Cloud Messaging (FCM).
- iOS native (post-MVP wrapper): Apple Push Notification service (APNs), routed through FCM for a unified send API where possible.
- PWA: Web Push API (works on Android Chrome and desktop Chrome/Edge/Firefox at MVP; iOS Safari PWA push has historically been limited — verify current support at implementation time and treat as best-effort on iOS web).
- Notification scheduling handled server-side via a job scheduler (Section 16) reading each user's upcoming blocks + timezone; not purely client-side local notifications, so it works even if the app isn't open.

### 12.4 User Controls

- Per-category toggle (pre-block reminders, coach suggestions, daily brief, weekly review).
- Quiet hours (e.g., no notifications 10 PM–7 AM regardless of scheduled blocks, with the evening stretch block as a deliberate exception if user opts in).

---

## 13. Database Design (Full Schema)

**Engine:** PostgreSQL (via Supabase). All tables use `uuid` primary keys (`gen_random_uuid()`), `created_at`/`updated_at` timestamps (`timestamptz`, default `now()`), and row-level security (RLS) scoped to `user_id = auth.uid()` unless noted as admin/shared.

### 13.1 `users`

| Column                 | Type          | Notes                               |
| ---------------------- | ------------- | ----------------------------------- |
| id                     | uuid PK       | matches Supabase auth.users.id      |
| email                  | text unique   |                                     |
| display_name           | text          |                                     |
| avatar_url             | text nullable |                                     |
| timezone               | text          | IANA tz string, e.g. "Asia/Kolkata" |
| wake_time              | time          | default 07:00                       |
| daily_hour_budget      | numeric       | hours/day, e.g. 4.0                 |
| onboarding_completed   | boolean       | default false                       |
| theme_preference       | text          | "light" / "dark" / "system"         |
| created_at, updated_at | timestamptz   |                                     |

### 13.2 `goals`

| Column                 | Type               | Notes                                                 |
| ---------------------- | ------------------ | ----------------------------------------------------- |
| id                     | uuid PK            |                                                       |
| user_id                | uuid FK → users.id |                                                       |
| title                  | text               | e.g. "Interview Prep"                                 |
| icon                   | text               | emoji or icon key                                     |
| color_token            | text               | from fixed 8-color set                                |
| category_type          | text               | enum: career, fitness, creative, language, custom     |
| target_weeks           | int nullable       | null = ongoing                                        |
| weekly_hour_allocation | numeric            |                                                       |
| status                 | text               | enum: active, paused, completed, archived             |
| progress_pct           | numeric            | denormalized cache, recalculated on completion events |
| started_at             | date               |                                                       |
| created_at, updated_at | timestamptz        |                                                       |

### 13.3 `roadmaps`

| Column      | Type               | Notes                                                                  |
| ----------- | ------------------ | ---------------------------------------------------------------------- |
| id          | uuid PK            |                                                                        |
| goal_id     | uuid FK → goals.id |                                                                        |
| week_number | int                | 1-indexed                                                              |
| theme       | text               | e.g. "DSA — Arrays/Strings/Hash Maps"                                  |
| sub_topics  | jsonb              | array of strings, e.g. ["Arrays","Strings","Hash Maps","Two Pointers"] |
| status      | text               | enum: upcoming, active, completed                                      |

### 13.4 `recurrence_rules`

| Column                 | Type             | Notes                                                                                   |
| ---------------------- | ---------------- | --------------------------------------------------------------------------------------- |
| id                     | uuid PK          |                                                                                         |
| user_id                | uuid FK          |                                                                                         |
| goal_id                | uuid FK nullable | null for non-goal commitments (e.g., fixed work hours)                                  |
| title_template         | text             | may include placeholders resolved at instance-generation time, e.g. "Gym – {split_day}" |
| days_of_week           | text[]           | e.g. ['mon','wed','fri']                                                                |
| start_time             | time             |                                                                                         |
| duration_minutes       | int              |                                                                                         |
| rotation_set           | jsonb nullable   | e.g. ["Push","Pull","Legs","Upper","Lower","Arms"] for auto-rotating blocks             |
| rotation_index_field   | text nullable    | which counter drives rotation advance (e.g., "week_count")                              |
| is_fixed_commitment    | boolean          | true = busy block, not a goal task                                                      |
| active                 | boolean          |                                                                                         |
| created_at, updated_at | timestamptz      |                                                                                         |

### 13.5 `task_instances`

(Materialized per-day occurrences generated from `recurrence_rules`, so completion state, drag-edits, and one-off overrides attach to a concrete row rather than mutating the rule.)
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid FK | |
| goal_id | uuid FK nullable | |
| recurrence_rule_id | uuid FK nullable | null if created ad hoc (e.g., via quick-add, one-off) |
| title | text | |
| sub_tasks | jsonb nullable | array of strings, e.g. ["Components & JSX","State vs Props","Hooks"] |
| scheduled_date | date | |
| start_time | time | |
| duration_minutes | int | |
| status | text | enum: pending, done, partial, missed, skipped, rescheduled |
| completed_at | timestamptz nullable | |
| rescheduled_from_instance_id | uuid nullable FK self | for audit trail of reschedules |
| created_at, updated_at | timestamptz | |

### 13.6 `gym_logs`

| Column           | Type             | Notes                      |
| ---------------- | ---------------- | -------------------------- |
| id               | uuid PK          |                            |
| user_id          | uuid FK          |                            |
| task_instance_id | uuid FK          | links to the workout block |
| exercise_name    | text             |                            |
| set_number       | int              |                            |
| weight_kg        | numeric nullable |                            |
| reps             | int nullable     |                            |
| created_at       | timestamptz      |                            |

### 13.7 `job_applications` (V2)

| Column                 | Type          | Notes                                             |
| ---------------------- | ------------- | ------------------------------------------------- |
| id                     | uuid PK       |                                                   |
| user_id                | uuid FK       |                                                   |
| company                | text          |                                                   |
| role                   | text          |                                                   |
| stage                  | text          | enum: applied, screen, interview, offer, rejected |
| applied_date           | date          |                                                   |
| notes                  | text nullable |                                                   |
| created_at, updated_at | timestamptz   |                                                   |

### 13.8 `notes`

| Column                 | Type             | Notes |
| ---------------------- | ---------------- | ----- |
| id                     | uuid PK          |       |
| user_id                | uuid FK          |       |
| goal_id                | uuid FK nullable |       |
| task_instance_id       | uuid FK nullable |       |
| body                   | text             |       |
| created_at, updated_at | timestamptz      |       |

### 13.9 `coach_suggestions`

| Column         | Type                 | Notes                                           |
| -------------- | -------------------- | ----------------------------------------------- |
| id             | uuid PK              |                                                 |
| user_id        | uuid FK              |                                                 |
| rule_key       | text                 | which heuristic fired (e.g., "fitness_plateau") |
| message        | text                 |                                                 |
| action_payload | jsonb nullable       | structured mutation to apply if accepted        |
| status         | text                 | enum: pending, applied, dismissed, expired      |
| created_at     | timestamptz          |                                                 |
| resolved_at    | timestamptz nullable |                                                 |

### 13.10 `notifications_log`

| Column           | Type        | Notes                                      |
| ---------------- | ----------- | ------------------------------------------ |
| id               | uuid PK     |                                            |
| user_id          | uuid FK     |                                            |
| category         | text        | enum matching 12.1                         |
| body             | text        |                                            |
| sent_at          | timestamptz |                                            |
| delivery_channel | text        | enum: push, web_push, email                |
| status           | text        | enum: sent, failed, suppressed_quiet_hours |

### 13.11 `notification_preferences`

| Column              | Type                 | Notes |
| ------------------- | -------------------- | ----- |
| user_id             | uuid PK FK           |       |
| pre_block_reminders | boolean default true |       |
| coach_suggestions   | boolean default true |       |
| daily_brief         | boolean default true |       |
| weekly_review       | boolean default true |       |
| quiet_hours_start   | time nullable        |       |
| quiet_hours_end     | time nullable        |       |

### 13.12 ER Relationship Summary (text diagram)

```
users 1───* goals
goals 1───* roadmaps
users 1───* recurrence_rules        (goal_id FK nullable)
recurrence_rules 1───* task_instances
goals 1───* task_instances           (goal_id FK nullable for non-goal tasks)
task_instances 1───* gym_logs
task_instances 1───* notes
users 1───* job_applications
users 1───* coach_suggestions
users 1───* notifications_log
users 1───1 notification_preferences
```

### 13.13 Indexing Notes

- `task_instances(user_id, scheduled_date)` composite index — primary access pattern is "give me today's/this week's tasks for user X."
- `gym_logs(user_id, exercise_name, created_at desc)` — supports plateau-detection queries (last N sessions per exercise).
- `coach_suggestions(user_id, status)` partial index where `status='pending'`.

---

## 14. API Specification

**Style:** REST over HTTPS, JSON bodies, versioned under `/api/v1/`. (If using Supabase directly from the client for simple CRUD, these endpoints represent the **server/Edge Function layer** needed for anything involving AI calls, scheduling logic, or cross-table mutations that shouldn't run client-side.)

### 14.1 Auth

- `POST /api/v1/auth/signup` — email/password
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/oauth/google`
- `POST /api/v1/auth/logout`
- (Handled largely by Supabase Auth SDK directly; custom endpoints only needed for post-signup hooks like creating the default `notification_preferences` row.)

### 14.2 Onboarding & Plan Generation

- `POST /api/v1/plan/generate`
    - Body: `{ goals: [...], daily_hour_budget, wake_time, fixed_commitments: [...] }`
    - Returns: preview plan object (recurrence rules + sample week, not yet persisted)
- `POST /api/v1/plan/confirm`
    - Body: the (possibly user-edited) preview plan
    - Persists `recurrence_rules`, `roadmaps`, generates first `task_instances` window (e.g., next 14 days)

### 14.3 Goals

- `GET /api/v1/goals`
- `POST /api/v1/goals` (manual create)
- `POST /api/v1/goals/:id/generate-roadmap` (AI roadmap for a single goal)
- `PATCH /api/v1/goals/:id`
- `DELETE /api/v1/goals/:id` (soft delete → status=archived)

### 14.4 Tasks / Schedule

- `GET /api/v1/tasks?from=DATE&to=DATE`
- `POST /api/v1/tasks/parse` — natural language parse (Section 11.4), returns structured proposal, does not persist
- `POST /api/v1/tasks` — create from confirmed structured object (ad hoc or recurring)
- `PATCH /api/v1/tasks/:id` — edit time/duration/status
- `POST /api/v1/tasks/:id/complete` — body `{status: "done"|"partial"|"skipped"}`
- `POST /api/v1/tasks/:id/reschedule` — body `{new_date, new_start_time}` or `{skip_week: true}`

### 14.5 Gym Tracker

- `GET /api/v1/gym/last/:exercise_name` — last logged session for pre-fill
- `POST /api/v1/gym/log` — body `{task_instance_id, exercise_name, sets: [{weight_kg, reps}]}`

### 14.6 Job Tracker (V2)

- `GET /api/v1/jobs`
- `POST /api/v1/jobs`
- `PATCH /api/v1/jobs/:id`

### 14.7 AI Coach

- `GET /api/v1/coach/suggestions` — pending suggestions
- `POST /api/v1/coach/suggestions/:id/apply`
- `POST /api/v1/coach/suggestions/:id/dismiss`
- `POST /api/v1/coach/ask` — body `{message}` → reactive chat response, may include a proposed `action_payload`

### 14.8 Progress / Analytics

- `GET /api/v1/progress/overview` — per-goal % + overall %
- `GET /api/v1/progress/heatmap?range=90d`
- `GET /api/v1/progress/weekly-review?week=DATE`

### 14.9 Notifications

- `GET /api/v1/notifications`
- `PATCH /api/v1/notifications/preferences`
- `POST /api/v1/notifications/register-device` — body `{fcm_token | apns_token, platform}`

### 14.10 Settings

- `GET /api/v1/user/profile`
- `PATCH /api/v1/user/profile`
- `GET /api/v1/user/export` — data export (JSON dump, privacy compliance)
- `DELETE /api/v1/user/account`

### 14.11 Standard Response Envelope

```json
{
  "success": true,
  "data": { ... },
  "error": null
}
```

Errors: `{ "success": false, "data": null, "error": { "code": "string", "message": "string" } }`

---

## 15. Authentication & Permissions

- **Provider:** Supabase Auth (email/password + Google OAuth at MVP; Apple Sign-In recommended addition once iOS wrapper ships, given App Store requirements when other social logins are offered).
- **Session:** JWT-based, short-lived access token + refresh token, handled by Supabase client SDK with auto-refresh.
- **Row-Level Security:** Every table with a `user_id` column has RLS policies: `user_id = auth.uid()` for select/insert/update/delete. No table is readable cross-user except via explicit, opt-in V3 social features (not in MVP scope).
- **Roles (MVP):** single role `user`. Add `admin` role in V3 for the admin dashboard (Section 23), enforced via a `user_roles` table checked in RLS policies and server-side middleware — never trust a client-supplied role claim alone.
- **API keys (OpenAI etc.):** never exposed client-side; all LLM calls proxied through server/Edge Functions.

---

## 16. Tech Stack & Rationale

| Layer                                               | Choice                                                                                             | Rationale                                                                                                                                                                                                                                                                                           |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Frontend framework                                  | **React + TypeScript**                                                                             | Matches founder's existing expertise; strong ecosystem; type safety reduces runtime bugs in a data-model-heavy app.                                                                                                                                                                                 |
| Meta-framework                                      | **Next.js (App Router)**                                                                           | SSR/SSG for fast initial load, file-based routing, built-in API routes / Edge Functions for the server layer in Section 14, good PWA support story.                                                                                                                                                 |
| Styling                                             | **Tailwind CSS**                                                                                   | Fast iteration, consistent design tokens (maps directly to Section 10's design system as a Tailwind theme config), small bundle with purge.                                                                                                                                                         |
| Component library base                              | **shadcn/ui**                                                                                      | Unstyled, accessible Radix-based primitives that are copied into the codebase (not a black-box dependency) — easy to theme to the Momentum design system.                                                                                                                                           |
| Backend / DB                                        | **Supabase (PostgreSQL, Auth, Storage, Realtime)**                                                 | Managed Postgres avoids building auth/infra from scratch; RLS gives row-level security cleanly; Realtime channel useful later for live progress sync across devices; generous free tier suits an early-stage/portfolio project.                                                                     |
| AI provider                                         | **OpenAI API** (function calling / structured outputs)                                             | Used for plan generation, NLP task parsing, AI Coach reasoning, daily brief copy — see Section 11 for exact call patterns. Model choice (e.g., a small fast model for parsing vs. a stronger model for roadmap generation) should be benchmarked at implementation time rather than hardcoded here. |
| Push notifications (Android/Web)                    | **Firebase Cloud Messaging (FCM)**                                                                 | Free, reliable, works for both web push and Android.                                                                                                                                                                                                                                                |
| Push notifications (iOS)                            | **Apple Push Notification service (APNs)**                                                         | Required for any native iOS wrapper; integrate via the chosen native shell (see Mobile below).                                                                                                                                                                                                      |
| Mobile shell (V2+)                                  | **Capacitor** (wraps the existing Next.js/React PWA)                                               | Reuses the entire web codebase instead of a parallel React Native rebuild — lowest cost path to iOS/Android app store presence for a solo/small team; revisit React Native or native Swift/Kotlin only if performance/UX limits are hit.                                                            |
| PWA                                                 | **next-pwa / native Next.js PWA support + Web App Manifest**                                       | Installable from the browser at MVP, before any native app investment.                                                                                                                                                                                                                              |
| State management                                    | **Zustand** (client UI state) + **TanStack Query** (server state/caching)                          | Avoids Redux boilerplate; TanStack Query handles caching/invalidation for API data cleanly, important given frequent task-status mutations.                                                                                                                                                         |
| Forms / validation                                  | **Zod** (shared schema validation client + server) + React Hook Form                               | Single source of truth for validation schemas, reusable for the NLP parser's structured-output schema too.                                                                                                                                                                                          |
| Job scheduling (notifications, nightly coach rules) | **Supabase Edge Functions + pg_cron** (or a hosted job queue like Trigger.dev if complexity grows) | Needs to run server-side on a schedule independent of any client being open.                                                                                                                                                                                                                        |
| Hosting                                             | **Vercel** (frontend/Next.js) + **Supabase Cloud** (backend)                                       | Standard, low-ops pairing for a Next.js + Supabase stack; generous free/hobby tiers for early stage.                                                                                                                                                                                                |
| Analytics                                           | **PostHog**                                                                                        | Self-hostable or cloud, product analytics + session replay useful for early user behavior insight (Section 22).                                                                                                                                                                                     |
| Error monitoring                                    | **Sentry**                                                                                         | Standard choice, good Next.js integration.                                                                                                                                                                                                                                                          |
| Charts                                              | **Recharts**                                                                                       | For progress trends/heatmaps in the Analytics screens.                                                                                                                                                                                                                                              |

---

## 17. Frontend Architecture & Folder Structure

```
momentum/
├── app/                          # Next.js App Router
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   ├── (onboarding)/
│   │   ├── goals/
│   │   ├── hours/
│   │   ├── commitments/
│   │   └── preview/
│   ├── (app)/                    # authenticated shell
│   │   ├── today/
│   │   ├── timeline/
│   │   ├── goals/
│   │   │   └── [goalId]/
│   │   ├── coach/
│   │   ├── trackers/
│   │   │   ├── gym/
│   │   │   └── jobs/
│   │   ├── progress/
│   │   ├── notes/
│   │   └── settings/
│   └── api/                      # server route handlers / edge functions
│       ├── plan/
│       ├── tasks/
│       ├── coach/
│       ├── gym/
│       └── notifications/
├── components/
│   ├── ui/                       # shadcn primitives, themed
│   ├── shared/                   # ProgressBar, TimeBlock, CoachCard, etc.
│   └── screens/                  # screen-specific composite components
├── lib/
│   ├── supabase/                 # client + server Supabase instances
│   ├── ai/                       # OpenAI client, prompt templates (11.5/11.6), schema validators
│   ├── scheduling/                # recurrence rule → task_instance materialization logic
│   ├── coach/                     # heuristic rule engine (11.3)
│   └── validation/                # Zod schemas (shared client/server)
├── stores/                        # Zustand stores
├── hooks/                         # TanStack Query hooks per resource
├── styles/                        # Tailwind config / design tokens
├── public/
│   ├── manifest.json              # PWA manifest
│   └── icons/
├── supabase/
│   ├── migrations/                # SQL migration files matching Section 13
│   └── functions/                 # Edge Functions (cron jobs, AI proxy endpoints)
└── tests/
```

**Naming/State conventions:**

- Server state (anything from Supabase/API) lives in TanStack Query hooks (`useTasks`, `useGoals`, `useCoachSuggestions`) — never duplicated into Zustand.
- Zustand only holds ephemeral UI state (active modal, drag state, onboarding step index).
- All dates/times handled in UTC server-side; converted to user's stored `timezone` only at render/display boundaries.

---

## 18. Offline Support & Sync Engine

- **MVP:** PWA service worker caches static assets + last-fetched schedule data for read-only offline viewing ("see today's plan even with no signal"). Task completion taps while offline are queued locally (IndexedDB) and flushed on reconnect.
- **Conflict resolution (MVP-simple):** last-write-wins on `task_instances.status`, since conflicts are rare for a single-user-editing-their-own-schedule use case.
- **V3:** full offline-first sync engine (e.g., via a local-first library or custom outbox pattern) with proper conflict resolution if multi-device simultaneous editing becomes common.

---

## 19. Security

- All traffic over HTTPS; Supabase + Vercel enforce this by default.
- RLS as the primary data-isolation boundary (Section 15) — never rely solely on client-side filtering.
- Secrets (OpenAI API key, FCM server key) stored only in server environment variables / Supabase Edge Function secrets, never in client bundles.
- Rate limiting on AI endpoints (`/plan/generate`, `/tasks/parse`, `/coach/ask`) to prevent cost abuse — e.g., per-user per-minute caps via a simple token-bucket in the Edge Function layer.
- Input sanitization on all freeform text fields (notes, NLP input) before storage and before interpolating into any AI prompt (prompt-injection mitigation: treat user text as data, not instructions, in system prompts).
- Password policy delegated to Supabase Auth defaults (min length, breach-check via HaveIBeenPwned integration if enabled).
- Regular dependency audits (`npm audit` / Dependabot) in CI.

---

## 20. Performance Requirements

- Time-to-interactive on Today screen: < 2.5s on 4G mobile (cold load).
- Task completion tap → UI feedback: < 100ms perceived (optimistic update, reconciled with server async).
- Plan generation API (`/plan/generate`): target < 5s p95 (LLM call dominates; show a loading state with the "Building your schedule..." copy, not a blank screen).
- Timeline drag interactions: 60fps target, no layout thrash (use transform-based dragging, not top/left repaints).
- Lighthouse PWA score target: ≥ 90 at MVP launch.

---

## 21. Accessibility

- WCAG 2.1 AA as the baseline target.
- All interactive elements keyboard-navigable (critical for the desktop/web Timeline drag-and-drop — must have a non-drag keyboard alternative, e.g., an edit modal triggered by Enter/Space).
- Color is never the sole indicator of state (e.g., missed tasks get an icon + label, not just an amber tint, for color-blind users).
- Minimum tap target size 44×44px on mobile.
- Respect `prefers-reduced-motion` for all progress-bar/transition animations.
- Sufficient contrast ratios validated against both light and dark theme tokens in Section 10.1.

---

## 22. Analytics & Success Metrics

### 22.1 Product Analytics Events (PostHog)

- `onboarding_started`, `onboarding_goal_selected`, `onboarding_completed`
- `plan_generated`, `plan_regenerated`, `plan_confirmed`
- `task_completed`, `task_missed`, `task_rescheduled`
- `coach_suggestion_shown`, `coach_suggestion_applied`, `coach_suggestion_dismissed`
- `nlp_task_created`, `nlp_confirmation_required` (track parser confidence misses to improve prompts)
- `notification_sent`, `notification_opened`

### 22.2 North Star & Supporting Metrics

- **North Star metric:** Weekly Active Completion Rate — the % of scheduled blocks marked done/partial across active users in a rolling 7-day window. (Chosen over raw DAU because it directly reflects the core promise: "we built your day, did you live it.")
- **Activation:** % of signups that complete onboarding AND confirm a first plan within 24 hours.
- **Retention:** Day 7 / Day 30 retention (returned and completed at least 1 task).
- **Coach effectiveness:** % of shown coach suggestions that are applied (target a healthy, non-annoying ratio — too high might mean too few suggestions are shown; too low means suggestions are low quality or poorly timed).
- **Reschedule health:** ratio of rescheduled vs. permanently skipped tasks — high skip-with-no-reschedule could indicate overload (feeds back into the "Overload detection" coach rule, 11.3).

---

## 23. Admin Dashboard (V3)

- Internal-only tool (separate route, `admin` role gated) for: user lookup/support, viewing a user's schedule for debugging support tickets (with explicit audit logging of any admin data access, given the personal/sensitive nature of schedule data), aggregate metrics dashboards (pulling from 22.1/22.2), and feature-flag toggles for gradual AI Coach rule rollout.

---

## 24. Monetization (V3, informational — not required for MVP build)

- **Freemium model:** Free tier = 1 active goal, basic notifications, no AI Coach proactive suggestions (reactive ask-coach only, rate-limited).
- **Pro tier (subscription):** unlimited goals, full AI Coach, calendar sync, voice input, priority AI response times.
- Potential future add-on: human-coach marketplace layer (out of scope for this PRD; flagged only as a roadmap idea per the original chat).

---

## 25. Testing Strategy

- **Unit tests:** Vitest/Jest for `lib/scheduling` (recurrence → task_instance materialization logic is the highest-risk-of-bugs area — needs thorough date-math test coverage including timezone edge cases and DST transitions), `lib/coach` heuristics, Zod schema validators.
- **Integration tests:** API route handlers against a test Supabase instance (or local Supabase via Docker), covering the full plan-generate → confirm → task-instance-creation flow.
- **E2E tests:** Playwright covering the critical paths — signup → onboarding → first plan confirm → complete a task → see progress update; and the missed-task → reschedule flow.
- **AI output validation tests:** snapshot/schema tests ensuring LLM structured outputs (roadmap generation, NLP parsing) always validate against the Zod/JSON schemas, with a fixture set of representative prompts run in CI against a pinned model version where feasible (or mocked for cost/speed in regular CI, with a smaller real-call suite run nightly).
- **Manual QA checklist:** dark mode pass, offline mode pass, notification delivery pass (real device test on iOS PWA, Android, desktop Chrome).

---

## 26. CI/CD & Deployment

- **Repo:** single monorepo (Next.js app + Supabase migrations/functions co-located) for MVP simplicity.
- **CI (GitHub Actions):** on PR — lint (ESLint), typecheck (tsc), unit tests, build check. On merge to `main` — same checks + deploy.
- **CD:** Vercel auto-deploys `main` to production, PR branches get preview deployments. Supabase migrations applied via the Supabase CLI in a deploy step (`supabase db push`), gated behind a manual approval step for production to avoid accidental destructive migrations.
- **Environments:** `local` (Supabase local dev via CLI/Docker), `staging` (separate Supabase project + Vercel preview env), `production`.
- **Secrets management:** Vercel environment variables + Supabase project secrets; never committed to the repo.

---

## 27. MVP Roadmap & Sprint Breakdown

Assuming a solo founder/small team building in focused sprints (2-week sprints used as a reference unit; adjust pace as needed — this is sequencing, not a hard calendar commitment):

**Sprint 0 — Foundation**

- Repo setup, Next.js + Tailwind + shadcn scaffold, Supabase project + auth wiring, design tokens implemented, CI pipeline skeleton.

**Sprint 1 — Data Model & Auth**

- All tables from Section 13 migrated, RLS policies written and tested, signup/login/OAuth flows working end-to-end.

**Sprint 2 — Onboarding & Plan Generation**

- Onboarding screens (9.1–9.4), Plan Generation Engine (11.2) with at least 2 seeded roadmap templates (Software Job, Build Muscle) to validate the deterministic rotation logic, plan preview + confirm → persists recurrence_rules + first task_instances window.

**Sprint 3 — Today / Timeline Core Loop**

- Today dashboard (9.5), Timeline day/week view (9.6) with drag-to-reschedule, task completion flow, missed-task grace window + reschedule prompt (Journey C).

**Sprint 4 — Natural Language Input + Goals**

- Quick-add NLP parser (11.4) end-to-end with confirmation-chip UX, Goals list/detail screens (9.7–9.9), manual goal creation.

**Sprint 5 — Gym Tracker + Progress/Analytics**

- Gym Tracker (9.11) with pre-fill from last session, Progress/Analytics screen (9.13) with per-goal % and consistency heatmap.

**Sprint 6 — Notifications + Polish**

- FCM/Web Push wiring, notification scheduling job, notification preferences (9.15/12.4), dark mode QA pass, accessibility pass, performance pass against Section 20 targets.

**Sprint 7 — PWA + Beta Launch Prep**

- PWA manifest/install flow, analytics events (22.1) instrumented, error monitoring wired, E2E test suite green, soft launch to a small user group (founder + a handful of real users matching the Personas).

**Post-MVP (V2 sprints, sequenced after MVP validation):**
AI Coach proactive rules (11.3) → Voice input → Job Tracker → Notes/Journal → Calendar sync → Native mobile wrapper via Capacitor → Widgets.

---

## 28. Risks & Open Questions

| Risk                                                                                     | Mitigation                                                                                                                                                                                                                                                                    |
| ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| LLM-generated roadmaps could be low quality or unrealistic for the stated hour budget    | Hybrid approach (11.2) keeps time-math deterministic; seed high-quality templates for common goals (job prep, fitness) rather than fully relying on LLM for those; validate output against schema + sanity bounds (e.g., total weekly hours ≤ budget) before showing to user. |
| Users may distrust an auto-generated plan they didn't build themselves                   | Plan preview + easy edit/regenerate before confirm (9.4) is non-negotiable — never silently auto-commit a generated plan.                                                                                                                                                     |
| Notification fatigue → uninstalls                                                        | Hard caps (max 1 coach suggestion/day default, 12.1), per-category opt-out, quiet hours.                                                                                                                                                                                      |
| iOS web push limitations could hurt the "no native app needed at MVP" plan for iOS users | Treat iOS PWA push as best-effort at MVP; prioritize Capacitor-wrapped native push (APNs) earlier in V2 if iOS user share is significant — validate actual iOS PWA push support at implementation time since platform behavior changes.                                       |
| Cost of LLM calls at scale (plan generation + NLP parsing + coach)                       | Rate limiting (Section 19), caching repeated roadmap templates instead of regenerating per user, model-tiering (cheaper/faster model for NLP parsing, stronger model only for roadmap generation).                                                                            |
| Scope creep — this PRD itself lists a large MVP                                          | Section 8.1's MVP list should be treated as the hard ceiling for v1 ship; anything not explicitly in 8.1 is deferred regardless of how tempting, to protect ship date.                                                                                                        |

**Open questions to resolve during build (not blocking start):**

- Exact roadmap template library size at MVP launch (how many seeded goal templates beyond Software Job / Build Muscle / Learn Dance).
- Whether Google Calendar sync should be MVP or strictly V2 (currently scoped V2 per 8.2).
- Final choice of LLM model(s) per AI surface — to be benchmarked on cost/latency/quality once implementation begins.

---

## 29. Future Vision (V2 / V3 Recap)

See Section 8.2 and 8.3 for the full feature lists. The long-term vision is for Momentum to become a genuinely cross-domain personal operating system — where signals from fitness, study, sleep, and job search feed one coherent AI Coach that understands the whole person, not siloed app-by-app data. The defensibility over time comes from this cross-goal pattern recognition compounding with usage history, which is structurally hard for a single-domain competitor (a pure task app, a pure fitness app) to replicate.

---

_End of Document — Momentum PRD v1.0_
