#!/usr/bin/env bash
set -euo pipefail

# Setup script to initialize and reproduce base/monolith and base/chemical-x branches

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

cd "${REPO_ROOT}"

CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"
echo "Current branch: ${CURRENT_BRANCH}"

echo "=== Initializing base/monolith branch ==="
if git show-ref --quiet refs/heads/base/monolith; then
  echo "Branch base/monolith already exists locally. Checking out..."
  git checkout base/monolith
else
  echo "Creating base/monolith from main..."
  git checkout -b base/monolith main
fi

# Ensure UserDashboardMonolithApp.tsx is present and App.tsx points to it
if [ ! -f "src/UserDashboardMonolithApp.tsx" ]; then
  echo "Error: src/UserDashboardMonolithApp.tsx missing on base/monolith."
  exit 1
fi

cat << 'EOF' > src/App.tsx
import React from 'react';
import { UserDashboardMonolithApp } from './UserDashboardMonolithApp';

export const App: React.FC = () => {
  return <UserDashboardMonolithApp />;
};

export default App;
EOF

git add src/UserDashboardMonolithApp.tsx src/App.tsx
if ! git diff --cached --quiet; then
  git commit -m "feat(base): ensure monolithic starting component baseline"
fi

echo "=== Initializing base/chemical-x branch ==="
if git show-ref --quiet refs/heads/base/chemical-x; then
  echo "Branch base/chemical-x already exists locally. Checking out..."
  git checkout base/chemical-x
else
  echo "Creating base/chemical-x from main..."
  git checkout -b base/chemical-x main
fi

# Ensure Chemical X modular files are present and App.tsx points to UserDashboardView
if [ ! -f "src/views/UserDashboardView.tsx" ]; then
  echo "Error: src/views/UserDashboardView.tsx missing on base/chemical-x."
  exit 1
fi

cat << 'EOF' > src/App.tsx
import React from 'react';
import { UserDashboardView } from './views/UserDashboardView';

export const App: React.FC = () => {
  return <UserDashboardView />;
};

export default App;
EOF

git add src/
if ! git diff --cached --quiet; then
  git commit -m "feat(base): ensure Chemical X modular starting component baseline"
fi

echo "=== Returning to original branch: ${CURRENT_BRANCH} ==="
git checkout "${CURRENT_BRANCH}"

if [ "${1:-}" = "--push" ]; then
  echo "=== Pushing branches to remote origin ==="
  git push -u origin base/monolith base/chemical-x
fi

echo "=== Branch initialization complete ==="
