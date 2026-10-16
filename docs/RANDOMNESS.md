# Randomness Strategy — ORAO VRF

## Why not Switchboard?
Switchboard shut down on **September 25, 2026**. Do not integrate it.

## Provider: ORAO VRF

| Item | Value |
|------|--------|
| Classic program | `VRFzZoJdhFWL8rkvu87LpKM3RbcVezpMEc6X5GVDr7y` |
| Callback program | `VRFCBePmGTpZ234BhbzNNzmyg39Rgdd6VgdfhHwKypU` |
| Fee | ~0.001 SOL |
| Latency | sub-second to ~20s |
| JS SDK | `@orao-network/solana-vrf` |
| Rust crate | `orao-solana-vrf` (feature `cpi`) |

## Seed convention

```
vrf_seed = sha256(order_pubkey)
```

Stored on the `Order` account as `vrf_seed` so executor and client always agree.

## End-to-end flow

1. **User** calls `create_order(pack_id, price_lamports, vrf_seed)` and pays SOL
2. **Client or Executor** calls ORAO `request(seed)` (JS: `vrf.request(seed).rpc()`)
3. ORAO nodes fulfill the randomness account (PDA from seed)
4. **Executor** runs `waitFulfilled(seed)` → gets 64 bytes
5. **Executor** calls `fulfill_order(first_32_bytes)` on our program
6. Contract sets `rarity`, `token_index`, `value_band`
7. **Executor** Jupiter-swaps SOL → winning token and delivers to user

## JS quick reference

```ts
import { Orao } from "@orao-network/solana-vrf";

const vrf = new Orao(provider);
const [seed, tx] = await vrf.request(seedBuffer).rpc();
const result = await vrf.waitFulfilled(seed);
// result.randomness → 64 bytes
```

## On-chain CPI (optional later)

```rust
orao_solana_vrf = { version = "0.4", default-features = false, features = ["cpi"] }

// In create_order after payment:
orao_solana_vrf::cpi::request_v2(cpi_ctx, vrf_seed)?;
```

Accounts needed: payer, network_state, treasury, request PDA, system_program.

## Security notes
- Always take payment at commit time (we do — on `create_order`)
- Never let the user choose random bytes
- Restrict who can call `fulfill_order` (executor key or ORAO callback)
