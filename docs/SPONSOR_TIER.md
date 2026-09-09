# Chemical X Protocol: Sponsorship & Private Starter Kit Architecture

This document outlines the commercialization and distribution model for the Chemical X architecture.

## Repository Tiering Model

### Tier 1: Public Benchmarks (Free & Open Source)
- **Repository**: `chemical-x-protocol/benchmarks`
- **Scope**:
  - Full automated benchmark execution harness.
  - The 5 standardized evaluation task test suites.
  - Static AST context hazard linter (`audit-context-risk.ts`).
  - GitHub Actions public matrix test runners.
  - Empirical performance leaderboards for AI coding agents.

### Tier 2: Private Starter Kit (Sponsor Unlocked)
- **Repository**: `chemical-x-protocol/starter-kit`
- **Submodule Target**: `apps/chemical-x/starter-kit`
- **Access**: Unlocked for GitHub Sponsors ($25/mo tier).
- **Deliverables**:
  - Drop-in production layout blueprints and crystalline molecule capsules.
  - Pre-configured CLI generator (`npx chemical-x create-capsule`).
  - Pre-commit Husky hooks with AST context hazard enforcement.
  - Full composable library:
    - 3-state async pipeline hooks.
    - Two-Stage atomic boolean helpers.
    - Self-cleaning timer and frame synchronizers.
    - Result tuple API abstractions (`toResult`).

## GitHub Sponsors Webhook Integration

1. Sponsor subscribes to Chemical X Protocol on GitHub Sponsors.
2. Webhook triggers repository invitation to `chemical-x-protocol/starter-kit`.
3. Developer clones or mounts `apps/chemical-x/starter-kit` as a submodule into their monorepo.
