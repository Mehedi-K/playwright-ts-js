import { type Locator, type Page, expect } from '@playwright/test';

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

/**
 * Page Object for the inventory / products page (https://www.saucedemo.com/inventory.html).
 */
export class ProductsPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly sortDropdown: Locator;
  readonly inventoryItems: Locator;
  readonly inventoryItemNames: Locator;
  readonly inventoryItemPrices: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.getByTestId('title');
    this.sortDropdown = page.getByTestId('product-sort-container');
    this.inventoryItems = page.getByTestId('inventory-item');
    this.inventoryItemNames = page.getByTestId('inventory-item-name');
    this.inventoryItemPrices = page.getByTestId('inventory-item-price');
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
  }

  async goto() {
    await this.page.goto('/inventory.html');
  }

  /** Converts a product name into the slug used in saucedemo's data-test attributes. */
  private static toSlug(productName: string): string {
    return productName.toLowerCase().replace(/\s+/g, '-');
  }

  addToCartButton(productName: string): Locator {
    return this.page.getByTestId(`add-to-cart-${ProductsPage.toSlug(productName)}`);
  }

  removeFromCartButton(productName: string): Locator {
    return this.page.getByTestId(`remove-${ProductsPage.toSlug(productName)}`);
  }

  async addProductToCart(productName: string) {
    await this.addToCartButton(productName).click();
  }

  async removeProductFromCart(productName: string) {
    await this.removeFromCartButton(productName).click();
  }

  async sortBy(option: SortOption) {
    await this.sortDropdown.selectOption(option);
  }

  async getProductNames(): Promise<string[]> {
    return this.inventoryItemNames.allTextContents();
  }

  async getProductPrices(): Promise<number[]> {
    const texts = await this.inventoryItemPrices.allTextContents();
    return texts.map((t) => parseFloat(t.replace('$', '')));
  }

  async goToCart() {
    await this.cartLink.click();
  }

  async expectCartBadgeCount(count: number) {
    await expect(this.cartBadge).toHaveText(String(count));
  }

  async expectCartBadgeHidden() {
    await expect(this.cartBadge).toHaveCount(0);
  }
}
