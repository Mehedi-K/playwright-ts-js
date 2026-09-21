import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { ProductsPage } from '../../pages/ProductsPage';
import { CartPage } from '../../pages/CartPage';

test.describe('Cart', () => {
  let productsPage: ProductsPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);

    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('adding a product updates the cart badge', async () => {
    await productsPage.addProductToCart('Sauce Labs Backpack');
    await productsPage.expectCartBadgeCount(1);
  });

  test('adding multiple products accumulates the cart badge count', async () => {
    await productsPage.addProductToCart('Sauce Labs Backpack');
    await productsPage.addProductToCart('Sauce Labs Bike Light');
    await productsPage.addProductToCart('Sauce Labs Bolt T-Shirt');

    await productsPage.expectCartBadgeCount(3);
  });

  test('removing a product from the products page updates the badge', async () => {
    await productsPage.addProductToCart('Sauce Labs Backpack');
    await productsPage.expectCartBadgeCount(1);

    await productsPage.removeProductFromCart('Sauce Labs Backpack');
    await productsPage.expectCartBadgeHidden();
  });

  test('cart page lists the products that were added', async () => {
    await productsPage.addProductToCart('Sauce Labs Backpack');
    await productsPage.addProductToCart('Sauce Labs Bike Light');

    await productsPage.goToCart();

    await cartPage.expectItemCount(2);
    const names = await cartPage.getCartItemNames();
    expect(names).toContain('Sauce Labs Backpack');
    expect(names).toContain('Sauce Labs Bike Light');
  });

  test('removing a product from the cart page removes it from the list', async () => {
    await productsPage.addProductToCart('Sauce Labs Backpack');
    await productsPage.addProductToCart('Sauce Labs Bike Light');
    await productsPage.goToCart();

    await cartPage.removeItem('Sauce Labs Backpack');

    await cartPage.expectItemCount(1);
    const names = await cartPage.getCartItemNames();
    expect(names).not.toContain('Sauce Labs Backpack');
  });
});
