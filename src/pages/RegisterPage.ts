import type { Locator } from "@playwright/test";
import { BasePage } from "./BasePage";
import type { Credentials } from "../api/conduitApi";

export class RegisterPage extends BasePage {
  // --- selectors ---
  readonly username: Locator = this.page.getByPlaceholder("Your Name");
  readonly email: Locator = this.page.getByPlaceholder("Email");
  readonly password: Locator = this.page.getByPlaceholder("Password");
  readonly submitButton: Locator = this.page.getByRole("button", { name: "Sign up" });

  // --- actions ---
  async goto(): Promise<void> {
    await this.page.goto("/#/register"); // app uses hash routing
  }

  async register(user: Credentials): Promise<void> {
    await this.username.fill(user.username);
    await this.email.fill(user.email);
    await this.password.fill(user.password);
    await this.submitButton.click();
  }
}
