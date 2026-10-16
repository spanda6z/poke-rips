/**
 * Poke Rips Executor Service
 *
 * Responsibilities:
 * 1. Watch for new OrderCreated events / accounts
 * 2. Wait until VRF randomness is available
 * 3. Call fulfill_order on the program
 * 4. Perform Jupiter swap for the winning token
 * 5. Transfer tokens to the user
 * 6. Handle edge cases & refunds
 *
 * This is a skeleton. Wire up real Switchboard + Jupiter next.
 */

import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import * as dotenv from "dotenv";

dotenv.config();

const RPC_URL = process.env.RPC_URL || "https://api.devnet.solana.com";
const PROGRAM_ID = new PublicKey(
  process.env.PROGRAM_ID || "PokeRips11111111111111111111111111111111111"
);

const connection = new Connection(RPC_URL, "confirmed");

// Load executor keypair from env (base58 or file path)
function loadKeypair(): Keypair {
  const secret = process.env.EXECUTOR_SECRET_KEY;
  if (!secret) {
    console.warn("No EXECUTOR_SECRET_KEY set — running in dry-run mode");
    return Keypair.generate();
  }
  // Expect JSON array string for now
  const parsed = JSON.parse(secret);
  return Keypair.fromSecretKey(Uint8Array.from(parsed));
}

const executor = loadKeypair();

console.log("Poke Rips Executor starting...");
console.log("RPC:", RPC_URL);
console.log("Program:", PROGRAM_ID.toBase58());
console.log("Executor:", executor.publicKey.toBase58());

async function pollOrders() {
  // TODO:
  // 1. Fetch all Order accounts with status = Pending
  // 2. For each, check if VRF randomness is ready
  // 3. Call fulfill_order with the random bytes
  // 4. Read the resulting rarity + token_index + value_band
  // 5. Calculate exact token amount from pack range + value_band
  // 6. Execute Jupiter swap (SOL → winning token)
  // 7. Transfer tokens to order.user
  // 8. Mark internal state as delivered

  console.log("[poll] Checking for pending orders...");
}

async function main() {
  // Simple polling loop — replace with websocket / accountSubscribe later
  setInterval(async () => {
    try {
      await pollOrders();
    } catch (err) {
      console.error("Poll error:", err);
    }
  }, 8_000);

  console.log("Executor is running. Press Ctrl+C to stop.");
}

main().catch(console.error);