# Next Implementation Steps

## Completed
- [x] Brand, tokenomics, architecture, marketing
- [x] Frontend MVP + rip animation + mobile nav
- [x] Smart contract core (payments, fulfill, refund, vrf_seed)
- [x] Pivot to ORAO VRF
- [x] Jupiter quote + swap helpers
- [x] ORAO request / wait / seed helpers in executor
- [x] processOrder path (request → wait → derive → settle)

## Remaining
- [ ] Wire Anchor IDL in executor → real `fulfill_order` RPC
- [ ] `getProgramAccounts` for Pending orders
- [ ] Transfer swapped tokens to user ATA
- [ ] Optional: ORAO CPI inside `create_order`
- [ ] Treasury as PDA
- [ ] $POKE stake + vote
- [ ] Final pack art + logo
- [ ] Devnet E2E test
- [ ] Mainnet + token launch
