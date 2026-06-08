import type { Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ArticlePage extends BasePage {
  // --- selectors ---
  readonly title: Locator = this.page.locator(".article-page h1");
  readonly deleteArticleButton: Locator = this.page.getByRole("button", { name: "Delete Article" }).first();
  readonly editArticleLink: Locator = this.page.getByRole("link", { name: "Edit Article" }).first();
  readonly commentBox: Locator = this.page.getByPlaceholder("Write a comment...");
  readonly postCommentButton: Locator = this.page.getByRole("button", { name: "Post Comment" });

  // Social buttons (shown when viewing another author's article). Each renders
  // twice (top + bottom); we drive the first. User-facing locators (the button
  // text) rather than Bootstrap classes, so styling changes don't break them.
  // Case-insensitive so the locator still matches after the label flips
  // (Follow→Unfollow, Favorite stays) — the button it points at must survive its
  // own state change for the post-action assertion to work.
  readonly favoriteButton: Locator = this.page.getByRole("button", { name: /favorite/i }).first();
  readonly followButton: Locator = this.page.getByRole("button", { name: /follow/i }).first();

  /** A comment card identified by its text body. */
  comment(text: string): Locator {
    return this.page.locator(".card", { hasText: text });
  }

  // --- actions ---
  async goto(slug: string): Promise<void> {
    await this.page.goto(`/#/article/${slug}`); // app uses hash routing
  }

  async editArticle(): Promise<void> {
    await this.editArticleLink.click();
  }

  /** Deletes the article (accepts the confirm dialog); app redirects home. */
  async deleteArticle(): Promise<void> {
    this.page.once("dialog", (dialog) => dialog.accept());
    await this.deleteArticleButton.click();
  }

  async favorite(): Promise<void> {
    await this.favoriteButton.click();
  }

  async follow(): Promise<void> {
    await this.followButton.click();
  }

  async postComment(text: string): Promise<void> {
    await this.commentBox.fill(text);
    await this.postCommentButton.click();
  }

  /** Deletes a comment by its text. Accepts the native confirm() dialog. */
  async deleteComment(text: string): Promise<void> {
    this.page.once("dialog", (dialog) => dialog.accept());
    // The only button inside a comment card is its (icon-only) delete control.
    await this.comment(text).getByRole("button").click();
  }
}
