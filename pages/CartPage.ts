import { BasePage } from './BasePage';
import { Page, expect } from '@playwright/test';

export class CartPage extends BasePage {
  readonly cartTable = 'table.cart';
  readonly cartRows = 'table.cart tbody tr';
  readonly qtyInputs = 'input.qty-input';
  readonly checkoutBtn = 'button[name="checkout"]';
  readonly notificationBar = '.cart-qty';

  constructor(page: Page) { super(page); }

  async openCart() {
    await this.goto('/cart');
    await this.page.waitForSelector(this.cartTable);
  }

  async getCartCount(): Promise<number> {
    const text = await this.page.locator(this.notificationBar).innerText();
    const match = text.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }

  async verifyProductPresent(productName: string) {
    const productRow = this.page.locator(this.cartRows).filter({ has: this.page.locator(`a:has-text("${productName}")`) });
    const count = await productRow.count();
    if (count === 0) {
      throw new Error(`Product "${productName}" not found in cart — expected it to be present.`);
    }
  }

  // Agree to terms and conditions checkbox (id="termsofservice")
  async agreeToTerms() {
    const terms = this.page.locator('#termsofservice');
    // wait until the checkbox is visible on the page
    await terms.waitFor({ state: 'visible' });
    // if not already checked, check it using Playwright's safe .check()
    const isChecked = await terms.isChecked().catch(() => false);
    if (!isChecked) {
      await terms.check();
    }
    // assert it's checked
    await expect(terms).toBeChecked();
  }

  async proceedToCheckout() {
    await this.page.locator(this.checkoutBtn).click();
    await this.page.waitForLoadState('networkidle');
  }
}
