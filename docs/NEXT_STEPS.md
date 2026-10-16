# Next Implementation Steps

## Priority Order

### 1. Frontend Polish
- [x] Basic Shop + Pack cards
- [x] Navbar + Wallet
- [x] Collection / Vote / Stats / Fair pages
- [x] Rip animation + card reveal modal
- [x] Mobile bottom nav
- [x] Demo collection cards + vote board
- [ ] Real pack artwork integration
- [ ] Polish animations further

### 2. Smart Contract
- [x] Config + Order accounts
- [x] initialize_config / update_top20 / create_order skeleton
- [ ] Integrate Switchboard On-Demand VRF
- [ ] fulfill_order logic (rarity + token selection)
- [ ] Refund path
- [ ] Stake + Vote instructions

### 3. Executor Service
- Node service that:
  - Watches new Orders
  - Waits for VRF reveal
  - Calls Jupiter for the winning token
  - Transfers tokens + updates order status

### 4. Token Launch
- Deploy $POKE
- Seed liquidity
- Enable staking + voting

### 5. Marketing Assets
- Final logo (SVG)
- Pack PNGs for all tiers
- Social banners
- Announcement thread
