import type { Page } from "@playwright/test";

/** Base for full-page objects: holds the Playwright `page`. */
export abstract class BasePage {
  constructor(protected readonly page: Page) {}
}
