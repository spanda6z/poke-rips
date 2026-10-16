# Poke Rips — Status

**Updated**: 2026-10-16

## Complete

| Area | Detail |
|------|--------|
| Frontend | Shop, Rip modal, Collection, Vote, Stats, Fair, mobile nav |
| Contract | create/fulfill/refund, treasury PDA, vrf_seed, payments |
| Randomness | ORAO VRF (Switchboard dead) |
| Executor | ORAO + Jupiter + ATA transfer + order poll + fulfill RPC |
| Stake/Vote | Skeleton + docs |
| Docs | Brand, tokenomics, architecture, marketing, go-live |

## Your actions

1. `anchor build` → deploy → copy IDL
2. Fund executor wallet
3. Set Top 20 mints
4. E2E on devnet
5. Optional: generate final pack PNGs / logo for `/assets`
6. Mainnet when ready (see `docs/GO_LIVE.md`)

## Run

```bash
# Frontend
cd frontend && npm i && npm run dev

# Executor
cd executor && cp .env.example .env && npm i && npm run dev
```

Repo: https://github.com/spanda6z/poke-rips
