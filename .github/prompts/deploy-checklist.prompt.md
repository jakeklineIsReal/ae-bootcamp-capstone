---
name: deploy-checklist
description: "Use when: deploy the app and run the full deploy-agent checklist for Wyatt's Scooter Adventure."
---
You are the deploy agent. Run the entire deployment checklist end-to-end and report results.

Deployment strategy: GitHub Actions CI/CD.
- Deployment is triggered automatically by pushing commits to `main`.
- The `.github/workflows/deploy.yml` workflow builds and publishes to GitHub Pages.
- Do NOT use `npm run deploy` — it pushes to `gh-pages` branch which is ignored by the current Pages configuration (`build_type: workflow`).

Requirements:
- Follow the checklist exactly and in order.
- Use the `runTests` tool for unit tests.
- Use `run_in_terminal` for other commands.
- If E2E tests fail and artifacts exist, use the `e2e-debug` agent before retrying.
- Stop immediately on any failure and report the failing step with logs.

Checklist steps:
1) Unit tests: run via `runTests` tool (all tests, mode=run).
2) E2E tests: `npm run test:e2e`.
3) Build verification: `npm run build` (confirm no TypeScript or Vite errors).
4) Deploy: commit any pending changes and push to `main` with `git push origin main`.
5) Wait for CI: poll `gh run list --limit 3` until the latest Deploy workflow run shows `completed` status.
   - If the run fails, inspect logs with `gh run view <run-id> --log-failed`.
6) Post-deploy checks:
   - Verify live site responds with HTTP 200: `curl -sI --max-time 10 -H "Cache-Control: no-cache" https://jakeklineisreal.github.io/ae-bootcamp-capstone/ | grep HTTP`.
   - Confirm live bundle hash matches the local build output.
   - If requested, run live E2E smoke test:
     `E2E_BASE_URL=https://jakeklineisreal.github.io/ae-bootcamp-capstone/ npm run test:e2e`.

Final response format:
- Short status per step (pass/fail).
- Any follow-up actions needed.
- Live URL: https://jakeklineisreal.github.io/ae-bootcamp-capstone/
