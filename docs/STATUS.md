# Poke Rips — Project Status

**Last updated**: 2026-10-16

## Completed

### Product & Docs
- Full brand direction + color system
- Tokenomics for $POKE
- System architecture
- Smart contract design
- Marketing copy + launch thread draft
- Deployment guide

### Frontend
- Next.js App Router project
- Shop with 5 pack tiers
- Rip animation + card reveal modal
- Collection page with demo cards
- Vote page with boost tiers + token list
- Stats + Fairness pages
- Mobile bottom navigation
- Wallet adapter (Phantom + Solflare)

### On-chain
- Config + Order accounts
- initialize_config / update_top20 / set_paused
- create_order (with SOL payment)
- fulfill_order (rarity derivation)
- claim_refund path
- Events + error codes

### Executor
- Polling skeleton
- Prize calculation helper
- Clear TODOs for VRF + Jupiter

## Remaining (real integration work)
1. Switchboard On-Demand VRF CPI
2. Jupiter swap in executor
3. Treasury as PDA for secure refunds
4. $POKE stake + vote instructions
5. Final visual assets (logo SVG, pack art)
6. Devnet end-to-end test
7. Mainnet + token launch

## How to run right now
```bash
git clone https://github.com/spanda6z/poke-rips.git
cd poke-rips/frontend
npm install
npm run dev
```
Connect wallet → click any pack → see the full rip experience.
