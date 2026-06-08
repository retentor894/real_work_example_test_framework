import { test as base } from "@playwright/test";
import { ConduitApi, type Account, type Article, type Credentials } from "./api/conduitApi";
import { articleData, uniqueUser } from "./data/factories";
import { RegisterPage } from "./pages/RegisterPage";
import { LoginPage } from "./pages/LoginPage";
import { Navbar } from "./pages/components/Navbar";
import { ArticleEditorPage } from "./pages/ArticleEditorPage";
import { ArticlePage } from "./pages/ArticlePage";

type Fixtures = {
  // --- data / setup ---
  api: ConduitApi;
  /** Unique, UNREGISTERED credentials (for the register-via-UI flow). */
  credentials: Credentials;
  /** A user registered via API but NOT logged in (for the login-via-UI flow). */
  registeredUser: Account;
  /** A user registered via API whose session is injected → page starts logged in. */
  loggedInUser: Account;
  /** An article created via API by `loggedInUser` (precondition for edit/comments). */
  article: Article;

  // --- page objects ---
  registerPage: RegisterPage;
  loginPage: LoginPage;
  navbar: Navbar;
  editorPage: ArticleEditorPage;
  articlePage: ArticlePage;
};

export const test = base.extend<Fixtures>({
  api: async ({ request }, use) => {
    await use(new ConduitApi(request));
  },

  credentials: async ({}, use) => {
    await use(uniqueUser());
  },

  registeredUser: async ({ api }, use) => {
    await use(await api.register(uniqueUser()));
  },

  // Register via API, then inject the exact localStorage session the frontend
  // uses, so any navigation in this test starts authenticated — no UI login.
  loggedInUser: async ({ api, context }, use) => {
    const account = await api.register(uniqueUser());
    await context.addInitScript((session) => {
      window.localStorage.setItem("loggedUser", JSON.stringify(session));
    }, account.session);
    await use(account);
  },

  article: async ({ api, loggedInUser }, use) => {
    await use(await api.createArticle(loggedInUser.token, articleData()));
  },

  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  navbar: async ({ page }, use) => {
    await use(new Navbar(page));
  },
  editorPage: async ({ page }, use) => {
    await use(new ArticleEditorPage(page));
  },
  articlePage: async ({ page }, use) => {
    await use(new ArticlePage(page));
  },
});

export { expect } from "@playwright/test";
