/**
 * Poke Rips Executor
 *
 * Full settlement flow (skeleton with clear next steps):
 * 1. Detect Pending orders
 * 2. Wait for VRF randomness
 * 3. Call fulfill_order
 * 4. Calculate prize amount from pack range + value_band
 * 5. Jupiter swap SOL → winning token
 * 6. Transfer tokens to user
 */

import { Connection, Keypair, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import * as dotenv from "dotenv";

dotenv.config();

const RPC_URL = process.env.RPC_URL || "https://api.devnet.solana.com";
const PROGRAM_ID = new PublicKey(
  process.env.PROGRAM_ID || "PokeRips11111111111111111111111111111111111"
);

const PACK_RANGES: Record<number, { min: number; max: number }> = {
  0: { min: 1, max: 100 },      // Micro
  1: { min: 5, max: 250 },      // Mini
  2: { min: 10, max: 500 },     // Starter
  3: { min: 25, max: 1500 },    // Degen
  4: { min: 100, max: 10000 },  // Whale
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
  // valueBand 0-99 maps linearly across the range for now
  const t = valueBand / 99;
  return range.min + t * (range.max - range.min);
}

async function pollOrders() {
  console.log("[poll] Scanning for pending orders...");

  // TODO implementation steps:
  // 1. getProgramAccounts filtered by Order discriminator + status = Pending
  // 2. For each order, check associated VRF account for revealed randomness
  // 3. program.methods.fulfillOrder(Array.from(randomBytes)).accounts({...}).rpc()
  // 4. Read order.rarity, order.token_index, order.value_band
  // 5. Look up token mint from on-chain top20[token_index]
  // 6. const usdValue = calculatePrizeUsd(order.pack_id, order.value_band)
  // 7. Fetch Jupiter quote for usdValue worth of the token
  // 8. Execute swap
  // 9. Transfer resulting tokens to order.user
  // 10. Log success + emit metrics
}

async function main() {
  console.log("Poke Rips Executor");
  console.log("RPC      :", RPC_URL);
  console.log("Program  :", PROGRAM_ID.toBase58());
  console.log("Executor :", executor.publicKey.toBase58());
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