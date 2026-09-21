// @ts-check
// Plain JavaScript Playwright specs.
//
// Playwright Test runs .ts and .js spec files side by side out of the box,
// so this file demonstrates the same saucedemo.com flows as the TypeScript
// suite, written without any TypeScript types or the Page Object classes.

const { test, expect } = require('@playwright/test');

test.describe('Smoke tests (plain JS)', () => {
  test('home page loads with the expected title and login form', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle('Swag Labs');
    await expect(page.getByTestId('login-container')).toBeVisible();
    await expect(page.getByTestId('username')).toBeVisible();
    await expect(page.getByTestId('password')).toBeVisible();
    await expect(page.getByTestId('login-button')).toBeVisible();
  });

  test('standard user can log in and see the products page', async ({ page }) => {
    await page.goto('/');

    await page.getByTestId('username').fill('standard_user');
    await page.getByTestId('password').fill('secret_sauce');
    await page.getByTestId('login-button').click();

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.getByTestId('title')).toHaveText('Products');
    await expect(page.getByTestId('inventory-item')).toHaveCount(6);
  });

  test('navigating to the cart and back keeps the user logged in', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('username').fill('standard_user');
    await page.getByTestId('password').fill('secret_sauce');
    await page.getByTestId('login-button').click();

    await page.getByTestId('shopping-cart-link').click();
    await expect(page).toHaveURL(/cart\.html/);

    await page.getByTestId('continue-shopping').click();
    await expect(page).toHaveURL(/inventory\.html/);
  });
});
