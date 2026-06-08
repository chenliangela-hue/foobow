# Plugin And AI Orchestration

## Installed Plugin Inventory

Foobow should use the currently available OpenAI plugin set this way:

| Plugin | Status | Role In This Project | Setup Action |
| --- | --- | --- | --- |
| Browser | Installed | Local PA/QA, responsive checks, clickable prototype inspection, localhost verification | Use for product assurance before accepting UI changes |
| GitHub | Installed | Repo status, pushes, CI checks, PR/issue work when credentials are available | Prefer for remote CI/PR work; fall back to `gh` only when needed |
| Chrome | Installed | Checks that need the user's logged-in Chrome session | Use only when explicit Chrome state is required |
| Computer Use | Installed | Windows desktop/terminal recovery when CLI/browser routes fail | Use sparingly for local app setup or auth flows |
| Documents | Installed | Product specs, review docs, release notes in `.docx` form | Optional for stakeholder-ready documents |
| Presentations | Installed | Pitch decks or investor/product presentations | Optional after product scope stabilizes |
| Spreadsheets | Installed | Roadmaps, QA matrices, budget/donation models | Optional for planning and ops models |
| Canva | Installed | Marketing visuals, presentation variants, social assets | Optional for external design collateral |

No additional plugin is required for the current Foobow sprint. The useful setup is operational: keep Browser, GitHub, and Computer Use available for QA, CI, and Windows recovery; keep Documents/Presentations/Spreadsheets/Canva available for later go-to-market artifacts.

## Plugin Usage Rules

- Use Browser for real UI/UX acceptance, not just unit tests.
- Use GitHub or `gh` to inspect remote CI after every push when the approval layer permits it.
- Use Computer Use only when local auth or GUI state cannot be handled by shell/browser tools.
- Use Canva only for product/design assets, not for source-of-truth product requirements.
- Keep repo source-of-truth in markdown, tests, source code, and CI.

## AI Agent Roles

| Agent | Primary Role | Good Assignments | Avoid |
| --- | --- | --- | --- |
| Codex 5.5 | Orchestrator, implementation, tests, integration, final review | Repo edits, CI, DB/API work, browser QA, commits | Long speculative planning when another agent is below quota |
| Claude 4.8 | Architecture review, product critique, copy review | Abstract plans, non-sensitive docs, design critique | Private repo context unless the user explicitly approves external transfer |
| Gemini 3.5 | Broad ideation, task decomposition, alternate approaches | High-volume backlog shaping, copy variants, lightweight plans | Final code authority or private repo dumps without approval |

## Usage Rotation Rules

- Under 60% load: agent is available for normal assignments.
- 60-79% load: agent should receive only high-fit tasks.
- 80% or higher: rotate away from that agent and record the expected recovery time if known.
- Unknown recovery time: mark `Unknown` and recheck on the next orchestration pass.
- External AI use must respect privacy: do not send private repository content outside the local environment without explicit user approval.

## VibeOrchestrator Loop

1. Read `USAGE_DASHBOARD.md`, `docs/task-board.md`, `docs/project-plan.md`, and `git status`.
2. Check available plugins/tools for the task type.
3. Pick 3-5 tasks that are safe to complete without user credentials.
4. Assign work by role and current load.
5. Implement locally with tests first or tests alongside code.
6. Run the narrow gate, then the wider gate appropriate to the change.
7. Commit and push only verified work.
8. Update `USAGE_DASHBOARD.md`, task board, and blockers.
9. Recheck agent load and repeat until blocked or the sprint is complete.

## Active Automation

- `foobow-vibeorchestrator-usage-check`: heartbeat automation every 30 minutes in the current thread.
- Purpose: reread dashboard/task state, rotate away from any agent at or above 80%, continue the next safe local sprint task, and report blockers or required input.
