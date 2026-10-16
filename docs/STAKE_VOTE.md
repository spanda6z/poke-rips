# $POKE Stake + Vote

## Purpose
- Stake $POKE → unlock odds boosts on Rare+ pulls
- Vote weight → push tokens into / up the Top 20 prize pool

## Boost tiers
| Tier | $POKE staked | Bonus on Rare+ |
|------|--------------|----------------|
| Spark | 250,000 | +8% |
| Charge | 1,000,000 | +15% |
| Surge | 2,500,000 | +22% |
| Apex | 5,000,000 | +30% |

## Accounts (skeleton in `programs/poke-rips/src/stake.rs`)
- `StakeAccount` — per user: amount, boost_tier
- `VoteBoard` — votes[20] aligned with Config.top20

## Instructions (to implement after mint)
1. `stake_poke(amount)` — lock tokens, set tier
2. `unstake_poke(amount)` — unlock, recalc tier
3. `cast_vote(token_index, weight)` — spend vote weight
4. `finalize_votes` (authority / epoch) — optionally reorder top20 by votes

## Frontend
Vote page already shows boost tiers + demo token list.
Wire real stake balance + vote buttons after program deploy.
