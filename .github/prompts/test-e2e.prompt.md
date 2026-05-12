---
name: test-e2e
description: "Use when: run end-to-end tests and automatically debug any failures."
mode: agent
---
You are orchestrating E2E testing for Wyatt's Scooter Adventure using two specialist agents in sequence.

## Step 1 — Run E2E Tests (testing agent)

Invoke the `testing` agent to run the full Playwright E2E suite:

```bash
npm run test:e2e
```

The testing agent should:
- Run all E2E specs and report a pass/fail summary per test.
- Classify failures (flaky, environment, assertion, etc.).
- Collect any `test-results/` artifacts (screenshots, traces, videos).
- Return a clear summary: total tests, passed, failed, skipped.

## Step 2 — Debug Failures (e2e-debug agent, conditional)

**Only if Step 1 reports one or more failures**, immediately invoke the `e2e-debug` agent:

- Pass the failure summary and artifact paths from Step 1.
- The e2e-debug agent will inspect `test-results/`, analyze traces/screenshots, identify root causes, and recommend or apply fixes.
- After fixes are applied, re-run `npm run test:e2e` to confirm the failures are resolved.

## Step 3 — Final Report

After the pipeline completes, output a concise report:

| Metric | Value |
|---|---|
| Total E2E tests | … |
| Passed | … |
| Failed | … |
| Failures debugged | … |
| Fixes applied | … |
| Final status | ✅ All passing / ❌ Still failing |

If tests are still failing after debugging, list the remaining failures with their root cause and recommended next steps.
