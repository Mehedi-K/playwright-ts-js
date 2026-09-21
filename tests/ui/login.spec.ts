import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { ProductsPage } from '../../pages/ProductsPage';

test.describe('Login', () => {
  test('valid login navigates a standard user to the products page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);

    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(productsPage.pageTitle).toHaveText('Products');
  });

  test('invalid password shows an error message', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('standard_user', 'wrong_password');

    await loginPage.expectErrorMessage(
      'Username and password do not match any user in this service'
    );
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

  test('locked out user cannot log in', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('locked_out_user', 'secret_sauce');

    await loginPage.expectErrorMessage('Sorry, this user has been locked out.');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

  test('empty credentials show a required-field error', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.loginButton.click();

    await loginPage.expectErrorMessage('Username is required');
  });
});
