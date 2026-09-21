import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { ProductsPage } from '../../pages/ProductsPage';

test.describe('Product sorting', () => {
  let productsPage: ProductsPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);

    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('sorts products by name A to Z (default)', async () => {
    const names = await productsPage.getProductNames();
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  });

  test('sorts products by name Z to A', async () => {
    await productsPage.sortBy('za');

    const names = await productsPage.getProductNames();
    const sorted = [...names].sort((a, b) => b.localeCompare(a));
    expect(names).toEqual(sorted);
  });

  test('sorts products by price low to high', async () => {
    await productsPage.sortBy('lohi');

    const prices = await productsPage.getProductPrices();
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  test('sorts products by price high to low', async () => {
    await productsPage.sortBy('hilo');

    const prices = await productsPage.getProductPrices();
    const sorted = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sorted);
  });
});
