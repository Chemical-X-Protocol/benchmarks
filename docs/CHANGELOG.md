# Changelog

All notable changes to the Chemical X Benchmarks repository will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [2026-09-09]

### Added
- Standalone Vite web entrypoint (`index.html`, `src/main.tsx`) and dev server configuration on port 8094 for COMPASS dev fleet integration.

### Changed
- Comprehensively overhauled `README.md` with human-oriented documentation covering architectural motivations, git branch models, local dev/test workflows, AST hazard linter rules, dry-run simulations, live benchmark commands, and task explanations.

## [2026-09-08]

### Added
- Initial benchmark repository architecture and Vite test harness.
- Branch hierarchy definition: `main`, `base/monolith`, `base/chemical-x`, and dynamic `eval/*` branches.
- Five benchmark evaluation tasks with Vitest assertions:
  - Task A: URL Param Filter Persistence (`tasks/task-a.test.ts`)
  - Task B: Export-to-JSON Modal with Validation (`tasks/task-b.test.ts`)
  - Task C: Expired Token Error Boundary with Result Tuples (`tasks/task-c.test.ts`)
  - Task D: Rate-Limit (429) Backoff in Async Fetch (`tasks/task-d.test.ts`)
  - Task E: Table Column Reordering and Sort Toggle (`tasks/task-e.test.ts`)
- Static AST Context Hazard Linter (`scripts/audit-context-risk.ts`) utilizing `@babel/parser` and `@babel/traverse`.
- Multi-model benchmark execution harness (`scripts/run-benchmark.ts`) supporting Claude 3.7 Sonnet, Gemini 2.5 Pro, GPT-4o, and Grok-2.
- GitHub Actions CI/CD matrix workflow (`.github/workflows/benchmark-matrix.yml`) for automated public evaluations.
- Documentation for GitHub Sponsors private starter-kit unlock architecture (`docs/SPONSOR_TIER.md`).

### Changed
- Delegated CI/CD matrix execution to universal reusable workflow hosted at `HalloftheGods/.github/.github/workflows/chemical-x-benchmark-matrix.yml@main`.
- Expanded legacy component baseline (`UserDashboardMonolithApp.tsx`) to 2,700 lines on `base/monolith` to benchmark high-context agent degradation.

## [2026-09-09]

### Added
- Multi-org package publish automation (`scripts/publish-both.mjs`) targeting `@chemx/benchmarks` and `@chem-x/benchmarks`.
- Local `publish:both` script in `package.json`.

### Fixed
- Added explicit `--tag` support and automatic default fallback for prerelease/CalVer versions in multi-target publisher (`scripts/publish-both.mjs`).

