import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { ProductsPage } from '../../pages/ProductsPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';

test.describe('Checkout', () => {
  let productsPage: ProductsPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('completes a full end-to-end checkout for a single item', async ({ page }) => {
    await productsPage.addProductToCart('Sauce Labs Backpack');
    await productsPage.goToCart();
    await cartPage.expectItemCount(1);

    await cartPage.checkout();
    await expect(page).toHaveURL(/checkout-step-one\.html/);

    await checkoutPage.fillInformation('John', 'Doe', '12345');
    await checkoutPage.continueToOverview();
    await expect(page).toHaveURL(/checkout-step-two\.html/);

    await expect(checkoutPage.summaryItems).toHaveCount(1);
    await expect(checkoutPage.totalLabel).toContainText('Total:');

    await checkoutPage.finish();
    await expect(page).toHaveURL(/checkout-complete\.html/);
    await checkoutPage.expectOrderComplete();
  });

  test('completes checkout for multiple items and totals reflect subtotal + tax', async ({
    page,
  }) => {
    await productsPage.addProductToCart('Sauce Labs Backpack');
    await productsPage.addProductToCart('Sauce Labs Bike Light');
    await productsPage.goToCart();
    await cartPage.checkout();

    await checkoutPage.fillInformation('Jane', 'Smith', '94107');
    await checkoutPage.continueToOverview();

    await expect(checkoutPage.summaryItems).toHaveCount(2);

    const subtotalText = await checkoutPage.subtotalLabel.textContent();
    const taxText = await checkoutPage.taxLabel.textContent();
    const totalText = await checkoutPage.totalLabel.textContent();

    const subtotal = parseFloat(subtotalText!.replace(/[^0-9.]/g, ''));
    const tax = parseFloat(taxText!.replace(/[^0-9.]/g, ''));
    const total = parseFloat(totalText!.replace(/[^0-9.]/g, ''));

    expect(total).toBeCloseTo(subtotal + tax, 2);

    await checkoutPage.finish();
    await expect(page).toHaveURL(/checkout-complete\.html/);
    await checkoutPage.expectOrderComplete();
  });

  test('requires first name, last name and postal code before continuing', async ({ page }) => {
    await productsPage.addProductToCart('Sauce Labs Backpack');
    await productsPage.goToCart();
    await cartPage.checkout();

    await checkoutPage.continueToOverview();

    await checkoutPage.expectErrorMessage('First Name is required');
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });

  test('back-to-products button returns to the inventory page after an order', async ({
    page,
  }) => {
    await productsPage.addProductToCart('Sauce Labs Backpack');
    await productsPage.goToCart();
    await cartPage.checkout();
    await checkoutPage.fillInformation('John', 'Doe', '12345');
    await checkoutPage.continueToOverview();
    await checkoutPage.finish();
    await checkoutPage.expectOrderComplete();

    await checkoutPage.backHomeButton.click();
    await expect(page).toHaveURL(/inventory\.html/);
    await productsPage.expectCartBadgeHidden();
  });
});
