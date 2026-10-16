# System Architecture

## High-Level Flow
1. User selects pack and connects wallet
2. Pays SOL (price from Pyth oracle)
3. Order PDA is created on-chain
4. Switchboard VRF is requested (commit)
5. VRF reveals → rarity + prize band + token selected
6. Executor service detects resolved order
7. Executor performs Jupiter swap for the winning token
8. Tokens transferred to user + card metadata recorded
9. User sees result in Collection

## Components
- **Frontend** (Next.js): Shop, Collection, Vote, Stats, Fairness page
- **Solana Program** (Anchor): Order creation, VRF integration, config (odds + Top 20 list), refund path
- **Executor** (Node.js service): Watches orders, executes Jupiter swaps, handles edge cases
- **Oracles**: Pyth (pricing), Switchboard (VRF)

## Key Design Decisions
- Non-custodial as much as possible
- Every rip is publicly verifiable on Solscan
- If executor fails, contract allows refund after timeout
- Odds and Top 20 list live in on-chain config account
