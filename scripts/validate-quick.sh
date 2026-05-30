#!/usr/bin/env bash
# validate-quick.sh — fast, stack-aware validation for the Harness loop.
#
# This is the `validate:quick` rung of the Harness Validation Ladder.
# Tool-agnostic: Kiro hooks, a running Antigravity agent, and any other tool
# all invoke it the same way, so every tool validates work identically.
#
# What it does (only what exists — no invented commands):
#   1. Verifies required CRM documentation artifacts.
#   2. Builds every .NET solution found under the repo.
#   3. Runs .NET tests for every solution that has test projects.
#   4. (If a frontend with package.json appears) runs its lint/typecheck.
#
# Usage:
#   scripts/validate-quick.sh           # validate everything
#   scripts/validate-quick.sh docs      # docs only
#   scripts/validate-quick.sh dotnet    # .NET build + test only
#
# Exit code is non-zero if any stage fails, so callers (hooks/agents) can gate.
set -uo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

SCOPE="${1:-all}"
status=0

section() { printf '\n=== %s ===\n' "$1"; }

run_docs() {
  section "Docs validation"
  if [ -x scripts/validate-crm-docs.sh ] || [ -f scripts/validate-crm-docs.sh ]; then
    bash scripts/validate-crm-docs.sh || status=1
  else
    echo "validate-quick: scripts/validate-crm-docs.sh not found; skipping docs."
  fi
}

run_dotnet() {
  section ".NET build + test"
  if ! command -v dotnet >/dev/null 2>&1; then
    echo "validate-quick: dotnet not installed; skipping .NET validation."
    return
  fi

  # Find solutions, ignoring build output dirs.
  local found=0
  while IFS= read -r sln; do
    found=1
    echo "--- building $sln"
    if ! dotnet build "$sln" -nologo -clp:ErrorsOnly; then
      echo "validate-quick: build FAILED for $sln"
      status=1
      continue
    fi
    # Run tests only if the solution references any test project.
    if grep -qiE 'Tests?\.csproj' "$sln" 2>/dev/null; then
      echo "--- testing $sln"
      if ! dotnet test "$sln" -nologo --no-build; then
        echo "validate-quick: tests FAILED for $sln"
        status=1
      fi
    else
      echo "validate-quick: no test project in $sln; skipping tests."
    fi
  done < <(find . -name '*.sln' -not -path '*/bin/*' -not -path '*/obj/*' | sort)

  [ "$found" -eq 0 ] && echo "validate-quick: no .sln found; skipping .NET."
}

run_frontend() {
  section "Frontend lint/typecheck"
  local pkg
  pkg="$(find . -name package.json -not -path '*/node_modules/*' 2>/dev/null | head -n1)"
  if [ -z "$pkg" ]; then
    echo "validate-quick: no frontend package.json found; skipping."
    return
  fi
  local dir
  dir="$(dirname "$pkg")"
  if grep -q '"lint"' "$pkg"; then
    echo "--- npm run lint in $dir"
    (cd "$dir" && npm run lint) || status=1
  fi
  if grep -q '"typecheck"' "$pkg"; then
    echo "--- npm run typecheck in $dir"
    (cd "$dir" && npm run typecheck) || status=1
  fi
}

case "$SCOPE" in
  docs)     run_docs ;;
  dotnet)   run_dotnet ;;
  frontend) run_frontend ;;
  all)      run_docs; run_dotnet; run_frontend ;;
  *) echo "usage: validate-quick.sh [all|docs|dotnet|frontend]"; exit 2 ;;
esac

section "Result"
if [ "$status" -eq 0 ]; then
  echo "validate-quick: PASS"
else
  echo "validate-quick: FAIL"
fi
exit "$status"
