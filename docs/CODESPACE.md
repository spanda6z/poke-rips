# Open a Codespace from your phone

GitHub Codespaces = free cloud computer in the browser. No laptop.

## Create it (phone)

1. Open: https://github.com/spanda6z/poke-rips
2. Tap the green **Code** button
3. Tap **Codespaces** tab
4. Tap **Create codespace on main**
5. Wait 2–5 minutes for the cloud machine to start

Or direct link (after first visit):
https://github.com/codespaces/new?hide_repo_select=true&ref=main&repo=spanda6z/poke-rips

## Inside the Codespace terminal

```bash
# Wallet + SOL
solana-keygen new --no-bip39-passphrase -o ~/.config/solana/id.json --force
solana config set --url https://api.devnet.solana.com
solana airdrop 2

# Deploy everything
bash scripts/deploy.sh

# Init config once
npm install
ANCHOR_PROVIDER_URL=https://api.devnet.solana.com ANCHOR_WALLET=~/.config/solana/id.json npx ts-node scripts/init-config.ts

# Frontend
cd frontend && npm run dev
```

Port 3000 is forwarded — Codespaces shows a URL you can open on your phone.

## Free tier note

GitHub free accounts get limited Codespaces hours/month. Stop the codespace when done:
Codespaces menu → Stop / Delete.

## Alternative without Codespaces

Use **Actions → Deploy Devnet** (see docs/PHONE_DEPLOY.md) — no IDE needed, just one button.
