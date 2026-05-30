#!/usr/bin/env bash
# validate-crm-docs.sh — Verifies that all bootstrapped CRM documentation files are present
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

REQUIRED_FILES=(
  "docs/product/crm-overview.md"
  "docs/product/crm-roadmap.md"
  "docs/product/crm-stories.md"
  "docs/decisions/0006-crm-microservice-architecture.md"
  "docs/decisions/0007-crm-database-schema-and-tenancy.md"
  "docs/decisions/0008-crm-security-and-auth.md"
  "docs/decisions/0009-crm-nextjs-structure.md"
  "docs/decisions/0010-crm-cicd-pipeline.md"
)

errors=0

echo "=== Verifying CRM Microservice Documentation Artifacts ==="
for file in "${REQUIRED_FILES[@]}"; do
  full_path="$REPO_ROOT/$file"
  if [ -f "$full_path" ]; then
    size=$(wc -c < "$full_path" | tr -d ' ')
    echo "✅ [FOUND] $file ($size bytes)"
  else
    echo "❌ [MISSING] $file"
    errors=$((errors + 1))
  fi
done

echo ""
if [ "$errors" -eq 0 ]; then
  echo "🎉 All documentation artifacts have been verified successfully!"
  exit 0
else
  echo "⚠️ Validation failed: $errors missing files."
  exit 1
fi
