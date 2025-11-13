import { BasePage } from './BasePage';
import { Page, expect } from '@playwright/test';

export class CheckoutPage extends BasePage {
  // selectors for checkout steps (simplified for demo webshop)
  readonly billingContinue = '#billing-buttons-container input.button-1.new-address-next-step-button';
  readonly shippingContinue = '#shipping-buttons-container input.button-1';
  readonly shippingMethodContinue = '#shipping-method-buttons-container input.button-1';
  readonly paymentMethodContinue = '#payment-method-buttons-container input.button-1';
  readonly paymentInfoContinue = '#payment-info-buttons-container input.button-1';
  readonly confirmOrderButton = '#confirm-order-buttons-container input.button-1';
  readonly orderSuccess = '.section .title';

  constructor(page: Page) { super(page); }

  async fillBillingAddress(billing: any) {
    // If demo site requires new address, click continue with defaults; else fill required fields
    // Attempt to detect address form presence
    const firstNameExists = await this.page.locator('#BillingNewAddress_FirstName').count();
    if (firstNameExists) {
      await this.page.fill('#BillingNewAddress_FirstName', billing.firstName);
      await this.page.fill('#BillingNewAddress_LastName', billing.lastName);
      await this.page.fill('#BillingNewAddress_Email', billing.email);
      await this.page.selectOption('#BillingNewAddress_CountryId', { label: billing.country });
      await this.page.fill('#BillingNewAddress_City', billing.city);
      await this.page.fill('#BillingNewAddress_Address1', billing.address1);
      await this.page.fill('#BillingNewAddress_ZipPostalCode', billing.zip);
      await this.page.fill('#BillingNewAddress_PhoneNumber', billing.phone);
    }
    await Promise.all([
      this.page.waitForLoadState('networkidle'),
      this.page.click(this.billingContinue)
    ]);
  }

  async completeRemainingSteps() {
    // The store uses a series of continue buttons. Click them sequentially with waits.
    const continueButtons = [
      this.billingContinue,
      this.shippingContinue,
      this.shippingMethodContinue,
      this.paymentMethodContinue,
      this.paymentInfoContinue
    ];
    for (const btn of continueButtons) {
      // wait and click
      await this.page.waitForSelector(btn, { state: 'visible', timeout: 7_000 });
      await Promise.all([
        this.page.waitForLoadState('networkidle'),
        this.page.click(btn)
      ]);
    }

    // confirm order
    await this.page.waitForSelector(this.confirmOrderButton, { state: 'visible' });
    await Promise.all([
      this.page.waitForResponse(resp => resp.url().includes('/checkout') && resp.status() === 200),
      this.page.click(this.confirmOrderButton)
    ]);
  }

  async assertOrderSuccess() {
    // The demo site shows "Your order has been successfully processed!" as confirmation text
    await this.page.waitForSelector(this.orderSuccess, { timeout: 10_000 });
    const text = await this.page.locator('.section').innerText();
    if (!/successfully processed/i.test(text)) {
      throw new Error(`Checkout did not return success message. Page text: ${text}`);
    }
  }
}
