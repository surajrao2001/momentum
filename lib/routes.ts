export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    SIGNUP: '/signup',
    VERIFY_EMAIL: '/verify-email',
    ONBOARDING_GOALS: '/onboarding/goals',
    ONBOARDING_HOURS: '/onboarding/hours',
    ONBOARDING_COMMITMENTS: '/onboarding/commitments',
    ONBOARDING_PREVIEW: '/onboarding/preview',
    TODAY: '/today',
    TIMELINE: '/timeline',
    GOALS: '/goals',
    COACH: '/coach',
    TRACKERS: '/trackers',
    PROGRESS: '/progress',
    SETTINGS: '/settings',
    NOTIFICATIONS: '/notifications',
} as const;

export const NAV_ITEMS = [
    { path: ROUTES.TODAY, label: 'Today', icon: 'home' },
    { path: ROUTES.TIMELINE, label: 'Timeline', icon: 'timeline' },
    { path: ROUTES.GOALS, label: 'Goals', icon: 'goals' },
    { path: ROUTES.COACH, label: 'Coach', icon: 'coach' },
    { path: ROUTES.SETTINGS, label: 'Profile', icon: 'profile' },
] as const;

export const DESKTOP_NAV_ITEMS = [
    { path: ROUTES.TODAY, label: 'Today', icon: 'home' },
    { path: ROUTES.TIMELINE, label: 'Timeline', icon: 'timeline' },
    { path: ROUTES.GOALS, label: 'Goals', icon: 'goals' },
    { path: ROUTES.COACH, label: 'Coach', icon: 'coach' },
    { path: ROUTES.TRACKERS, label: 'Trackers', icon: 'trackers' },
    { path: ROUTES.PROGRESS, label: 'Progress', icon: 'progress' },
    { path: ROUTES.SETTINGS, label: 'Profile', icon: 'profile' },
] as const;
