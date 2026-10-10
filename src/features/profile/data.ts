// Placeholder profile stats. The backend has no endpoints for these yet; when
// it does, replace each constant with a query hook and keep the cards as-is.

export interface UsageMeter {
  label: string;
  used: number;
  limit: number;
  barClass: string;
}

export const USAGE_RESET_LABEL = 'Resetting in 14 days';

export const USAGE_METERS: UsageMeter[] = [
  { label: 'Tokens (SOAKINGARRI AI)', used: 824_000, limit: 1_000_000, barClass: 'bg-amber-500' },
  { label: 'Generative Frames', used: 124, limit: 500, barClass: 'bg-indigo-500' },
];

export const ACTIVITY_STATS = [
  { label: 'Prompts Sent', value: '1,340' },
  { label: 'Model Used', value: '3' },
  { label: 'Uptime', value: '97.89%' },
];

export interface Achievement {
  icon: string;
  label: string;
}

export interface AchievementTrack {
  /** Tailwind classes for the badge circle and its label. */
  badgeClass: string;
  labelClass: string;
  items: Achievement[];
}

export const ACHIEVEMENT_TRACKS: AchievementTrack[] = [
  {
    badgeClass:
      'bg-gradient-to-br from-amber-500/20 to-orange-900/40 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]',
    labelClass: 'text-amber-500',
    items: [2500, 5000, 7500, 10000].map((n) => ({ icon: '📚', label: `Reach ${n}\nKnowledge Points` })),
  },
  {
    badgeClass:
      'bg-gradient-to-br from-indigo-500/20 to-purple-900/40 border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]',
    labelClass: 'text-indigo-400',
    items: [50, 100, 200, 300].map((n) => ({ icon: '🌌', label: `Explore ${n}\ndifferent topics` })),
  },
];

export const SAVED_NOTES = [
  {
    title: 'Give me random names...',
    preview: "How about the name 'Seraphina Grace'? It exudes elegance and...",
  },
  {
    title: 'Give me random names...',
    preview: "How about the name 'Seraphina Grace'? It exudes elegance and...",
  },
];
