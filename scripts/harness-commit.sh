#!/usr/bin/env bash
# harness-commit.sh — stage-aware auto-commit helper for the Harness loop.
#
# Tool-agnostic: Kiro hooks, Antigravity, and other agents all call this the
# same way, so every tool produces the same staged commit history.
#
# Usage:
#   scripts/harness-commit.sh <stage> [message]
#
# Examples:
#   scripts/harness-commit.sh intake "classified request"
#   scripts/harness-commit.sh task   "spec task completed"
#   scripts/harness-commit.sh done   "end of work session"
#
# Safety:
#   - Commits are LOCAL only. This script never runs `git push`.
#   - Never auto-initializes git; if there is no repo it skips cleanly.
#   - Respects .gitignore (harness.db and friends stay out of history).
#   - Skips when there is nothing to commit, so empty stages are no-ops.
#   - Does not modify persisted git config; falls back to a per-commit
#     identity only when none is configured.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

STAGE="${1:-stage}"
EXTRA="${2:-checkpoint}"

# Must be inside a git work tree. Do not auto-init (avoid surprises).
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "harness-commit: not a git repository; skipping. Run 'git init' to enable stage commits."
  exit 0
fi

# Stage everything, honoring .gitignore.
git add -A

# Nothing staged -> nothing to do.
if git diff --cached --quiet; then
  echo "harness-commit: no changes to commit for stage '${STAGE}'."
  exit 0
fi

TS="$(date '+%Y-%m-%d %H:%M:%S')"
MSG="harness(${STAGE}): ${EXTRA} [${TS}]"

# Use a fallback identity only if none is configured, without persisting it.
if git config user.email >/dev/null 2>&1 || git config user.name >/dev/null 2>&1; then
  git commit -m "$MSG" >/dev/null
else
  GIT_AUTHOR_NAME="Harness Agent" GIT_AUTHOR_EMAIL="harness@local" \
  GIT_COMMITTER_NAME="Harness Agent" GIT_COMMITTER_EMAIL="harness@local" \
    git commit -m "$MSG" >/dev/null
fi

echo "harness-commit: committed stage '${STAGE}' -> ${MSG}"
