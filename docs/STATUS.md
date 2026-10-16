# Poke Rips — Full Status

**Updated**: 2026-10-16

## Stack overview

| Layer | Status |
|-------|--------|
| Frontend (Shop, Rip, Collection, Vote, Stats, Fair) | MVP done |
| ORAO VRF (not Switchboard) | Helpers + process path done |
| Jupiter swaps | Working module |
| Token delivery to user ATA | Done |
| Anchor fulfill + order poll | Code ready — needs IDL after build |
| $POKE stake/vote | Skeleton + docs |
| Pack art / logo | Pending |
| Mainnet | Not started |

## Repo layout
```
poke-rips/
├── frontend/          Next.js app
├── programs/          Anchor (orders + stake skeleton)
├── executor/
│   ├── src/
│   │   ├── index.ts     main loop
│   │   ├── orao.ts      VRF
│   │   ├── jupiter.ts   swaps
│   │   ├── tokens.ts    ATA + transfer
│   │   └── program.ts   Anchor client
│   └── idl/             place poke_rips.json here after build
└── docs/
```

## Run frontend
```bash
cd frontend && npm install && npm run dev
```

## Run executor
```bash
cd executor
cp .env.example .env
npm install
npm run dev
```

After `anchor build && anchor deploy`:
```bash
cp ../target/idl/poke_rips.json ./idl/
# set PROGRAM_ID in .env
```

## Settlement path (live)
```
create_order (pay SOL, store vrf_seed)
  → ORAO request(seed)
  → waitFulfilled
  → fulfill_order(32 bytes)
  → Jupiter SOL→token
  → transfer tokens → user ATA
```
