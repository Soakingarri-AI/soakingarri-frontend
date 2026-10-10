import type { AskSessionSummary } from '@/features/chat';
import { isSameDay } from '@/shared/lib/format';

export interface SessionGroup {
  label: 'Today' | 'Yesterday' | 'Earlier';
  sessions: AskSessionSummary[];
}

/** Buckets sessions by last activity into Today / Yesterday / Earlier, dropping empty buckets. */
export const groupSessions = (sessions: AskSessionSummary[]): SessionGroup[] => {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  const groups: SessionGroup[] = [
    { label: 'Today', sessions: [] },
    { label: 'Yesterday', sessions: [] },
    { label: 'Earlier', sessions: [] },
  ];

  for (const session of sessions) {
    const updated = new Date(session.updated_at);
    if (isSameDay(updated, now)) groups[0].sessions.push(session);
    else if (isSameDay(updated, yesterday)) groups[1].sessions.push(session);
    else groups[2].sessions.push(session);
  }

  return groups.filter((g) => g.sessions.length > 0);
};
