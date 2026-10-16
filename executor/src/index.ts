/**
 * Poke Rips Executor
 *
 * Settlement flow:
 * 1. Detect Pending orders
 * 2. Wait for ORAO VRF fulfillment
 * 3. Call fulfill_order with random bytes
 * 4. Calculate prize USD from pack + value_band
 * 5. Jupiter swap SOL → winning token
 * 6. Transfer tokens to user (or swap directly into user ATA)
 */

import {
  Connection,
  Keypair,
  PublicKey,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import * as dotenv from "dotenv";
import { swapSolToToken, usdToLamports } from "./jupiter";

dotenv.config();

const RPC_URL = process.env.RPC_URL || "https://api.devnet.solana.com";
const PROGRAM_ID = new PublicKey(
  process.env.PROGRAM_ID || "PokeRips11111111111111111111111111111111111"
);

// Demo Top 20 — replace with on-chain config.top20 reads
const DEMO_TOP20: string[] = [
  "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263", // BONK
  "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm", // WIF
  "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",  // JUP
  // ... fill remaining with real mints
];

const PACK_RANGES: Record<number, { min: number; max: number }> = {
  0: { min: 1, max: 100 },
  1: { min: 5, max: 250 },
  2: { min: 10, max: 500 },
  3: { min: 25, max: 1500 },
  4: { min: 100, max: 10000 },
};

const connection = new Connection(RPC_URL, "confirmed");

function loadKeypair(): Keypair {
  const secret = process.env.EXECUTOR_SECRET_KEY;
  if (!secret) {
    console.warn("No EXECUTOR_SECRET_KEY — dry-run mode");
    return Keypair.generate();
  }
  return Keypair.fromSecretKey(Uint8Array.from(JSON.parse(secret)));
}

const executor = loadKeypair();

function calculatePrizeUsd(packId: number, valueBand: number): number {
  const range = PACK_RANGES[packId] || PACK_RANGES[0];
  const t = valueBand / 99;
  return range.min + t * (range.max - range.min);
}

/**
 * Core settlement for one fulfilled order.
 * Called after random bytes are known and fulfill_order has been invoked.
 */
async function settlePrize(params: {
  user: PublicKey;
  packId: number;
  tokenIndex: number;
  valueBand: number;
  solPriceUsd: number;
}) {
  const { user, packId, tokenIndex, valueBand, solPriceUsd } = params;

  const prizeUsd = calculatePrizeUsd(packId, valueBand);
  const tokenMint = DEMO_TOP20[tokenIndex % DEMO_TOP20.length];
  const lamports = usdToLamports(prizeUsd, solPriceUsd);

  console.log(
    `[settle] User ${user.toBase58()} | Pack ${packId} | $${prizeUsd.toFixed(
      2
    )} → ${tokenMint}`
  );

  if (!process.env.EXECUTOR_SECRET_KEY) {
    console.log("[settle] Dry-run — skipping real Jupiter swap");
    return;
  }

  // In production you may want to:
  // - Swap into a treasury ATA then transfer to user, OR
  // - Build a Jupiter swap that lands directly in the user's ATA
  // For simplicity we swap with the executor key and then transfer.
  const sig = await swapSolToToken(
    connection,
    executor,
    tokenMint,
    lamports,
    150 // 1.5% slippage for volatile meme tokens
  );

  console.log(`[settle] Done. Swap sig: ${sig}`);
  // TODO: transfer received tokens to `user` if not already in their ATA
}

async function pollOrders() {
  console.log("[poll] Scanning for pending / newly fulfilled orders...");

  // TODO (ORAO integration):
  // 1. Fetch Order accounts with status = Pending
  // 2. For each, derive / look up the associated ORAO randomness account (seed = order key or hash)
  // 3. Read RandomnessAccountData — if fulfilled, extract 32 bytes
  // 4. Call program.methods.fulfillOrder(Array.from(bytes)).accounts({...}).rpc()
  // 5. Call settlePrize({ user, packId, tokenIndex, valueBand, solPriceUsd })

  // Placeholder demo call (remove in production):
  // await settlePrize({
  //   user: new PublicKey("..."),
  //   packId: 0,
  //   tokenIndex: 0,
  //   valueBand: 50,
  //   solPriceUsd: 150,
  // });
}

async function main() {
  console.log("Poke Rips Executor");
  console.log("RPC      :", RPC_URL);
  console.log("Program  :", PROGRAM_ID.toBase58());
  console.log("Executor :", executor.publicKey.toBase58());
  console.log("Randomness: ORAO VRF (Switchboard is deprecated)");
  console.log("---");

  setInterval(async () => {
    try {
      await pollOrders();
    } catch (err) {
      console.error("Poll error:", err);
    }
  }, 8_000);
}

main().catch(console.error);