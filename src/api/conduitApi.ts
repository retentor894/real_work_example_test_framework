import type { APIRequestContext } from "@playwright/test";

/**
 * Thin Conduit API client used ONLY for fast test-data setup (registering a user,
 * creating an article). It mirrors what the UI does under the hood, so a test can
 * arrange its preconditions in one call instead of clicking through them.
 *
 * UI behaviour is always exercised through the page objects, never here.
 */
const API_URL = process.env.API_URL ?? "http://localhost:3001/api";

export interface Credentials {
  username: string;
  email: string;
  password: string;
}

export interface Account extends Credentials {
  token: string;
  /** Exact object the frontend persists in localStorage["loggedUser"]. */
  session: {
    headers: { Authorization: string };
    isAuth: true;
    loggedUser: Record<string, unknown>;
  };
}

export interface Article {
  slug: string;
  title: string;
  description: string;
  body: string;
}

export class ConduitApi {
  constructor(private readonly request: APIRequestContext) {}

  async register(creds: Credentials): Promise<Account> {
    const res = await this.request.post(`${API_URL}/users`, { data: { user: creds } });
    if (!res.ok()) throw new Error(`register failed: ${res.status()} ${await res.text()}`);
    const { user } = await res.json();
    return {
      ...creds,
      token: user.token,
      session: {
        headers: { Authorization: `Token ${user.token}` },
        isAuth: true,
        loggedUser: user,
      },
    };
  }

  async createArticle(
    token: string,
    article: { title: string; description: string; body: string; tagList?: string[] },
  ): Promise<Article> {
    const res = await this.request.post(`${API_URL}/articles`, {
      headers: { Authorization: `Token ${token}` },
      data: { article },
    });
    if (!res.ok()) throw new Error(`createArticle failed: ${res.status()} ${await res.text()}`);
    const { article: created } = await res.json();
    return created;
  }
}
