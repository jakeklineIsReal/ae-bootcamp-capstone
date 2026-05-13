# 5-Minute Demo: Agentic Workflow for Wyatt's Scooter Adventure

## Narrative Arc

> "This project isn't just a game — it's a showcase of how AI agents collaborate end-to-end in an accelerated engineering workflow. Let me walk you through three acts: a bug comes in, gets diagnosed, and ships to production — all driven by specialized agents."

---

## Timing Guide

| Act | Target |
|-----|--------|
| Intro / project context | 0:30 |
| Act 1 — Issue Intake | 1:30 |
| Act 2 — Deep Debugging | 2:00 |
| Act 3 — Deploy | 1:30 |
| Closing — System View | 0:30 |

---

## Pre-Demo Setup

Before presenting, confirm:

- [ ] GitHub issue is filed (see Act 1 below for the exact text)
- [ ] `main` branch has the buggy commit (`fix: invert jump guard condition`)
- [ ] `test-results/` folder has Playwright artifacts from a known failure (already present)
- [ ] Dev server is ready: `npm run dev` → `http://localhost:3000`

---

## Act 1 — GitHub Issue Intake (~1:30)

**What to show:** The `issue-triage` → `bug-reproduce` pipeline

### The Issue

File this on `jakeklineIsReal/ae-bootcamp-capstone` before the demo (or do it live):

> **Title:** Wyatt can't jump from the ground
>
> **Steps to reproduce:**
> 1. Open the game
> 2. Wait for Wyatt to start riding
> 3. Press spacebar / arrow up to jump
>
> **Expected:** Wyatt jumps off the ground with a sound effect
>
> **Actual:** Nothing happens — Wyatt doesn't jump at all

### The Prompt

In VS Code Copilot chat:

```
@issue-triage #<issue number>
```

### What the agents do

1. **`issue-triage`** fetches the issue via GitHub MCP, classifies it as **BUG** (keyword: "can't"), applies the `triage: bug` label, posts a comment: *"Starting reproduction workflow…"*
2. **`bug-reproduce`** finds the 3 already-failing unit tests in `Player.test.ts`:
   - `provides simple jump action`
   - `jump only works when on ground`
   - `jumping state when jumping`
3. Labels the issue `reproduced` + `needs-fix`, comments the test path back on the issue

### Talking Point

> "The agent reads the issue, classifies it, labels it, comments on it, and surfaces the failing tests — with a single prompt."

---

## Act 2 — TDD Fix (~2:00)

**What to show:** `@tdd` agent doing a Red-Green-Refactor cycle to fix the jump bug from Act 1

### The Prompt

In VS Code Copilot chat (hand off directly from Act 1):

```
@tdd Fix the jump bug. The failing tests are in tests/unit/entities/Player.test.ts
```

### What the agent does

1. **Red phase** — confirms 3 tests are failing: `provides simple jump action`, `jump only works when on ground`, `jumping state when jumping`
2. **Green phase** — identifies the root cause: inverted guard `if (!this.onGround)` in `src/entities/Player.ts`, applies the 1-character fix (`!` removed)
3. Reruns the test suite — all 29 tests green
4. **Refactor phase** — confirms no structural changes needed; fix is minimal and correct

### Talking Point

> "The agent doesn't just guess — it reads the failing assertions, traces them to the exact line, makes the minimal fix, and verifies. Red, Green, done. This is the same discipline a senior engineer would follow, but in seconds."

### The `e2e-debug` Agent (mention, don't demo)

Point to the `test-results/` folder — explain that when a failure produces Playwright artifacts (screenshots, HTML dumps, console logs), the `e2e-debug` agent reads those artifacts to diagnose root causes like black screens, base path mismatches, or canvas failures. The `bug-reproduce` agent hands off to it automatically when needed.

---

## Act 3 — Deploy (~1:30)

**What to show:** `/deploy-checklist` slash command running the full CI/CD pipeline

### The Prompt

In VS Code Copilot chat:

```
/deploy-checklist
```

### What the checklist does (in order)

1. **Unit tests** — Vitest runs all tests; confirms they're green after the fix
2. **E2E tests** — Playwright runs `npm run test:e2e`
3. **Build verification** — `npm run build` (TypeScript + Vite, zero errors)
4. **Push to `main`** — triggers `.github/workflows/deploy.yml` automatically
5. **Poll CI** — `gh run list` until the GitHub Actions workflow shows `completed`
6. **Validate live site** — HTTP 200 check against the Pages URL

### Show Live

- GitHub Actions tab: workflow completing in real time
- Live URL: https://jakeklineisreal.github.io/ae-bootcamp-capstone/

### Talking Point

> "Notice it doesn't just run `npm deploy` — it knows the deployment mechanism is GitHub Actions. It gates on tests, pushes to main, polls CI, and validates the live URL — the whole ship pipeline in one command."

---

## Closing — The System View (~1:00)

Pull back and show the `.github/agents/` directory — 20 named agents.

### The Bug Pipeline

```
GitHub Issue → issue-triage → bug-reproduce → e2e-debug → tdd → /deploy-checklist
```

### The Feature Pipeline

```
Feature request → issue-triage → speckit.specify → speckit.plan → speckit.tasks → speckit.implement → /deploy-checklist
```

### Closing Line

> "Each agent is a specialist. The user types one command and the system routes, reproduces, fixes, and ships — with constitutional guardrails baked in at every step."
