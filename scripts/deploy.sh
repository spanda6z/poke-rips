#!/usr/bin/env bash
# Poke Rips — one-shot devnet deploy for Cursor / local terminal
# Usage: bash scripts/deploy.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "=== Poke Rips Devnet Deploy ==="

# 0. Preconditions
command -v solana >/dev/null || { echo "Install Solana CLI first: https://solana.com/docs/intro/installation"; exit 1; }
command -v anchor >/dev/null || { echo "Install Anchor: cargo install --git https://github.com/coral-xyz/anchor avm --locked --force && avm install 0.30.1 && avm use 0.30.1"; exit 1; }

echo "Solana: $(solana --version)"
echo "Anchor: $(anchor --version)"
echo "Wallet: $(solana address)"
echo "Balance: $(solana balance)"

# Ensure devnet
solana config set --url https://api.devnet.solana.com

BAL=$(solana balance | awk '{print $1}')
if (( $(echo "$BAL < 1" | bc -l) )); then
  echo "Low balance — requesting airdrop..."
  solana airdrop 2 || solana airdrop 1 || true
  sleep 2
  echo "Balance now: $(solana balance)"
fi

# 1. Build
echo ""
echo "=== Building ==="
anchor build

# 2. Keys
echo ""
echo "=== Program key ==="
anchor keys list || true
PROGRAM_ID=$(solana address -k target/deploy/poke_rips-keypair.json 2>/dev/null || true)
if [ -z "${PROGRAM_ID:-}" ]; then
  echo "Generating program keypair..."
  solana-keygen new -o target/deploy/poke_rips-keypair.json --no-bip39-passphrase --force
  PROGRAM_ID=$(solana address -k target/deploy/poke_rips-keypair.json)
fi
echo "PROGRAM_ID=$PROGRAM_ID"

# 3. Patch declare_id + Anchor.toml
echo ""
echo "=== Updating declare_id! and Anchor.toml ==="
if [[ "$OSTYPE" == "darwin"* ]]; then
  SED=(sed -i '')
else
  SED=(sed -i)
fi

"${SED[@]}" "s/declare_id!(\"[^\"]*\")/declare_id!(\"$PROGRAM_ID\")/" programs/poke-rips/src/lib.rs
"${SED[@]}" "s/poke_rips = \"[^\"]*\"/poke_rips = \"$PROGRAM_ID\"/g" Anchor.toml

# 4. Rebuild with real id
echo ""
echo "=== Rebuild with real program id ==="
anchor build

# 5. Deploy
echo ""
echo "=== Deploying to devnet ==="
anchor deploy --provider.cluster devnet

# 6. Copy IDL to executor
echo ""
echo "=== Copying IDL ==="
mkdir -p executor/idl
if [ -f target/idl/poke_rips.json ]; then
  cp target/idl/poke_rips.json executor/idl/poke_rips.json
  echo "IDL → executor/idl/poke_rips.json"
else
  echo "WARN: target/idl/poke_rips.json not found"
fi

# 7. Env snippets
echo ""
echo "=== Write env helpers ==="
cat > executor/.env.devnet <<EOF
RPC_URL=https://api.devnet.solana.com
PROGRAM_ID=$PROGRAM_ID
# EXECUTOR_SECRET_KEY=[...]  # JSON byte array of your keypair
SOL_PRICE_USD=150
JUPITER_API=https://lite-api.jup.ag/swap/v1
EOF

cat > frontend/.env.local <<EOF
NEXT_PUBLIC_PROGRAM_ID=$PROGRAM_ID
NEXT_PUBLIC_RPC_URL=https://api.devnet.solana.com
EOF

echo ""
echo "=== DONE ==="
echo "Program ID: $PROGRAM_ID"
echo ""
echo "Next:"
echo "  1. Fund executor key + set EXECUTOR_SECRET_KEY in executor/.env"
echo "  2. cd executor && cp .env.devnet .env && npm i && npm run dev"
echo "  3. cd frontend && npm i && npm run dev"
echo "  4. Call initialize_config once (see docs/GO_LIVE.md)"
