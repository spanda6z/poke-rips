# Poke Rips Executor

Settles rips after randomness is available.

## Stack
- **Randomness**: ORAO VRF (Switchboard shut down Sept 2026)
- **Swaps**: Jupiter (lite-api / v6 compatible)

## Flow
1. Detect `Order` accounts in `Pending`
2. Wait for ORAO randomness account to be fulfilled
3. Call `fulfill_order` with the 32 random bytes
4. Calculate prize USD from pack range + `value_band`
5. Jupiter swap SOL → winning token from Top 20
6. Deliver tokens to the user

## Setup
```bash
cd executor
cp .env.example .env
# fill EXECUTOR_SECRET_KEY (JSON byte array) and RPC
npm install
npm run dev
```

## Notes
- `src/jupiter.ts` contains working quote + swap helpers
- ORAO account parsing still needs to be wired (see TODOs in `index.ts`)
- Keep executor wallet funded with SOL for swaps + fees
