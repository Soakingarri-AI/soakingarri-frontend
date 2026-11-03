import { expect, test } from '@playwright/test';
import { sessionDetail, sessionSummaries } from './fixtures/data.ts';
import { mockApi, signIn } from './helpers/api.ts';

test.beforeEach(async ({ page }) => {
  await mockApi(page);
  await signIn(page);
  await page.route('**/api/v1/ask/sessions', (route) => route.fulfill({ json: sessionSummaries }));
});

// History cards title each chat with a heading; the sidebar's recent list uses
// plain text, so heading lookups only ever match the cards.

test('lists past chats grouped by day and opens one', async ({ page }) => {
  await page.route(`**/api/v1/ask/sessions/${sessionDetail.id}`, (route) =>
    route.fulfill({ json: sessionDetail })
  );

  await page.goto('/history');

  await expect(page.getByText('Today', { exact: true })).toBeVisible();
  await expect(page.getByText('Earlier', { exact: true })).toBeVisible();

  await page.getByRole('heading', { name: 'Nelson Mandela' }).click();

  await expect(page).toHaveURL(`/chat/${sessionDetail.id}`);
  await expect(page.getByRole('heading', { name: 'Anti-Apartheid Activism' })).toBeVisible();
});

test('filters chats by search', async ({ page }) => {
  await page.goto('/history');

  await page.getByPlaceholder('Search History').fill('benin');

  await expect(page.getByRole('heading', { name: 'The Kingdom of Benin' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Nelson Mandela' })).toHaveCount(0);
});
