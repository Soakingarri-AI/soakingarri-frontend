import { expect, test } from '@playwright/test';
import { authSession, testPassword, testUser } from './fixtures/data.ts';
import { mockApi } from './helpers/api.ts';

test.beforeEach(async ({ page }) => {
  await mockApi(page);
});

const fillLogin = async (page: import('@playwright/test').Page) => {
  await page.goto('/login');
  await page.getByPlaceholder('name@example.com').fill(testUser.email);
  await page.getByPlaceholder('••••••••').fill(testPassword);
  await page.getByRole('button', { name: /log in/i }).click();
};

test('logs in and lands on the dashboard', async ({ page }) => {
  await page.route('**/api/v1/auth/login', (route) => route.fulfill({ json: authSession }));

  const loginRequest = page.waitForRequest('**/api/v1/auth/login');
  await fillLogin(page);

  expect((await loginRequest).postDataJSON()).toEqual({
    email: testUser.email,
    password: testPassword,
  });
  await expect(page).toHaveURL('/dashboard');
  expect(await page.evaluate(() => localStorage.getItem('access_token'))).toBe(
    authSession.access_token
  );
});

test('shows an error for a wrong password', async ({ page }) => {
  await page.route('**/api/v1/auth/login', (route) =>
    route.fulfill({ status: 401, json: { detail: 'Invalid credentials' } })
  );

  await fillLogin(page);

  await expect(page.getByText('Incorrect email or password.')).toBeVisible();
  await expect(page).toHaveURL('/login');
});

test('sends unverified accounts to the check-email page', async ({ page }) => {
  await page.route('**/api/v1/auth/login', (route) =>
    route.fulfill({ status: 403, json: { detail: 'Email not verified' } })
  );

  await fillLogin(page);

  await expect(page).toHaveURL(/\/check-email\?email=/);
});

test('sends signed-out visitors back to login', async ({ page }) => {
  await page.route('**/api/v1/auth/me', (route) => route.fulfill({ status: 401, json: {} }));
  await page.route('**/api/v1/auth/refresh', (route) => route.fulfill({ status: 401, json: {} }));

  await page.goto('/dashboard');

  await expect(page).toHaveURL('/login');
});
