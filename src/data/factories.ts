import type { Credentials } from "../api/conduitApi";

/**
 * Data factories. Every value is unique per call so tests are self-contained and
 * safe to run in parallel against a shared environment (e.g. the live demo) —
 * each test owns the data it creates and scopes its assertions to it.
 */
let seq = 0;
function uid(): string {
  seq += 1;
  return `${Date.now().toString(36)}${seq.toString(36)}${Math.floor(Math.random() * 1e6).toString(36)}`;
}

export function uniqueUser(): Credentials {
  const id = uid();
  return { username: `qa_${id}`, email: `qa_${id}@example.com`, password: "Test1234!" };
}

export function articleData(overrides: Partial<{ title: string; description: string; body: string; tagList: string[] }> = {}) {
  const id = uid();
  return {
    title: `QA Article ${id}`,
    description: `Automated E2E article ${id}`,
    body: `Body of the automated article ${id}.`,
    // Unique per article on purpose: the backend has a race creating a brand-new
    // *shared* tag concurrently (it returns 500 on the losing requests). A unique
    // tag means no two parallel creates ever race to create the same new tag.
    tagList: [`qa-e2e-${id}`],
    ...overrides,
  };
}

export function commentText(): string {
  return `QA comment ${uid()}`;
}
