# Poke Rips

**Rip packs. Catch real bags.**

Poke Rips is a Solana pack-ripping dApp inspired by TokenRips, themed around Pokémon energy. Users buy packs with SOL, rip them, and receive real Solana tokens delivered straight to their wallet. Community votes which tokens go into the prize pool using the platform token `$POKE`.

## Live Links (to be filled)
- App: TBA
- Twitter: TBA
- Token CA: TBA

## Core Features
- Pack tiers (Micro → Whale)
- Provably fair randomness via Switchboard VRF
- On-chain order settlement + Jupiter market buys
- `$POKE` for voting tokens into the Top 20 + odds boosts
- Card collection with rarity system
- Full transparency page

## Tech Stack
- **Frontend**: Next.js 14+ (App Router), Tailwind, shadcn/ui, Framer Motion
- **Wallet**: Solana Wallet Adapter
- **On-chain**: Anchor + Switchboard On-Demand VRF + Pyth
- **Swaps**: Jupiter
- **Hosting**: Vercel (frontend) + Railway (executor)

## Project Structure
```
poke-rips/
├── docs/                  # Product docs
├── frontend/              # Next.js app
├── programs/              # Anchor smart contracts
├── assets/                # Brand assets & prompts
└── README.md
```

## Quick Start (Frontend)
```bash
cd frontend
npm install
npm run dev
```

## Roadmap
1. Brand lock + visuals ✅
2. Frontend MVP (Shop + Collection)
3. Smart contract + VRF integration
4. Executor service
5. Token launch + vote system
6. Mainnet

Built for speed and iteration.
