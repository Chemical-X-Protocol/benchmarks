# Chemical X Protocol: AI Coding Agent Benchmarks

[![Live App](https://img.shields.io/badge/Web%20App-chemicalx.xophz.com-06b6d4?style=for-the-badge&logo=cloudflare)](https://chemicalx.xophz.com)
[![Parent Repo](https://img.shields.io/badge/Repository-awesome--secret--sauce-8b5cf6?style=for-the-badge)](https://github.com/Chemical-X-Protocol/awesome-secret-sauce)
[![Starter Kit](https://img.shields.io/badge/Starter%20Kit-Crystalline%20Capsules-f59e0b?style=for-the-badge)](https://github.com/Chemical-X-Protocol/starter-kit)

Empirical, reproducible benchmarking repository to evaluate AI coding agent performance (Claude 3.7 Sonnet, Gemini 2.5 Pro, GPT-4o, Grok-2) across legacy monolithic components versus modular Chemical X architecture.

Interactive benchmarks dashboard live at [https://chemicalx.xophz.com/#benchmarks](https://chemicalx.xophz.com/#benchmarks).

## Repository Overview

- **Organization**: `chemical-x-protocol`
- **Repository**: `chemical-x-protocol/benchmarks`
- **Submodule Path**: `apps/chemical-x/benchmarks`
- **Live Portal**: [https://chemicalx.xophz.com](https://chemicalx.xophz.com)

## Branch Hierarchy

- `main`: Test harness, AST hazard linter, 5 task specifications, CI matrix definitions.
- `base/monolith`: Contains the un-factored 2,700-line monolith component (`UserDashboardMonolithApp.tsx`).
- `base/chemical-x`: The exact same functionality refactored to Chemical X standards:
  - Top-level view under 20 lines (Table-of-Contents pattern)
  - Molecule capsules strictly under 100 lines
  - Domain logic extracted into dedicated composables/hooks
  - Two-Stage Atomic Booleans (Concept -> Decision -> Guard)
  - Result tuple pattern (`toResult`) and co-located types (`*.d.ts`)
  - Self-cleaning timer hooks

Evaluation branches created during benchmark runs:
- `eval/monolith/task-[a-e]-[model]-[run-id]`
- `eval/chemical-x/task-[a-e]-[model]-[run-id]`

## The 5 Benchmark Tasks

1. **Task A: URL Param Filter Persistence (`tasks/task-a.test.ts`)**
   - Synchronize category filter bidirectionally with URL search parameters on page reload without infinite loops.
2. **Task B: Export-to-JSON Modal with Validation (`tasks/task-b.test.ts`)**
   - Add export confirmation modal requiring user to type "CONFIRM" before downloading filtered JSON records.
3. **Task C: Expired Token Error Boundary (`tasks/task-c.test.ts`)**
   - Handle 401 Unauthorized API responses using Result Tuples (`toResult`) to display inline retry banner.
4. **Task D: Rate-Limit (429) Backoff in Async Fetch (`tasks/task-d.test.ts`)**
   - Refactor fetching to handle HTTP 429 errors with exponential backoff (up to 3 retries) and expose reactive `isRetrying` state.
5. **Task E: Table Column Reordering & Sort Toggle (`tasks/task-e.test.ts`)**
   - Add tri-state 'Amount' column sort toggle (ASC/DESC/NONE) in table header, isolating sorting from render cycle.

## Static AST Context Hazard Linter

Run static AST analysis to identify context hazards:

```bash
npm run audit
npm run audit -- --json
```

Flags:
- Line Budget: files > 500 lines, molecules > 100 lines
- Hook Saturation: component scopes declaring > 5 state/effect hooks
- Control Flow Complexity: inline JSX booleans with > 2 logical operators, nested ternaries
- Timer Discipline: raw `setInterval` or `setTimeout` without lifecycle disposal
- Type Co-location: inlined anonymous complex types

## Running Benchmarks

```bash
npm run benchmark -- --model=claude-3-7-sonnet --target=chemical-x --task=task-a
npm run benchmark -- --model=gemini-2-5-pro --target=monolith --task=all
npm run benchmark -- --model=gpt-4o --target=chemical-x --task=task-b
npm run benchmark -- --model=grok-2 --target=chemical-x --task=task-c
```

## Public vs Sponsor Drop-In Architecture

- **Public Benchmarks (`chemical-x-protocol/benchmarks`)**: Public evaluation harness, AST hazard linter, and continuous CI matrix results.
- **Sponsor Starter Kit (`apps/chemical-x/starter-kit`)**: Drop-in component capsules, CLI generators, and production composable kit unlocked via GitHub Sponsors. See [docs/SPONSOR_TIER.md](docs/SPONSOR_TIER.md).
