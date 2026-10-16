# Poke Rips Executor

Background service that settles rips.

## Flow
1. Detect new `Order` accounts in `Pending` state
2. Wait for Switchboard VRF reveal
3. Call `fulfill_order` with the random bytes
4. Calculate prize (rarity + value band + pack range)
5. Jupiter swap SOL → winning token from Top 20
6. Transfer tokens to the user

## Setup
```bash
cd executor
cp .env.example .env
# fill in keys
npm install
npm run dev
```

## Notes
- Currently a dry-run skeleton
- Next: wire real Switchboard account parsing + Jupiter Quote/Swap API
