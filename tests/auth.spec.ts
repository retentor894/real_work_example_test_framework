import { test, expect } from "../src/fixtures";

test.describe("Authentication", () => {
  test("AUTH-001 a new user can register and lands logged in", async ({ credentials, registerPage, navbar }) => {
    await registerPage.goto();
    await registerPage.register(credentials);

    await expect(navbar.userMenu(credentials.username)).toBeVisible();
    await expect(navbar.newArticleLink).toBeVisible();
  });

  test("AUTH-002 a logged-in user can log out", async ({ loggedInUser, navbar, page }) => {
    await page.goto("/");
    await expect(navbar.userMenu(loggedInUser.username)).toBeVisible();

    await navbar.logout(loggedInUser.username);

    await expect(navbar.loginLink).toBeVisible();
    await expect(navbar.signUpLink).toBeVisible();
  });

  test("AUTH-003 a registered user can log in", async ({ registeredUser, loginPage, navbar }) => {
    await loginPage.goto();
    await loginPage.login(registeredUser.email, registeredUser.password);

    await expect(navbar.userMenu(registeredUser.username)).toBeVisible();
  });
});
