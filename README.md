# Poke Rips

**Rip packs. Catch real bags.**

Solana pack-ripping dApp inspired by TokenRips, themed with Pokémon energy. Users buy packs with SOL, rip them, and receive real Solana tokens delivered to their wallet. The community votes which tokens enter the prize pool using `$POKE`.

## Live Links
- **App**: TBA (Vercel)
- **Twitter**: TBA
- **Token CA**: TBA
- **Repo**: https://github.com/spanda6z/poke-rips

## Features
- Multiple pack tiers (Micro → Whale)
- Provably fair randomness (Switchboard VRF)
- On-chain orders + Jupiter market buys
- `$POKE` for voting + odds boosts
- Card collection + rarity system
- Full fairness / transparency page

## Tech Stack
| Layer        | Stack                                      |
|--------------|--------------------------------------------|
| Frontend     | Next.js 14, Tailwind, Framer Motion, Wallet Adapter |
| On-chain     | Anchor, Switchboard VRF, Pyth              |
| Executor     | Node.js + Jupiter                          |
| Hosting      | Vercel (frontend) + Railway (executor)     |

## Project Structure
```
poke-rips/
├── frontend/          # Next.js app
├── programs/          # Anchor smart contracts
├── executor/          # Settlement service
├── docs/              # Architecture, tokenomics, brand
└── assets/            # Brand assets
```

## Quick Start

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Executor
```bash
cd executor
cp .env.example .env
npm install
npm run dev
```

### Smart Contract
```bash
cd programs
anchor build
anchor keys list          # update declare_id!
anchor deploy --provider.cluster devnet
```

## Documentation
- [Brand Kit](docs/BRAND.md)
- [Tokenomics](docs/TOKENOMICS.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Smart Contract](docs/SMART_CONTRACT.md)
- [Next Steps](docs/NEXT_STEPS.md)
- [Marketing Copy](docs/MARKETING.md)
- [Deployment](docs/DEPLOYMENT.md)

## Current Status
- Frontend MVP with rip animation: **Done**
- Smart contract core logic: **Done**
- Executor skeleton: **Done**
- Real VRF + Jupiter integration: **In progress**
- Final visuals + token launch: **Pending**

Built for rapid iteration.
