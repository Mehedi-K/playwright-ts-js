import { type Locator, type Page, expect } from '@playwright/test';

/**
 * Page Object for the cart page (https://www.saucedemo.com/cart.html).
 */
export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly cartItemNames: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.getByTestId('inventory-item');
    this.cartItemNames = page.getByTestId('inventory-item-name');
    this.checkoutButton = page.getByTestId('checkout');
    this.continueShoppingButton = page.getByTestId('continue-shopping');
  }

  async goto() {
    await this.page.goto('/cart.html');
  }

  async getCartItemNames(): Promise<string[]> {
    return this.cartItemNames.allTextContents();
  }

  async expectItemCount(count: number) {
    await expect(this.cartItems).toHaveCount(count);
  }

  removeButton(productName: string): Locator {
    const slug = productName.toLowerCase().replace(/\s+/g, '-');
    return this.page.getByTestId(`remove-${slug}`);
  }

  async removeItem(productName: string) {
    await this.removeButton(productName).click();
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}
