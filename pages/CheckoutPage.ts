import { type Locator, type Page, expect } from '@playwright/test';

/**
 * Page Object covering the full checkout flow:
 *   checkout-step-one.html (info form) ->
 *   checkout-step-two.html (overview)  ->
 *   checkout-complete.html (confirmation)
 */
export class CheckoutPage {
  readonly page: Page;

  // Step one - customer information
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;

  // Step two - overview
  readonly finishButton: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly summaryItems: Locator;

  // Complete
  readonly completeHeader: Locator;
  readonly completeText: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.firstNameInput = page.getByTestId('firstName');
    this.lastNameInput = page.getByTestId('lastName');
    this.postalCodeInput = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.cancelButton = page.getByTestId('cancel');
    this.errorMessage = page.getByTestId('error');

    this.finishButton = page.getByTestId('finish');
    this.subtotalLabel = page.getByTestId('subtotal-label');
    this.taxLabel = page.getByTestId('tax-label');
    this.totalLabel = page.getByTestId('total-label');
    this.summaryItems = page.getByTestId('inventory-item');

    this.completeHeader = page.getByTestId('complete-header');
    this.completeText = page.getByTestId('complete-text');
    this.backHomeButton = page.getByTestId('back-to-products');
  }

  async fillInformation(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continueToOverview() {
    await this.continueButton.click();
  }

  async finish() {
    await this.finishButton.click();
  }

  async expectOrderComplete() {
    await expect(this.completeHeader).toHaveText('Thank you for your order!');
  }

  async expectErrorMessage(message: string) {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(message);
  }
}
