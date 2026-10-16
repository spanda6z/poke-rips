# Deploy with Cursor (or any terminal)

Paste this into Cursor Agent / chat:

```
In the poke-rips repo root, run the full devnet deploy:

1. Ensure Solana CLI + Anchor 0.30.1 are installed
2. Ensure ~/.config/solana/id.json exists and has ≥2 SOL on devnet
3. Run: bash scripts/deploy.sh
4. Then: ANCHOR_PROVIDER_URL=https://api.devnet.solana.com ANCHOR_WALLET=~/.config/solana/id.json npx ts-node scripts/init-config.ts
5. cd executor && cp .env.devnet .env && add EXECUTOR_SECRET_KEY && npm i && npm run dev
6. cd frontend && npm i && npm run dev
```

## Prerequisites (one-time on your machine)

```bash
# Solana
sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"

# Anchor 0.30.1
cargo install --git https://github.com/coral-xyz/anchor --tag v0.30.1 avm --locked --force
avm install 0.30.1
avm use 0.30.1

# Wallet + SOL
solana-keygen new   # if needed
solana config set --url https://api.devnet.solana.com
solana airdrop 2
```

## One command

```bash
bash scripts/deploy.sh
```

This will: build → keys → patch declare_id → rebuild → deploy → copy IDL → write env files.

## Why this can't run fully in the cloud sandbox
- Anchor needs a modern Rust toolchain + avm
- Deploy needs *your* funded keypair (airdrop is rate-limited)
- Cursor on your laptop has both
