/**
 * Jupiter Swap helpers (v6 / lite API)
 */

import {
  Connection,
  Keypair,
  VersionedTransaction,
  PublicKey,
} from "@solana/web3.js";

const SOL_MINT = "So11111111111111111111111111111111111111112";
// Prefer lite endpoint; fall back possible to quote-api.jup.ag/v6
const JUPITER_BASE = process.env.JUPITER_API || "https://lite-api.jup.ag/swap/v1";

export interface QuoteResponse {
  inputMint: string;
  inAmount: string;
  outputMint: string;
  outAmount: string;
  otherAmountThreshold: string;
  swapMode: string;
  slippageBps: number;
  routePlan: unknown[];
  [key: string]: unknown;
}

export async function getQuote(
  outputMint: string,
  amountLamports: number,
  slippageBps = 100
): Promise<QuoteResponse> {
  const params = new URLSearchParams({
    inputMint: SOL_MINT,
    outputMint,
    amount: String(amountLamports),
    slippageBps: String(slippageBps),
  });

  const res = await fetch(`${JUPITER_BASE}/quote?${params}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Jupiter quote failed (${res.status}): ${text}`);
  }
  return res.json();
}

export async function getSwapTransaction(
  quote: QuoteResponse,
  userPublicKey: string
): Promise<string> {
  const res = await fetch(`${JUPITER_BASE}/swap`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      quoteResponse: quote,
      userPublicKey,
      wrapAndUnwrapSol: true,
      dynamicComputeUnitLimit: true,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Jupiter swap failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  if (!data.swapTransaction) {
    throw new Error("No swapTransaction in Jupiter response");
  }
  return data.swapTransaction as string;
}

/**
 * Execute a SOL → token swap and return the signature.
 * `amountLamports` is how much SOL (in lamports) to spend.
 */
export async function swapSolToToken(
  connection: Connection,
  payer: Keypair,
  outputMint: string,
  amountLamports: number,
  slippageBps = 100
): Promise<string> {
  const quote = await getQuote(outputMint, amountLamports, slippageBps);
  console.log(
    `[jupiter] Quote: ${amountLamports} lamports SOL → ${quote.outAmount} of ${outputMint}`
  );

  const swapTxBase64 = await getSwapTransaction(
    quote,
    payer.publicKey.toBase58()
  );

  const txBuf = Buffer.from(swapTxBase64, "base64");
  const tx = VersionedTransaction.deserialize(txBuf);
  tx.sign([payer]);

  const sig = await connection.sendTransaction(tx, {
    skipPreflight: false,
    maxRetries: 3,
  });

  const latest = await connection.getLatestBlockhash();
  await connection.confirmTransaction(
    {
      signature: sig,
      blockhash: latest.blockhash,
      lastValidBlockHeight: latest.lastValidBlockHeight,
    },
    "confirmed"
  );

  console.log(`[jupiter] Swap confirmed: ${sig}`);
  return sig;
}

/**
 * Rough helper: convert a USD target into SOL lamports using a simple price.
 * In production, fetch live SOL/USD from Pyth or Jupiter.
 */
export function usdToLamports(usd: number, solPriceUsd: number): number {
  const solAmount = usd / solPriceUsd;
  return Math.floor(solAmount * 1_000_000_000);
}
