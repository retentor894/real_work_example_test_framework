import type { Locator, Page } from "@playwright/test";

/**
 * The top navigation bar. A component object (not a page) — it's present on every
 * page, so it takes a `page` and exposes the auth-related controls.
 */
export class Navbar {
  constructor(private readonly page: Page) {}

  // --- selectors ---
  readonly newArticleLink: Locator = this.page.getByRole("link", { name: "New Article" });
  readonly loginLink: Locator = this.page.getByRole("link", { name: "Login" });
  readonly signUpLink: Locator = this.page.getByRole("link", { name: "Sign up" });

  /** The dropdown toggle shows the logged-in user's name. */
  userMenu(username: string): Locator {
    return this.page.locator(".dropdown-toggle", { hasText: username });
  }

  // --- actions ---
  async openUserMenu(username: string): Promise<void> {
    await this.userMenu(username).click();
  }

  async logout(username: string): Promise<void> {
    await this.openUserMenu(username);
    await this.page.getByRole("link", { name: "Logout" }).click();
  }

  async gotoNewArticle(): Promise<void> {
    await this.newArticleLink.click();
  }
}
