# Smart Contract Outline (Anchor)

## Main Accounts
- `Config`: Odds tables, Top 20 token list, authority, fee settings
- `Order`: Per-rip state (user, pack type, VRF account, status, result)
- `StakeAccount`: User $POKE stake for voting + boost

## Core Instructions
1. `initialize_config`
2. `update_odds` / `update_top20` (authority)
3. `create_order` — user pays SOL, creates order + requests VRF
4. `fulfill_order` — called after VRF reveal (or by executor)
5. `claim_refund` — if order stuck past timeout
6. `stake_poke` / `unstake_poke`
7. `vote_token` — stake weight to push token into Top 20

## Randomness
Use Switchboard On-Demand VRF (commit-reveal).
The random value determines:
- Rarity tier
- Value multiplier within the pack's range
- Which token from the current Top 20

## Security Notes
- All critical params on-chain
- No admin ability to change a live order's result
- Public Order accounts for full auditability
