# Smart Contract Outline (Anchor)

## Program ID
Replace `PokeRips11111111111111111111111111111111111` after running `anchor keys list`.

## Randomness Provider
**ORAO VRF** (Switchboard is deprecated as of Sept 25, 2026).

- Classic: `VRFzZoJdhFWL8rkvu87LpKM3RbcVezpMEc6X5GVDr7y`
- Callback: `VRFCBePmGTpZ234BhbzNNzmyg39Rgdd6VgdfhHwKypU`

See `docs/RANDOMNESS.md` for the full flow.

## Accounts

### Config
- authority, treasury, fee_bps, refund_timeout_slots
- paused, total_rips, total_volume_lamports
- top20: [Pubkey; 20]
- bump

### Order
- user, pack_id, price_lamports
- status (Pending / Fulfilled / Refunded)
- rarity, token_index, value_band
- created_slot, bump

## Instructions
| Instruction | Caller | Purpose |
|-------------|--------|---------|
| initialize_config | Authority | One-time setup |
| update_top20 | Authority | Set winnable tokens |
| set_paused | Authority | Emergency pause |
| create_order | User | Pay SOL + create order (request ORAO VRF) |
| fulfill_order | Executor | Consume random bytes → set result |
| claim_refund | User | Refund if stuck past timeout |

## Rarity Table (from first 2 bytes mod 1000)
- 0–549 Common (55%)
- 550–799 Uncommon (25%)
- 800–919 Rare (12%)
- 920–979 Ultra Rare (6%)
- 980–997 Secret Rare (1.8%)
- 998–999 Legendary (0.2%)

## Next Contract Work
1. CPI / client request to ORAO VRF on create_order
2. Store randomness account pubkey on Order
3. Restrict fulfill_order to executor or verified callback
4. Treasury as PDA for secure refunds
5. $POKE stake + vote instructions
