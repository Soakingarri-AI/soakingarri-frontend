import { expect, test } from '@playwright/test';
import { askResponse, sessionDetail } from './fixtures/data.ts';
import { mockApi, signIn } from './helpers/api.ts';

test.beforeEach(async ({ page }) => {
  await mockApi(page);
  await signIn(page);
});

const ask = async (page: import('@playwright/test').Page, prompt: string) => {
  await page.goto('/chat');
  const composer = page.getByPlaceholder('Ask SOAKINGARRI AI');
  await composer.fill(prompt);
  await composer.press('Enter');
};

test('shows the answer with Markdown formatted, not as raw symbols', async ({ page }) => {
  await page.route('**/api/v1/ask', (route) => route.fulfill({ json: askResponse }));
  await page.route(`**/api/v1/ask/sessions/${sessionDetail.id}`, (route) =>
    route.fulfill({ json: sessionDetail })
  );

  const askRequest = page.waitForRequest('**/api/v1/ask');
  await ask(page, "What were Nelson Mandela's works?");

  expect((await askRequest).postDataJSON()).toMatchObject({
    prompt: "What were Nelson Mandela's works?",
    learning_mode: 'normal',
  });
  await expect(page).toHaveURL(`/chat/${sessionDetail.id}`);

  // ### becomes a real heading and ** becomes bold text.
  await expect(page.getByRole('heading', { name: 'Anti-Apartheid Activism' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Legacy' })).toBeVisible();
  await expect(page.locator('strong', { hasText: 'Leadership in the ANC' })).toBeVisible();
  await expect(page.getByRole('listitem')).toHaveCount(4);

  const chat = page.locator('.glass-panel').filter({ hasText: 'Anti-Apartheid Activism' });
  await expect(chat).not.toContainText('###');
  await expect(chat).not.toContainText('**');
});

test('shows an error message when the answer fails', async ({ page }) => {
  await page.route('**/api/v1/ask', (route) =>
    route.fulfill({ status: 500, json: { detail: 'Internal error' } })
  );

  await ask(page, 'Who built Great Zimbabwe?');

  await expect(page.getByText('Who built Great Zimbabwe?')).toBeVisible();
  await expect(
    page.getByText('Something went wrong answering that — please try again.')
  ).toBeVisible();
});

test('shows not-found for a chat that does not exist', async ({ page }) => {
  await page.route('**/api/v1/ask/sessions/missing', (route) =>
    route.fulfill({ status: 404, json: { detail: 'Not found' } })
  );

  await page.goto('/chat/missing');

  await expect(page.getByText("This chat couldn't be found.")).toBeVisible();
  await page.getByRole('button', { name: 'Start a New Chat' }).click();
  await expect(page).toHaveURL('/chat');
});
