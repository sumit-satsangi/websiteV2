#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
node scripts/generate-w9.mjs
if ! command -v quarto >/dev/null 2>&1; then
  echo "Quarto is required. Install it from https://quarto.org/docs/get-started/ before rendering W9." >&2
  exit 1
fi
quarto render
