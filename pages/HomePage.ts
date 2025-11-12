import { BasePage } from './BasePage';
import { Page } from '@playwright/test';

export class HomePage extends BasePage {
  readonly loginLink = 'a[href="/login"]';
  readonly searchInput = '#small-searchterms';
  readonly searchButton = 'input[type="submit"][value="Search"]';
  readonly productCards = '.product-item';

  constructor(page: Page) { super(page); }

  async goToLogin() {
    await this.click(this.loginLink);
  }

  async searchProduct(productName: string) {
    await this.page.fill(this.searchInput, productName);
    await this.page.click(this.searchButton);
    await this.page.waitForLoadState('networkidle');
  }

  productLocatorByName(name: string) {
    // product tile where title = name
    return this.page.locator(this.productCards).filter({ has: this.page.locator(`a:has-text("${name}")`) });
  }
}