# Conduit (RealWorld) — E2E Test Suite (Part 2)

End-to-end tests for the [Conduit RealWorld app](https://github.com/TonyMckes/conduit-realworld-example-app),
built with **Playwright** using the **Page Object Model**. Four user flows, 10
scenarios — see [`TEST-SCENARIOS.md`](./TEST-SCENARIOS.md).

## Requirements

- Node.js ≥ 18
- A running Conduit instance (local or the live demo) — this suite does **not**
  start the app.

## Run

Install once (downloads the Chromium browser):

```bash
npm install
npx playwright install chromium
```

**Against a local app — the reliable path for a full green run** (frontend on
`:3000`, backend on `:3001`; see the mock repo's `SETUP-GUIDE.md` to start Conduit):

```bash
npm test
npm run test:ui     # interactive runner
npm run report      # open the HTML report
```

**Against any environment** — point with a single variable; the API base is derived
as `<BASE_URL>/api` (overridable with `API_URL`):

```bash
BASE_URL=https://your-host npm test
```

- `BASE_URL` — the frontend (Playwright `baseURL`); also derives the API base.
- `API_URL` — override only if the backend is on a different origin (e.g. the local
  `:3000`/`:3001` split, which is the default).

> ⚠️ **The public live demo is heavily rate-limited.** It throttles registration to
> roughly **5 requests/hour** (HTTP 429, `Retry-After` up to ~1h). Because the suite
> self-registers its own users (~13 registrations), it **cannot complete against the
> demo** — a few tests pass, then the rest 429. The `npm run test:demo` script exists
> for a quick partial smoke or for your own (un-throttled) deployment, but use a
> **local instance for a full run**.

## Structure (Page Object Model)

```
e2e-tests/
├── src/
│   ├── pages/                  # SELECTORS + ACTIONS, one object per page
│   │   ├── BasePage.ts
│   │   ├── RegisterPage.ts
│   │   ├── LoginPage.ts
│   │   ├── ArticleEditorPage.ts
│   │   ├── ArticlePage.ts
│   │   └── components/Navbar.ts   # cross-page component object
│   ├── api/conduitApi.ts       # thin API client — ONLY for setup (register, create article)
│   ├── data/factories.ts       # unique, self-contained test data
│   └── fixtures.ts             # Playwright fixtures: users, session, page objects
└── tests/                      # one spec per flow — only LOGIC + assertions
```

**Separation of concerns** (so a test reads without knowing the framework):
- **Selectors + actions** live in the page objects (`src/pages`).
- **Test data** lives in `src/data/factories.ts`.
- **Setup** (register a user, create an article) goes through `src/api` + fixtures.
- **Assertions and flow** live in the `*.spec.ts` files — nothing else.

A test reads as plain intent, e.g.:

```ts
await registerPage.goto();
await registerPage.register(credentials);
await expect(navbar.userMenu(credentials.username)).toBeVisible();
```

## Key design decisions

- **Arrange via API, act/assert via UI.** The Auth flow is exercised entirely
  through the UI (that's the point). Flows that merely *require* a logged-in user
  (articles, comments) get their user — and any prerequisite article — created via
  the API and the session injected, so each test focuses on its own behaviour
  instead of re-driving login through the UI every time.
- **Session injection.** The app stores auth in `localStorage["loggedUser"]`. The
  `loggedInUser` fixture registers via API and injects that exact object with
  `context.addInitScript`, so the page starts authenticated.
- **Self-contained & parallel-safe.** Every test creates its **own unique user**
  (and its own articles/comments). No shared state, no fixed accounts, safe to run
  in parallel — and against the shared live demo, where tests own their data.

## Coverage rationale

**What I focused on, and why.** I picked the flows that carry the most user value
and risk: **authentication** (gates everything), the **article lifecycle** (full
create→edit→delete, the core domain), **comments** (a nested, auth-gated CRUD), and
the **social** interactions (favorite an article, follow an author — the
relationship/state toggles the app is built around). Together they cover the
primary read/write paths a real user takes.

**What I left out, and why.** Profile/settings editing — lower-risk and mostly a
repeat of the same form patterns; I'd add it next using the existing page objects.
No visual or accessibility testing (out of scope per the brief), and no exhaustive
form-validation matrix (better suited to API-level tests).

**Assumptions.** The app is reachable at `BASE_URL`/`API_URL`; registration via
the API hashes passwords correctly (the UI flow relies on it). Tests don't depend
on any pre-seeded data.

## App quirks discovered (worth knowing)

- **Hash routing** — routes are `/#/register`, `/#/article/:slug`, etc. Page
  objects navigate accordingly.
- **Native confirm dialogs** — deleting an article or a comment triggers
  `window.confirm`; the page objects accept the dialog before clicking.
- **Seeded users can't log in** — the DB seeders bypass the password-hashing hook,
  so their passwords are stored in plaintext. Another reason tests self-register.
- **Backend race on tag creation** — creating several articles in parallel that
  share a *brand-new* tag makes the losing requests fail with `500 "Validation
  error"` (the tag's unique constraint isn't handled under concurrency). Reproduced
  with 6 concurrent creates → 5×500, 1×201. The suite sidesteps it by giving each
  article a **unique tag** (`src/data/factories.ts`); worth flagging as a real bug.
