import type { AuthSession, User } from '../../src/features/auth/api/types.ts';
import type {
  AskResponse,
  AskSessionDetail,
  AskSessionSummary,
} from '../../src/features/chat/api/types.ts';

// Fake API payloads, typed against the app's own response types so a backend
// shape change that breaks the app also breaks these at compile time.

export const testUser: User = {
  id: 'user-1',
  email: 'ada@example.com',
  full_name: 'Ada Obi',
  is_active: true,
  is_verified: true,
  created_at: '2026-01-01T00:00:00Z',
};

export const testPassword = 'Password123!';

export const authSession: AuthSession = {
  access_token: 'test-access-token',
  refresh_token: 'test-refresh-token',
  token_type: 'bearer',
  user: testUser,
};

const now = new Date().toISOString();

export const markdownAnswer = `Nelson Mandela's works span activism and nation-building.

### Anti-Apartheid Activism
1. **Leadership in the ANC**: He helped organise protests.
2. **Formation of Umkhonto we Sizwe**: Co-founded in 1961.

### Legacy
- Celebrated for his commitment to **human rights**.
- Inspired movements worldwide.`;

export const askResponse: AskResponse = {
  session_id: 'session-1',
  message_id: 'msg-2',
  answer: markdownAnswer,
  learning_mode: 'normal',
  sources: [
    {
      title: 'Long Walk to Freedom',
      source_url: 'https://example.com/long-walk',
      snippet: 'Autobiography of Nelson Mandela.',
      category: 'book',
    },
  ],
};

export const sessionDetail: AskSessionDetail = {
  id: 'session-1',
  title: 'Nelson Mandela',
  learning_mode: 'normal',
  created_at: now,
  updated_at: now,
  messages: [
    { id: 'msg-1', role: 'user', content: "What were Nelson Mandela's works?", created_at: now },
    {
      id: 'msg-2',
      role: 'assistant',
      content: markdownAnswer,
      meta: { sources: askResponse.sources },
      created_at: now,
    },
  ],
};

export const sessionSummaries: AskSessionSummary[] = [
  { id: 'session-1', title: 'Nelson Mandela', created_at: now, updated_at: now },
  {
    id: 'session-2',
    title: 'The Kingdom of Benin',
    created_at: '2026-01-10T09:00:00Z',
    updated_at: '2026-01-10T09:00:00Z',
  },
];
