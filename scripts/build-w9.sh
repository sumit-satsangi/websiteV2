#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
node scripts/generate-w9.mjs
if ! command -v quarto >/dev/null 2>&1; then
  QUARTO_VERSION="${QUARTO_VERSION:-1.10.19}"
  QUARTO_DIR="${TMPDIR:-/tmp}/quarto-w9-${QUARTO_VERSION}"
  if [ ! -x "$QUARTO_DIR/bin/quarto" ]; then
    mkdir -p "$QUARTO_DIR"
    ARCHIVE="${TMPDIR:-/tmp}/quarto-${QUARTO_VERSION}-linux-amd64.tar.gz"
    curl -fsSL "https://github.com/quarto-dev/quarto-cli/releases/download/v${QUARTO_VERSION}/quarto-${QUARTO_VERSION}-linux-amd64.tar.gz" -o "$ARCHIVE"
    tar -xzf "$ARCHIVE" --strip-components=1 -C "$QUARTO_DIR"
  fi
  export PATH="$QUARTO_DIR/bin:$PATH"
fi
quarto render
