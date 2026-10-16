# Next Implementation Steps

## Completed
- [x] Brand, tokenomics, architecture, marketing
- [x] Frontend MVP + rip animation + mobile nav
- [x] Smart contract core + vrf_seed
- [x] ORAO VRF helpers + processOrder path
- [x] Jupiter quote + swap
- [x] Token ATA ensure + transfer to user
- [x] Anchor program client + pending order fetch
- [x] Stake/vote account skeleton + docs

## Before mainnet
- [ ] `anchor build` → copy IDL to `executor/idl/poke_rips.json`
- [ ] Deploy program + initialize_config
- [ ] Fund executor with SOL for swaps + ORAO fees
- [ ] Set real Top 20 mints
- [ ] Devnet E2E: create_order → ORAO → fulfill → Jupiter → user ATA
- [ ] Restrict fulfill_order to executor pubkey
- [ ] Treasury as PDA for refunds
- [ ] Implement stake_poke / cast_vote with real $POKE mint
- [ ] Final pack art + logo SVG
- [ ] Mainnet deploy + token launch
