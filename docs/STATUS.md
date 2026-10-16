# Poke Rips — Status

**Updated**: 2026-10-16

## Randomness + Swaps
| Piece | Status |
|-------|--------|
| Switchboard | Deprecated (shutdown) |
| ORAO VRF helpers | Done (`executor/src/orao.ts`) |
| Seed = sha256(order) | Done |
| `vrf_seed` on Order | Done |
| Jupiter swap module | Done |
| Auto processOrder path | Done (needs live IDL + order fetch) |

## How to test ORAO + Jupiter locally
```bash
cd executor
cp .env.example .env
# set EXECUTOR_SECRET_KEY + RPC_URL (devnet with SOL)
npm install
npm run dev
```

Uncomment the demo `processOrder` call in `index.ts` to exercise request → wait → settle.

## Frontend
```bash
cd frontend && npm install && npm run dev
```
