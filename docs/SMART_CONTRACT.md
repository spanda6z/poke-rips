# Smart Contract Outline (Anchor)

## Program ID
Replace `PokeRips11111111111111111111111111111111111` after running `anchor keys list`.

## Accounts

### Config
- `authority`
- `fee_bps`
- `refund_timeout_slots`
- `paused`
- `total_rips`
- `top20: [Pubkey; 20]`
- `bump`

### Order
- `user`
- `pack_id` (0-4)
- `status` (Pending / Fulfilled / Refunded)
- `rarity` (0-5)
- `token_index` (0-19 into top20)
- `value_band` (0-99)
- `created_slot`
- `bump`

## Instructions

| Instruction       | Who can call     | Purpose                                      |
|-------------------|------------------|----------------------------------------------|
| `initialize_config` | Authority       | One-time setup                               |
| `update_top20`      | Authority       | Set the 20 tokens that can be won            |
| `set_paused`        | Authority       | Emergency pause                              |
| `create_order`      | User            | Pay + create order (VRF request next)        |
| `fulfill_order`     | Executor / VRF  | Consume randomness → set rarity/token/value  |
| `claim_refund`      | User            | Refund if stuck past timeout                 |

## Rarity Derivation
From first 2 bytes of VRF output (mod 1000):
- 0-549   → Common (55%)
- 550-799 → Uncommon (25%)
- 800-919 → Rare (12%)
- 920-979 → Ultra Rare (6%)
- 980-997 → Secret Rare (1.8%)
- 998-999 → Legendary (0.2%)

## Next Contract Work
1. Real Switchboard On-Demand VRF CPI in `create_order`
2. Proper SOL payment + fee split
3. Stake / Vote accounts + instructions for $POKE
4. Access control on `fulfill_order` (only executor or VRF callback)
