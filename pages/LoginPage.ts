import { BasePage } from "./BasePage";
import { Page, expect } from '@playwright/test';

export class LoginPage extends BasePage{
  readonly email = '#Email';
  readonly password = '#Password';
  readonly loginBtn = 'input[value="Log in"]';
  readonly logoutLink = 'a[href="/logout"]';

  constructor(page: Page) { super(page); }

  async login(email: string, password: string) {
    await this.page.fill(this.email, email);
    await this.page.fill(this.password, password);
    await Promise.all([
      this.page.waitForResponse(resp => resp.url().includes('/login') || resp.status() === 200),
      this.page.click(this.loginBtn)
    ]);
    // confirm logged in by presence of logout
    await expect(this.page.locator(this.logoutLink)).toBeVisible({ timeout: 5000 });
  }
}

