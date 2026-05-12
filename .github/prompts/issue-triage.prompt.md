---
name: issue-triage
description: "Use when: routing a GitHub issue through the correct pipeline. Bugs get a reproduction E2E test. Features get speced out and added to the backlog."
mode: agent
---

# Issue Triage Workflow

You are orchestrating the intake pipeline for GitHub issues reported against Wyatt's Scooter Adventure.

## Usage

Invoke with an issue number or URL:
```
/issue-triage #42
/issue-triage https://github.com/jakeklineIsReal/ae-bootcamp-capstone/issues/42
```

---

## Step 1 — Triage & Classify (issue-triage agent)

Invoke the `issue-triage` agent with the issue number/URL:

The agent will:
- Fetch the issue from GitHub
- Classify as **BUG** or **FEATURE** (or ask for clarification if unclear)
- Apply triage labels
- Post an acknowledgment comment on the issue
- Return: classification, issue title/body, priority tier (features), and any constitutional flags

---

## Step 2A — Bug Path: Reproduce (bug-reproduce agent)

**Only if Step 1 returns classification = BUG**, invoke the `bug-reproduce` agent with:
- Issue number
- Issue title and full body
- Repository: `jakeklineIsReal/ae-bootcamp-capstone`

The agent will:
1. Parse steps to reproduce from the issue
2. Write a failing Playwright E2E test in `e2e/bugs/issue-<number>-<slug>.spec.ts`
3. Run `npm run test:e2e` to confirm the test fails as expected
4. Label the issue `reproduced` + `needs-fix`
5. Comment on the issue with the test file path

**If the reproduction test encounters complex failures**, the bug-reproduce agent will invoke `e2e-debug` automatically.

**After confirmed reproduction**, offer the user:
- `Fix now` → invoke `tdd` agent with the failing test path
- `Leave in backlog` → stop here; the issue is labeled and test committed

---

## Step 2B — Feature Path: Spec & Backlog (speckit pipeline)

**Only if Step 1 returns classification = FEATURE**, invoke the spec pipeline in sequence:

### 2B.1 — Specify
Invoke `speckit.specify` with the issue title + body as the feature description.

The agent will create `specs/<feature-slug>/spec.md`.

### 2B.2 — Plan
Invoke `speckit.plan` to generate the technical design and `plan.md`.

### 2B.3 — Tasks
Invoke `speckit.tasks` to generate `tasks.md` with dependency-ordered implementation tasks.

### 2B.4 — Backlog Issues
Invoke `speckit.taskstoissues` to convert tasks into individual GitHub issues.

The original feature request issue will be linked/referenced in each created task issue.

---

## Step 3 — Final Report

After the pipeline completes, output:

| Field | Value |
|---|---|
| Issue | #<number> — <title> |
| Classification | BUG / FEATURE |
| Labels applied | ... |
| Pipeline | bug-reproduce / speckit |
| Outcome | ✅ Reproduced / ✅ Speced / ⚠️ Unclear |
| Next action | Fix (tdd agent) / Review spec / Needs more info |

---

## Constitutional Guardrail

If at any point the `issue-triage` agent flags a **constitutional violation** on a feature request:
- Stop the feature pipeline immediately
- Do not invoke `speckit.specify`
- Report the violation to the user with the specific principle(s) that would be broken
- Suggest a compliant alternative if one exists

The five constitutional principles that must never be violated:
1. **Age-First Design** — max 2 buttons, no reading required, large visuals
2. **Safety-First** — helmet always visible, no unsafe behaviors
3. **No Failure States** — player cannot lose, no game over
4. **Accessibility-First** — audio cues required, distinct shapes not just colors
5. **Personal Connection** — Wyatt's character and his friends (Nico, Marcus, Otto)
