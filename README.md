# Poke Rips

**Rip packs. Catch real bags.**

Solana pack-ripping dApp. Buy a pack with SOL, rip it, pull real tokens delivered to your wallet. Stake `$POKE` to vote coins into the prize pool and boost odds.

## Stack
- **Frontend**: Next.js, Tailwind, Framer Motion, Wallet Adapter
- **Randomness**: ORAO VRF (Switchboard shut down Sept 2026)
- **Swaps**: Jupiter
- **On-chain**: Anchor
- **Executor**: Node settlement service

## Quick start

### Frontend
```bash
cd frontend && npm install && npm run dev
```

### Executor
```bash
cd executor && cp .env.example .env && npm install && npm run dev
```

### Program
```bash
cd programs && anchor build && anchor keys list
# update declare_id!, rebuild, deploy
cp target/idl/poke_rips.json ../executor/idl/
```

## Docs
- [Status](docs/STATUS.md)
- [Randomness (ORAO)](docs/RANDOMNESS.md)
- [Smart contract](docs/SMART_CONTRACT.md)
- [Stake + Vote](docs/STAKE_VOTE.md)
- [Tokenomics](docs/TOKENOMICS.md)
- [Marketing](docs/MARKETING.md)
- [Deployment](docs/DEPLOYMENT.md)

## License
MIT
