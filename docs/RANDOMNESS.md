# Randomness Strategy

## Important Update (Oct 2026)

**Switchboard shut down on September 25, 2026.**  
All previous references to Switchboard VRF are deprecated.

## Current Choice: ORAO VRF

- Program (classic): `VRFzZoJdhFWL8rkvu87LpKM3RbcVezpMEc6X5GVDr7y`
- Program (callback): `VRFCBePmGTpZ234BhbzNNzmyg39Rgdd6VgdfhHwKypU`
- Fee: ~0.001 SOL per request
- Latency: sub-second to ~20s
- Model: multi-node EdDSA VRF with Byzantine quorum
- SDK: `@orao-network/solana-vrf` + Rust crate `orao-solana-vrf`

## Flow for Poke Rips

1. User calls `create_order` and pays SOL
2. Program (or client) requests ORAO randomness with a unique seed tied to the order
3. ORAO nodes fulfill the randomness account
4. Executor detects fulfilled randomness
5. Executor calls `fulfill_order` with the 32 random bytes
6. Contract derives rarity + token_index + value_band
7. Executor performs Jupiter swap and sends tokens to user

## Alternatives considered
- Pyth Entropy (commit-reveal) — viable backup
- Pure blockhash schemes — too weak for real money packs

## Resources
- https://orao.network/solana-vrf
- https://github.com/orao-network/solana-vrf
