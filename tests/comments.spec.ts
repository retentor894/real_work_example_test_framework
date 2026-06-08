import { test, expect } from "../src/fixtures";
import { commentText } from "../src/data/factories";

test.describe("Comments", () => {
  test("CMT-001 a user can post a comment on an article", async ({ article, articlePage }) => {
    const text = commentText();

    await articlePage.goto(article.slug);
    await articlePage.postComment(text);

    await expect(articlePage.comment(text)).toBeVisible();
  });

  test("CMT-002 a user can delete their comment", async ({ article, articlePage }) => {
    const text = commentText();

    await articlePage.goto(article.slug);
    await articlePage.postComment(text);
    await expect(articlePage.comment(text)).toBeVisible();

    await articlePage.deleteComment(text);

    await expect(articlePage.comment(text)).toHaveCount(0);
  });
});
