# Deploy from your phone (no laptop)

Use **GitHub Actions** on the repo. Everything runs in the cloud.

## Step 1 — Open the repo on your phone

https://github.com/spanda6z/poke-rips

(Use the GitHub app or mobile browser.)

## Step 2 — (Recommended) Add a deployer key secret

If you already have a Solana keypair with JSON secret key:

1. GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret**
3. Name: `SOLANA_DEPLOYER_KEY`
4. Value: the full JSON array, e.g. `[12,34,56,...]`

If you skip this, the workflow generates a **new** key each run and tries a free devnet airdrop (sometimes rate-limited).

### How to get a keypair JSON without a laptop

Options:
- Use a friend’s machine once to run `solana-keygen new` and send you the JSON
- Use a mobile Solana wallet that can export (rare)
- Let the workflow create an ephemeral key and hope airdrop works

## Step 3 — Run the workflow

1. Repo → **Actions** tab
2. Left sidebar → **Deploy Devnet**
3. **Run workflow** → branch `main` → Run
4. Wait 5–15 minutes
5. Open the finished run → **Summary** shows **Program ID**
6. Download the **poke-rips-idl** artifact (IDL + program keypair)

## Step 4 — Frontend on Vercel (phone-friendly)

1. https://vercel.com → Import `spanda6z/poke-rips`
2. Root directory: `frontend`
3. Env var: `NEXT_PUBLIC_PROGRAM_ID` = the Program ID from the Actions summary
4. Deploy

You get a public URL you can open on your phone.

## Step 5 — Executor

The executor needs a always-on Node process (Railway / Render free tier works from phone signup):

1. Create a Railway/Render service from the `executor/` folder
2. Env:
   - `RPC_URL=https://api.devnet.solana.com`
   - `PROGRAM_ID=<from Actions>`
   - `EXECUTOR_SECRET_KEY=<JSON array of a funded key>`
3. Upload IDL file to `idl/poke_rips.json` (from the Actions artifact)

## After deploy

Someone still needs to call `initialize_config` once (script in `scripts/init-config.ts`). That can be a second small GitHub Action later if you want — say the word.

## Limits

- Devnet airdrops fail often; a funded `SOLANA_DEPLOYER_KEY` is more reliable
- Mainnet deploy should use a hardware / multisig key — not CI with a raw secret long-term
