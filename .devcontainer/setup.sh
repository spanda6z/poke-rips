#!/usr/bin/env bash
set -euo pipefail

echo "=== Poke Rips Codespace setup ==="

# Solana CLI
if ! command -v solana >/dev/null 2>&1; then
  sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"
  echo 'export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"' >> ~/.bashrc
  export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
fi

# Anchor 0.30.1
if ! command -v anchor >/dev/null 2>&1; then
  cargo install --git https://github.com/coral-xyz/anchor --tag v0.30.1 anchor-cli --locked --force || true
fi

# Frontend deps
if [ -f frontend/package.json ]; then
  (cd frontend && npm install) || true
fi

# Executor deps
if [ -f executor/package.json ]; then
  (cd executor && npm install) || true
fi

echo "=== Setup done ==="
echo "Run: bash scripts/deploy.sh"
