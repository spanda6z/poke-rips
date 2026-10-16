# Poke Rips — Go-Live Checklist

## Phase 1: Devnet (do this first)

### 1. Build & deploy program
```bash
cd programs
anchor build
anchor keys list
# Paste program id into declare_id! in lib.rs AND Anchor.toml
anchor build
anchor deploy --provider.cluster devnet
```

### 2. Initialize config
```ts
// scripts/init.ts (run once)
await program.methods
  .initializeConfig(100, new BN(50_000)) // 1% fee, ~timeout slots
  .accounts({ authority: wallet.publicKey })
  .rpc();
```

### 3. Set Top 20
```ts
await program.methods
  .updateTop20(mintPubkeysArrayOf20)
  .accounts({ authority: wallet.publicKey })
  .rpc();
```

### 4. Executor
```bash
cd executor
cp ../target/idl/poke_rips.json ./idl/
# .env: RPC_URL, PROGRAM_ID, EXECUTOR_SECRET_KEY (funded with SOL)
npm install && npm run dev
```

### 5. Frontend
```bash
cd frontend
# .env.local: NEXT_PUBLIC_PROGRAM_ID=<deployed id>
npm install && npm run dev
```

### 6. E2E test
1. Connect wallet (devnet SOL)
2. Rip a Micro pack
3. Watch executor logs: ORAO request → fulfill → Jupiter → ATA transfer
4. Confirm tokens in wallet
5. Test refund path (pause executor, wait timeout, claim_refund)

---

## Phase 2: Mainnet readiness

- [ ] Audit fulfill_order access control (executor-only)
- [ ] Cap pack prices / max prize exposure
- [ ] Real SOL/USD price feed (Pyth) for prize sizing
- [ ] Executor redundancy + monitoring (alerts on failed settles)
- [ ] Pause tested
- [ ] Refund path tested with real SOL
- [ ] Legal / geo restrictions if required in your jurisdiction

## Phase 3: Token + launch

1. Create $POKE (Pump.fun or Raydium)
2. Seed liquidity
3. Implement stake_poke / cast_vote with real mint
4. Wire frontend stake UI
5. Announce (see docs/MARKETING.md)
6. Open packs on mainnet

## Emergency

```ts
await program.methods.setPaused(true).accounts({ authority }).rpc();
```

Keep authority key offline / multisig for production.
