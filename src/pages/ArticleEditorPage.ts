import type { Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export interface ArticleInput {
  title: string;
  description: string;
  body: string;
  tagList?: string[];
}

export class ArticleEditorPage extends BasePage {
  // --- selectors ---
  readonly title: Locator = this.page.getByPlaceholder("Article Title");
  readonly description: Locator = this.page.getByPlaceholder("What's this article about?");
  readonly body: Locator = this.page.getByPlaceholder("Write your article (in markdown)");
  readonly tags: Locator = this.page.getByPlaceholder("Enter tags");
  readonly publishButton: Locator = this.page.getByRole("button", { name: "Publish Article" });
  readonly updateButton: Locator = this.page.getByRole("button", { name: "Update Article" });

  // --- actions ---
  async goto(): Promise<void> {
    await this.page.goto("/#/editor"); // app uses hash routing
  }

  /**
   * Fill all fields. The tags field is a plain text input that splits on spaces
   * or commas — pressing Enter would submit the form prematurely, so we don't.
   */
  private async fillForm(data: ArticleInput): Promise<void> {
    await this.title.fill(data.title);
    await this.description.fill(data.description);
    await this.body.fill(data.body);
    if (data.tagList?.length) {
      await this.tags.fill(data.tagList.join(" "));
    }
  }

  async create(data: ArticleInput): Promise<void> {
    await this.fillForm(data);
    await this.publishButton.click();
  }

  async update(data: ArticleInput): Promise<void> {
    await this.title.clear();
    await this.description.clear();
    await this.body.clear();
    await this.fillForm({ ...data, tagList: [] }); // tags already attached on edit
    await this.updateButton.click();
  }
}
