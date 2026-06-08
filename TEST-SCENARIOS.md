# E2E Test Scenarios — Conduit (RealWorld)

Four user flows, 10 scenarios. Each ID maps 1:1 to a test in `tests/`.

## Authentication — `tests/auth.spec.ts`

| ID | Scenario | Precondition | Steps (UI) | Expected result |
|----|----------|--------------|------------|-----------------|
| AUTH-001 | Register a new user | Unique, unregistered credentials | Go to Register → fill name/email/password → submit | Lands logged in: navbar shows the username and "New Article" |
| AUTH-002 | Log out | Logged-in user | Open user menu → Logout | Navbar shows "Login" and "Sign up" |
| AUTH-003 | Log in | User already registered (via API) | Go to Login → fill email/password → submit | Lands logged in: navbar shows the username |

## Article lifecycle — `tests/articles.spec.ts`

| ID | Scenario | Precondition | Steps (UI) | Expected result |
|----|----------|--------------|------------|-----------------|
| ART-001 | Create an article | Logged-in user | New Article → fill title/description/body/tags → Publish | Redirected to the article; title matches |
| ART-002 | Edit an article | Existing article owned by the user | Open article → Edit → change fields → Update | Article shows the updated title |
| ART-003 | Delete an article | Existing article owned by the user | Open article → Delete (confirm) | Redirected away; the article no longer exists |

## Comments — `tests/comments.spec.ts`

| ID | Scenario | Precondition | Steps (UI) | Expected result |
|----|----------|--------------|------------|-----------------|
| CMT-001 | Post a comment | Logged-in user + existing article | Open article → write comment → Post Comment | The comment appears in the list |
| CMT-002 | Delete a comment | A comment the user just posted | Delete the comment (confirm) | The comment disappears from the list |

## Social: favorite & follow — `tests/social.spec.ts`

| ID | Scenario | Precondition | Steps (UI) | Expected result |
|----|----------|--------------|------------|-----------------|
| SOC-001 | Favorite an article | Logged-in user + an article by another author | Open the article → click Favorite | Favorites count goes 0 → 1; button becomes active |
| SOC-002 | Follow an author | Logged-in user + an article by another author | Open the article → click Follow | Button switches from "Follow" to "Unfollow" |
