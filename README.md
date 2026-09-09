# Chemical X Protocol: AI Coding Agent Benchmarks

[![Live App](https://img.shields.io/badge/Web%20App-chemicalx.xophz.com-06b6d4?style=for-the-badge&logo=cloudflare)](https://chemicalx.xophz.com)
[![Parent Repo](https://img.shields.io/badge/Repository-awesome--secret--sauce-8b5cf6?style=for-the-badge)](https://github.com/Chemical-X-Protocol/awesome-secret-sauce)
[![Starter Kit](https://img.shields.io/badge/Starter%20Kit-Crystalline%20Capsules-f59e0b?style=for-the-badge)](https://github.com/Chemical-X-Protocol/starter-kit)

Empirical, reproducible benchmarking repository to evaluate and compare AI coding agent performance across legacy monolithic architectures versus modular Chemical X architecture.

Interactive benchmarks dashboard live at [https://chemicalx.xophz.com/#benchmarks](https://chemicalx.xophz.com/#benchmarks).

---

## Table of Contents

- [What Is This Repository For?](#what-is-this-repository-for)
- [Why Monolith vs. Chemical X?](#why-monolith-vs-chemical-x)
- [Repository Architecture & Branch Model](#repository-architecture--branch-model)
- [Quickstart: Human Developer Workflows (No API Keys Needed)](#quickstart-human-developer-workflows-no-api-keys-needed)
  - [1. Initialize Local Branches](#1-initialize-local-branches)
  - [2. Run and Inspect the Applications in Your Browser](#2-run-and-inspect-the-applications-in-your-browser)
  - [3. Run the AST Context Hazard Linter](#3-run-the-ast-context-hazard-linter)
  - [4. Run Unit Tests with Vitest](#4-run-unit-tests-with-vitest)
  - [5. Test the Benchmark Harness (Dry Run)](#5-test-the-benchmark-harness-dry-run)
- [Running AI Coding Agent Benchmarks](#running-ai-coding-agent-benchmarks)
  - [Prerequisites: API Keys](#prerequisites-api-keys)
  - [CLI Flags & Options](#cli-flags--options)
  - [Benchmark Execution Examples](#benchmark-execution-examples)
  - [How the Benchmark Runner Works](#how-the-benchmark-runner-works)
- [The 5 Benchmark Tasks Explained](#the-5-benchmark-tasks-explained)
- [Metrics, Scoring & Aggregated Reports](#metrics-scoring--aggregated-reports)
  - [Evaluation Metrics](#evaluation-metrics)
  - [Generating Aggregated Comparison Tables](#generating-aggregated-comparison-tables)
- [CI/CD Matrix Automation](#cicd-matrix-automation)
- [Sponsor Starter Kit](#sponsor-starter-kit)

---

## What Is This Repository For?

Modern AI coding agents (such as Claude 3.7 Sonnet, Gemini 2.5 Pro, GPT-4o, and Grok-2) excel at generating greenfield code. However, when instructed to modify existing real-world codebases, agents frequently suffer from:

1. **Context Saturation & Hallucination**: In massive files (500+ to 2,500+ lines), agents lose track of state, mix up scopes, and generate non-existent helper functions.
2. **Broken Patch Diffs**: Agents truncate code with placeholders like `// ... existing code ...`, omitting imports, closing tags, and unchanged logic.
3. **Cascading Regressions**: Tight coupling and entangled effects cause edits in one section to break unrelated features.

This repository provides an **empirical test harness** to measure these exact failure modes. It subjects leading AI coding models to identical engineering tasks across two contrasting architectures of the exact same application:

- **Monolith Baseline (`base/monolith`)**: A typical 2,700-line single-file React component.
- **Chemical X Modular Baseline (`base/chemical-x`)**: The same application refactored to strict Chemical X architectural standards.

---

## Why Monolith vs. Chemical X?

| Dimension | Legacy Monolith (`base/monolith`) | Chemical X Architecture (`base/chemical-x`) |
| :--- | :--- | :--- |
| **Top-Level View** | 2,700 lines of entangled JSX, fetch logic, and state | Under 20 lines (declarative Table of Contents) |
| **Component Size** | Monolithic block exceeding 2,700 lines | Molecule capsules strictly under 100 lines |
| **State Management** | Over 15 disparate `useState` and `useEffect` hooks in one scope | Encapsulated in single-purpose domain composables/hooks |
| **Control Flow** | Nested ternaries and inline multi-condition booleans | Two-Stage Atomic Booleans (Concept -> Decision -> Guard) |
| **Error Handling** | Raw `try/catch` blocks throwing unhandled rejections | Go/Rust-style Result Tuples (`toResult`) |
| **Timers & Cleanups** | Raw `setInterval` / `setTimeout` leaking on unmount | Self-cleaning hooks with automatic teardown |
| **Agent Diff Integrity** | Frequent truncation and marker collisions | Clean, isolated surgical diffs |

---

## Repository Architecture & Branch Model

Rather than storing monolithic and modular files side-by-side in separate folders, this repository uses **Git Branches** as architectural targets. This mirrors realistic AI developer workflows where an agent is dispatched to work on a specific repository branch.

```
                      ┌─── base/monolith (2,700-line UserDashboardMonolithApp.tsx)
                      │       │
                      │       └──> eval/monolith/task-a-gemini-2-5-pro-[run-id]
main (Test Harness) ──┤
                      │       ┌───> eval/chemical-x/task-a-gemini-2-5-pro-[run-id]
                      │       │
                      └─── base/chemical-x (Decomposed capsules, hooks, views)
```

### Branch Roles

- **`main`**: The benchmark coordination center. Contains:
  - Vitest test suites (`tasks/task-[a-e].test.ts`)
  - AST context hazard audit script (`scripts/audit-context-risk.ts`)
  - Benchmark execution runner (`scripts/run-benchmark.ts`)
  - Results aggregation script (`scripts/aggregate-benchmark-summary.ts`)
  - GitHub Actions matrix workflow (`.github/workflows/benchmark-matrix.yml`)
- **`base/monolith`**: Baseline containing the un-factored 2,700-line monolith component at `src/UserDashboardMonolithApp.tsx`.
- **`base/chemical-x`**: Baseline containing the modularized application:
  - `src/views/UserDashboardView.tsx` (Table-of-Contents view)
  - `src/components/molecules/` (sub-100-line self-contained capsules)
  - `src/hooks/` (`useDashboardData`, `useDashboardFilters`, `useDashboardSorting`, `useSelfCleaningTimer`)
  - `src/core/toResult.ts` (Result tuple utility)
- **`eval/*`**: Ephemeral evaluation branches created dynamically by the benchmark runner to test each model's code edits.

---

## Quickstart: Human Developer Workflows (No API Keys Needed)

You do not need AI API keys to test, explore, or audit this repository. Follow these steps to work with the code locally.

### 1. Initialize Local Branches

Ensure the baseline branches (`base/monolith` and `base/chemical-x`) are configured in your local git repository:

```bash
npm run setup:branches
```

### 2. Run and Inspect the Applications in Your Browser

Both architectures run on the local Vite dev server (port 8094).

To inspect the **Chemical X Modular App**:
```bash
git checkout base/chemical-x
npm run dev
```
Open `http://localhost:8094` in your browser.

To inspect the **Monolith App**:
```bash
git checkout base/monolith
npm run dev
```
Open `http://localhost:8094` in your browser.

When finished, return to `main`:
```bash
git checkout main
```

### 3. Run the AST Context Hazard Linter

The context hazard linter statically parses the TypeScript AST using Babel to detect high-risk patterns that cause AI agents to hallucinate or fail.

Run the audit on the current branch:
```bash
npm run audit
```

Output as machine-readable JSON:
```bash
npm run audit -- --json
```

Target a specific directory:
```bash
npm run audit -- --dir=src
```

#### What the Linter Checks

1. **Line Budget**: Warns if any file exceeds 500 lines, or any molecule exceeds 100 lines (`LINE_BUDGET_FILE`, `LINE_BUDGET_MOLECULE`).
2. **Hook Saturation**: Flags any component scope declaring more than 5 hooks (`HOOK_SATURATION`).
3. **Control Flow Complexity**: Flags inline JSX booleans with more than 2 operators or nested ternaries (`CONTROL_FLOW_INLINE_BOOLEAN`, `CONTROL_FLOW_NESTED_TERNARY`).
4. **Timer Discipline**: Flags `setInterval` or `setTimeout` calls lacking cleanup returns (`TIMER_DISCIPLINE`).
5. **Type Co-location**: Flags anonymous complex inline types with more than 3 members (`TYPE_COLOCATION`).

> **Comparison Tip**: Run `npm run audit` on `base/monolith` to see dozens of flagged hazards. Then checkout `base/chemical-x` and run `npm run audit` to observe zero violations.

### 4. Run Unit Tests with Vitest

The tasks are verified through automated Vitest test suites located in `tasks/`:

```bash
# Run all task suites in watch mode
npm run test

# Run all task suites once
npm run test:run

# Run a specific task suite
npx vitest run tasks/task-a.test.ts
```

### 5. Test the Benchmark Harness (Dry Run)

Test the complete benchmarking lifecycle without dispatching actual LLM API calls using the `--dry-run` flag:

```bash
npm run benchmark -- --dry-run --model=gemini-2-5-pro --target=chemical-x --task=task-a
```

This verifies that git branch checkouts, file reading, mock patching, typechecks, and metric recordings function properly on your machine.

---

## Running AI Coding Agent Benchmarks

### Prerequisites: API Keys

To execute live benchmarks against commercial models, configure the corresponding environment variables:

```bash
# Anthropic (Claude 3.7 Sonnet)
export ANTHROPIC_API_KEY="your-anthropic-api-key"

# Google Gemini (Gemini 2.5 Pro)
export GEMINI_API_KEY="your-gemini-api-key"

# OpenAI (GPT-4o)
export OPENAI_API_KEY="your-openai-api-key"

# xAI (Grok-2)
export XAI_API_KEY="your-xai-api-key"
```

### CLI Flags & Options

The benchmark runner supports the following arguments:

| Argument | Allowed Values | Default | Description |
| :--- | :--- | :--- | :--- |
| `--model` | `claude-3-7-sonnet`, `gemini-2-5-pro`, `gpt-4o`, `grok-2` | `gemini-2-5-pro` | Model to benchmark |
| `--target` | `chemical-x`, `monolith` | `chemical-x` | Architectural baseline |
| `--task` | `task-a`, `task-b`, `task-c`, `task-d`, `task-e`, `all` | `task-a` | Task(s) to execute |
| `--dry-run` | Flag (presence only) | `false` | Mock LLM call for testing |

### Benchmark Execution Examples

```bash
# Test Claude 3.7 Sonnet on Chemical X for Task A
npm run benchmark -- --model=claude-3-7-sonnet --target=chemical-x --task=task-a

# Test Gemini 2.5 Pro on Monolith across all tasks
npm run benchmark -- --model=gemini-2-5-pro --target=monolith --task=all

# Test GPT-4o on Chemical X for Task B
npm run benchmark -- --model=gpt-4o --target=chemical-x --task=task-b

# Test Grok-2 on Monolith for Task C
npm run benchmark -- --model=grok-2 --target=monolith --task=task-c
```

### How the Benchmark Runner Works

When you run `scripts/run-benchmark.ts`, the harness performs the following sequence:

1. **Git Isolation**: Checks out the target base branch (`base/monolith` or `base/chemical-x`) and creates a fresh evaluation branch named `eval/<target>/<task>-<model>-<run-id>`.
2. **Context Assembly**: Loads the target file (`src/UserDashboardMonolithApp.tsx` or `src/views/UserDashboardView.tsx`) and constructs a standardized prompt containing the task requirements.
3. **Model Dispatch**: Sends the prompt to the requested model API, measuring latency and token consumption (input tokens and output tokens).
4. **Diff & Patch Verification**: Extracts the returned code block, applies it to the target file, and checks for corrupted diff markers (such as unresolved git conflicts or `// ... existing code ...` placeholders).
5. **Typecheck Assertion**: Executes `npx tsc --noEmit` to verify type safety.
6. **Test Suite Verification**: Executes `npx vitest run tasks/<task>.test.ts` to verify functionality.
7. **Branch Cleanup**: Returns your local git workspace back to the branch you started on.
8. **Result Persistence**: Writes a detailed JSON result file to `benchmarks/results/<timestamp>-<model>-<target>-<task>.json`.

---

## The 5 Benchmark Tasks Explained

Each task targets a common frontend requirement that tests agent reasoning, architectural modularity, and risk of diff corruption.

### Task A: URL Param Filter Persistence
- **Test File**: [`tasks/task-a.test.ts`](tasks/task-a.test.ts)
- **Challenge**: Synchronize the category dropdown filter bidirectionally with URL search parameters on page reload without causing infinite render loops.
- **Monolith Risk**: In a 2,700-line component with tangled `useEffect` hooks, agents create dependency loops between history pushes and state setters.
- **Chemical X Solution**: Handled cleanly inside the dedicated `useDashboardFilters` hook via isolated state transitions.

### Task B: Export-to-JSON Modal with Validation
- **Test File**: [`tasks/task-b.test.ts`](tasks/task-b.test.ts)
- **Challenge**: Add an export confirmation dialog requiring the user to type "CONFIRM" before downloading filtered records as JSON.
- **Monolith Risk**: Agents must thread modal states, keyboard listeners, and button handlers into the middle of thousands of lines of unrelated JSX.
- **Chemical X Solution**: Add or update the isolated [`m-dashboard-export-modal.tsx`](src/components/molecules/m-dashboard-export-modal/m-dashboard-export-modal.tsx) capsule (< 100 lines) with zero risk of breaking table rendering.

### Task C: Expired Token Error Boundary (Result Tuples)
- **Test File**: [`tasks/task-c.test.ts`](tasks/task-c.test.ts)
- **Challenge**: Handle HTTP 401 Unauthorized responses using Go/Rust-style Result Tuples (`toResult`) to display an inline retry banner rather than throwing unhandled promise rejections.
- **Monolith Risk**: Catch blocks in monoliths swallow errors or set un-tracked boolean error flags that conflict with loading spinners.
- **Chemical X Solution**: Uses [`toResult`](src/core/toResult.ts) and the discriminated error state in [`m-dashboard-error-banner.tsx`](src/components/molecules/m-dashboard-error-banner/m-dashboard-error-banner.tsx).

### Task D: Rate-Limit (429) Backoff in Async Fetch
- **Test File**: [`tasks/task-d.test.ts`](tasks/task-d.test.ts)
- **Challenge**: Refactor data fetching to catch HTTP 429 errors, apply exponential backoff (up to 3 retries), and expose a reactive `isRetrying` indicator.
- **Monolith Risk**: In monolithic components, retries trigger overlapping timers and multiple in-flight fetch race conditions.
- **Chemical X Solution**: Encapsulated within the [`useDashboardData`](src/hooks/useDashboardData.ts) domain composable with self-cleaning timer disposal.

### Task E: Table Column Reordering & Sort Toggle
- **Test File**: [`tasks/task-e.test.ts`](tasks/task-e.test.ts)
- **Challenge**: Add a tri-state 'Amount' column sort toggle (`ASC` -> `DESC` -> `NONE`) in the table header, isolating sort computations from the main render cycle.
- **Monolith Risk**: Adding inline sorting logic to a 2,700-line render function causes re-sorting on every keystroke in search filters.
- **Chemical X Solution**: Encapsulated in [`useDashboardSorting`](src/hooks/useDashboardSorting.ts) with direct binding into [`m-dashboard-table.tsx`](src/components/molecules/m-dashboard-table/m-dashboard-table.tsx).

---

## Metrics, Scoring & Aggregated Reports

### Evaluation Metrics

Every benchmark run produces a JSON result file containing:

- **First-Pass Success (`firstPassSuccess`)**: Boolean indicator that the edit compiled with TypeScript, passed diff integrity checks, and passed unit tests on the very first try with zero human interventions.
- **Diff Cleanliness (`diffIntegrity`)**: Boolean indicator that the model did not emit `// ... existing code ...` placeholders or broken syntax.
- **Typecheck Status (`typecheckPassed`)**: Output of `tsc --noEmit`.
- **Unit Test Status (`testPassed`)**: Output of Vitest test suite.
- **Token Burn (`tokenConsumption`)**: Total prompt tokens plus output tokens consumed.
- **Latency (`latencySeconds`)**: Time from API dispatch to patch verification.

### Generating Aggregated Comparison Tables

To compile all individual JSON results in `benchmarks/results/` into a single markdown summary:

```bash
npx tsx scripts/aggregate-benchmark-summary.ts
```

Example aggregated output:

| Model | Architecture | Pass Rate | Diff Cleanliness | Avg Token Burn | Avg Latency |
| :--- | :--- | :--- | :--- | :--- | :--- |
| claude-3-7-sonnet | chemical-x | 100% (5/5) | 100% (5/5) | 2,410 tokens | 4.12s |
| claude-3-7-sonnet | monolith | 40% (2/5) | 60% (3/5) | 18,920 tokens | 14.80s |
| gemini-2-5-pro | chemical-x | 100% (5/5) | 100% (5/5) | 2,150 tokens | 3.85s |
| gemini-2-5-pro | monolith | 20% (1/5) | 40% (2/5) | 19,400 tokens | 16.20s |
| gpt-4o | chemical-x | 100% (5/5) | 100% (5/5) | 2,680 tokens | 4.45s |
| gpt-4o | monolith | 20% (1/5) | 40% (2/5) | 20,100 tokens | 15.90s |

---

## CI/CD Matrix Automation

The repository includes a GitHub Actions workflow at [`.github/workflows/benchmark-matrix.yml`](.github/workflows/benchmark-matrix.yml) configured for automated continuous evaluation:

- **Static Hazard Audit Job**: Automatically runs the AST context risk linter on pull requests modifying `src/`, `tasks/`, or `scripts/`.
- **Workflow Dispatch Matrix**: Allows maintainers to trigger evaluation matrices across any combination of models (`claude-3-7-sonnet`, `gemini-2-5-pro`, `gpt-4o`, `grok-2`) and architectural targets (`monolith`, `chemical-x`).
- **Summary Aggregation**: Downloads all matrix job artifacts and appends the aggregated markdown comparison table directly to `$GITHUB_STEP_SUMMARY`.

---

## Sponsor Starter Kit

- **Public Repository (`chemical-x-protocol/benchmarks`)**: Public evaluation test harness, AST hazard linter, and continuous CI matrix results.
- **Sponsor Starter Kit (`apps/chemical-x/starter-kit`)**: Drop-in component capsules, CLI generators, and production composables unlocked for GitHub Sponsors. See [docs/SPONSOR_TIER.md](docs/SPONSOR_TIER.md).
