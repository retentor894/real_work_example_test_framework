import { test, expect } from "../src/fixtures";
import { articleData } from "../src/data/factories";

test.describe("Article lifecycle", () => {
  test("ART-001 a user can create an article", async ({ loggedInUser, editorPage, articlePage }) => {
    const data = articleData();

    await editorPage.goto();
    await editorPage.create(data);

    // App redirects to /article/:slug on success.
    await expect(articlePage.title).toHaveText(data.title);
  });

  test("ART-002 a user can edit their article", async ({ article, articlePage, editorPage }) => {
    const updated = articleData();

    await articlePage.goto(article.slug);
    await articlePage.editArticle();
    await editorPage.update(updated);

    await expect(articlePage.title).toHaveText(updated.title);
  });

  test("ART-003 a user can delete their article", async ({ article, articlePage, page }) => {
    await articlePage.goto(article.slug);
    await articlePage.deleteArticle();

    // Redirected away from the article, and it no longer exists.
    await expect(page).not.toHaveURL(new RegExp(`/article/${article.slug}`));
    await articlePage.goto(article.slug);
    await expect(articlePage.title).toHaveCount(0);
  });
});
