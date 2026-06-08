import { test, expect } from "../src/fixtures";

/**
 * Favorite/follow controls only appear when viewing *another* user's article,
 * so these tests act as `loggedInUser` against `othersArticle` (a different author).
 */
test.describe("Social — favorite & follow", () => {
  test("SOC-001 a user can favorite an article", async ({ loggedInUser, othersArticle, articlePage }) => {
    await articlePage.goto(othersArticle.article.slug);
    await expect(articlePage.favoriteButton).toContainText("( 0 )");

    await articlePage.favorite();

    await expect(articlePage.favoriteButton).toContainText("( 1 )");
    await expect(articlePage.favoriteButton).toHaveClass(/active/);
  });

  test("SOC-002 a user can follow an author", async ({ loggedInUser, othersArticle, articlePage }) => {
    await articlePage.goto(othersArticle.article.slug);
    await expect(articlePage.followButton).toContainText("Follow");

    await articlePage.follow();

    await expect(articlePage.followButton).toContainText("Unfollow");
  });
});
