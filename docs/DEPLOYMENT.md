# Deployment Guide

## 1. Smart Contract (Devnet first)

```bash
cd programs
anchor build
anchor keys list
# Copy the program id into declare_id! and Anchor.toml
anchor build
anchor deploy --provider.cluster devnet
```

Then initialize config:
```ts
// one-time script
await program.methods
  .initializeConfig(100, new BN(15000)) // 1% fee, ~timeout slots
  .accounts({ authority: wallet.publicKey })
  .rpc();
```

## 2. Frontend (Vercel)

```bash
cd frontend
npm install
npm run build
```

- Connect the GitHub repo to Vercel
- Set root directory to `frontend`
- Add env vars if needed (RPC URL, program id)

## 3. Executor (Railway / Render)

```bash
cd executor
# set env vars: RPC_URL, PROGRAM_ID, EXECUTOR_SECRET_KEY
npm install
npm run start
```

Keep the process alive. Upgrade later to websocket subscriptions.

## 4. Token Launch

1. Create $POKE (Pump.fun or Raydium)
2. Update frontend + contract with the mint
3. Seed initial Top 20 list via `update_top20`
4. Announce + enable voting

## 5. Checklist before Mainnet
- [ ] Audit / review fulfill_order + payment logic
- [ ] Real Switchboard VRF CPI tested on devnet
- [ ] Executor reliably settles 20+ test rips
- [ ] Refund path verified
- [ ] Frontend points to mainnet program id + RPC
- [ ] Emergency pause tested
