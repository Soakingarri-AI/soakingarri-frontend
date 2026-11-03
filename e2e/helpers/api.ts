import type { Page } from '@playwright/test';
import { authSession, testUser } from '../fixtures/data.ts';

/**
 * Answers every /api/v1 call in the browser so no test reaches the real API.
 * Anything a test hasn't mocked gets a 404, which shows up as a failing test
 * rather than a silent hit on production.
 *
 * Playwright tries the most recently added route first, so mocks a test adds
 * after this one take priority.
 */
export const mockApi = async (page: Page) => {
  await page.route('**/api/v1/**', (route) =>
    route.fulfill({ status: 404, json: { detail: `Not mocked: ${route.request().url()}` } })
  );
  // The sidebar loads recent chats on every signed-in page.
  await page.route('**/api/v1/ask/sessions', (route) => route.fulfill({ json: [] }));
};

/** Starts the test signed in: tokens in localStorage, as after a real login. */
export const signIn = async (page: Page) => {
  await page.addInitScript(
    ({ access, refresh }) => {
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
    },
    { access: authSession.access_token, refresh: authSession.refresh_token }
  );
  await page.route('**/api/v1/auth/me', (route) => route.fulfill({ json: testUser }));
};
