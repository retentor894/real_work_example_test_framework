import type { Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class LoginPage extends BasePage {
  // --- selectors ---
  readonly email: Locator = this.page.getByPlaceholder("Email");
  readonly password: Locator = this.page.getByPlaceholder("Password");
  readonly submitButton: Locator = this.page.getByRole("button", { name: "Login" });

  // --- actions ---
  async goto(): Promise<void> {
    await this.page.goto("/#/login"); // app uses hash routing
  }

  async login(email: string, password: string): Promise<void> {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.submitButton.click();
  }
}
