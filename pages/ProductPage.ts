import { BasePage } from './BasePage';
import { Page, expect } from '@playwright/test';

export class ProductPage extends BasePage {
  constructor(page: Page) { super(page); }

  // Click "Add to cart" on a product detail page or product tile
  async addToCartFromSearchResult(productName: string) {
    // open product detail by clicking its name link
    const productLink = this.page.locator('a').filter({ hasText: productName }).first();
    await productLink.click();
    // wait product detail loaded
    await this.page.waitForSelector('input[value="Add to cart"]', { state: 'visible' });
    await Promise.all([
      this.page.waitForResponse(resp => resp.url().includes('/addproducttocart') && resp.status() === 200),
      this.page.click('input[value="Add to cart"]')
    ]);
    // wait for cart qty update in top bar (notification)
    //await this.page.waitForTimeout(1000); // small pause to let UI update
  }
}