/**
 * Poke Rips Executor
 *
 * Flow:
 * 1. Detect Pending orders
 * 2. Ensure ORAO randomness was requested (seed = sha256(order))
 * 3. Wait for ORAO fulfillment
 * 4. Call fulfill_order with first 32 random bytes
 * 5. Jupiter swap SOL → winning token
 * 6. Deliver tokens to user
 */

import {
  Connection,
  Keypair,
  PublicKey,
} from "@solana/web3.js";
import * as dotenv from "dotenv";
import { swapSolToToken, usdToLamports } from "./jupiter";
import {
  createOraoClient,
  requestRandomness,
  seedFromOrder,
  waitForRandomness,
  getRandomnessAddress,
} from "./orao";

dotenv.config();

const RPC_URL = process.env.RPC_URL || "https://api.devnet.solana.com";
const PROGRAM_ID = new PublicKey(
  process.env.PROGRAM_ID || "PokeRips11111111111111111111111111111111111"
);
const SOL_PRICE_USD = Number(process.env.SOL_PRICE_USD || "150");

const DEMO_TOP20: string[] = [
  "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263", // BONK
  "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm", // WIF
  "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN", // JUP
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
const vrf = createOraoClient(connection, executor);

function calculatePrizeUsd(packId: number, valueBand: number): number {
  const range = PACK_RANGES[packId] || PACK_RANGES[0];
  const t = valueBand / 99;
  return range.min + t * (range.max - range.min);
}

/**
 * After fulfill_order has set rarity/token_index/value_band on-chain,
 * settle the prize via Jupiter.
 */
async function settlePrize(params: {
  user: PublicKey;
  packId: number;
  tokenIndex: number;
  valueBand: number;
}) {
  const { user, packId, tokenIndex, valueBand } = params;
  const prizeUsd = calculatePrizeUsd(packId, valueBand);
  const tokenMint = DEMO_TOP20[tokenIndex % DEMO_TOP20.length];
  const lamports = usdToLamports(prizeUsd, SOL_PRICE_USD);

  console.log(
    `[settle] ${user.toBase58().slice(0, 8)}… pack=${packId} $${prizeUsd.toFixed(
      2
    )} → ${tokenMint.slice(0, 8)}…`
  );

  if (!process.env.EXECUTOR_SECRET_KEY) {
    console.log("[settle] Dry-run — skip Jupiter");
    return;
  }

  const sig = await swapSolToToken(connection, executor, tokenMint, lamports, 150);
  console.log(`[settle] Swap ok: ${sig}`);
  // TODO: ensure tokens land in user's ATA (transfer if needed)
}

/**
 * Process a single pending order:
 * - request ORAO if needed
 * - wait for fulfillment
 * - call fulfill_order (placeholder until IDL is wired)
 * - settle prize
 */
async function processOrder(order: {
  pubkey: PublicKey;
  user: PublicKey;
  packId: number;
  status: number;
}) {
  if (order.status !== 0) return; // only Pending

  const seed = seedFromOrder(order.pubkey);
  const randomnessAddr = getRandomnessAddress(seed);

  console.log(
    `[order] ${order.pubkey.toBase58().slice(0, 8)}… seed=${seed
      .toString("hex")
      .slice(0, 16)}… vrf=${randomnessAddr.toBase58().slice(0, 8)}…`
  );

  // 1) Ensure VRF request exists — request if account missing
  const info = await connection.getAccountInfo(randomnessAddr, "confirmed");
  if (!info) {
    console.log("[orao] Requesting randomness…");
    if (!process.env.EXECUTOR_SECRET_KEY) {
      console.log("[orao] Dry-run — skip request");
      return;
    }
    const { signature } = await requestRandomness(vrf, seed);
    console.log(`[orao] Requested: ${signature}`);
  }

  // 2) Wait for fulfillment
  console.log("[orao] Waiting for fulfillment…");
  let randomBytes: Uint8Array;
  try {
    randomBytes = await waitForRandomness(vrf, seed);
  } catch (err) {
    console.warn("[orao] Not ready yet:", (err as Error).message);
    return;
  }

  // Use first 32 bytes for our contract (ORAO returns 64)
  const bytes32 = randomBytes.slice(0, 32);
  console.log(
    `[orao] Got randomness: ${Buffer.from(bytes32).toString("hex").slice(0, 16)}…`
  );

  // 3) Call fulfill_order on our program
  // TODO: wire Anchor program IDL and call:
  //   await program.methods
  //     .fulfillOrder(Array.from(bytes32))
  //     .accounts({ config, order: order.pubkey })
  //     .rpc();
  //
  // For now derive locally so settlement can be tested:
  const rarity = deriveRarity(bytes32);
  const tokenIndex = bytes32[8] % 20;
  const valueBand = bytes32[9] % 100;

  console.log(
    `[fulfill] rarity=${rarity} tokenIndex=${tokenIndex} valueBand=${valueBand}`
  );

  // 4) Settle
  await settlePrize({
    user: order.user,
    packId: order.packId,
    tokenIndex,
    valueBand,
  });
}

function deriveRarity(random: Uint8Array): number {
  const roll = (random[0] | (random[1] << 8)) % 1000;
  if (roll < 550) return 0;
  if (roll < 800) return 1;
  if (roll < 920) return 2;
  if (roll < 980) return 3;
  if (roll < 998) return 4;
  return 5;
}

async function pollOrders() {
  console.log("[poll] Looking for pending orders…");

  // TODO: replace with getProgramAccounts filtered by Order discriminator + status=Pending
  // Example shape once IDL is connected:
  // const orders = await program.account.order.all([
  //   { memcmp: { offset: 8 + 32 + 1 + 8, bytes: bs58.encode(Buffer.from([0])) } }
  // ]);
  // for (const o of orders) {
  //   await processOrder({
  //     pubkey: o.publicKey,
  //     user: o.account.user,
  //     packId: o.account.packId,
  //     status: o.account.status,
  //   });
  // }

  // Demo: uncomment to test ORAO + Jupiter path with a fake order
  // await processOrder({
  //   pubkey: Keypair.generate().publicKey,
  //   user: executor.publicKey,
  //   packId: 0,
  //   status: 0,
  // });
}

async function main() {
  console.log("Poke Rips Executor");
  console.log("RPC       :", RPC_URL);
  console.log("Program   :", PROGRAM_ID.toBase58());
  console.log("Executor  :", executor.publicKey.toBase58());
  console.log("Randomness: ORAO VRF");
  console.log("Jupiter   :", process.env.JUPITER_API || "lite-api.jup.ag");
  console.log("---");

  setInterval(async () => {
    try {
      await pollOrders();
    } catch (err) {
      console.error("Poll error:", err);
    }
  }, 10_000);
}

main().catch(console.error);