/**
 * Poke Rips Executor — full settlement loop
 */

import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import * as dotenv from "dotenv";
import { swapSolToToken, usdToLamports, getQuote } from "./jupiter";
import {
  createOraoClient,
  requestRandomness,
  seedFromOrder,
  waitForRandomness,
  getRandomnessAddress,
} from "./orao";
import { transferTokensToUser, getAta } from "./tokens";
import {
  createProgram,
  callFulfillOrder,
  fetchPendingOrders,
} from "./program";
import { getAccount } from "@solana/spl-token";

dotenv.config();

const RPC_URL = process.env.RPC_URL || "https://api.devnet.solana.com";
const PROGRAM_ID = new PublicKey(
  process.env.PROGRAM_ID || "PokeRips11111111111111111111111111111111111"
);
const SOL_PRICE_USD = Number(process.env.SOL_PRICE_USD || "150");

const DEMO_TOP20: string[] = [
  "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
  "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
  "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
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
const program = createProgram(connection, executor);

function calculatePrizeUsd(packId: number, valueBand: number): number {
  const range = PACK_RANGES[packId] || PACK_RANGES[0];
  return range.min + (valueBand / 99) * (range.max - range.min);
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

async function settlePrize(params: {
  user: PublicKey;
  packId: number;
  tokenIndex: number;
  valueBand: number;
}) {
  const { user, packId, tokenIndex, valueBand } = params;
  const prizeUsd = calculatePrizeUsd(packId, valueBand);
  const tokenMint = new PublicKey(DEMO_TOP20[tokenIndex % DEMO_TOP20.length]);
  const lamports = usdToLamports(prizeUsd, SOL_PRICE_USD);

  console.log(
    `[settle] $${prizeUsd.toFixed(2)} → ${tokenMint.toBase58().slice(0, 8)}… for ${user.toBase58().slice(0, 8)}…`
  );

  if (!process.env.EXECUTOR_SECRET_KEY) {
    console.log("[settle] Dry-run");
    return;
  }

  // 1) Swap SOL → token into executor wallet
  await swapSolToToken(connection, executor, tokenMint.toBase58(), lamports, 150);

  // 2) Read how many tokens we received
  const sourceAta = getAta(tokenMint, executor.publicKey);
  let amount = 0n;
  try {
    const acc = await getAccount(connection, sourceAta);
    amount = acc.amount;
  } catch {
    console.warn("[settle] No token balance after swap");
    return;
  }

  // 3) Transfer full balance to user (simple; refine to exact outAmount later)
  if (amount > 0n) {
    const sig = await transferTokensToUser(
      connection,
      executor,
      tokenMint,
      user,
      amount
    );
    console.log(`[settle] Transferred to user: ${sig}`);
  }
}

async function processOrder(order: {
  pubkey: PublicKey;
  user: PublicKey;
  packId: number;
  status: number;
  vrfSeed?: number[];
}) {
  if (order.status !== 0) return;

  const seed = order.vrfSeed
    ? Buffer.from(order.vrfSeed)
    : seedFromOrder(order.pubkey);
  const randomnessAddr = getRandomnessAddress(seed);

  console.log(
    `[order] ${order.pubkey.toBase58().slice(0, 8)}… vrf=${randomnessAddr.toBase58().slice(0, 8)}…`
  );

  const info = await connection.getAccountInfo(randomnessAddr, "confirmed");
  if (!info) {
    if (!process.env.EXECUTOR_SECRET_KEY) {
      console.log("[orao] Dry-run skip request");
      return;
    }
    const { signature } = await requestRandomness(vrf, seed);
    console.log(`[orao] Requested: ${signature}`);
  }

  let randomBytes: Uint8Array;
  try {
    randomBytes = await waitForRandomness(vrf, seed);
  } catch (err) {
    console.warn("[orao] Not ready:", (err as Error).message);
    return;
  }

  const bytes32 = randomBytes.slice(0, 32);
  const rarity = deriveRarity(bytes32);
  const tokenIndex = bytes32[8] % 20;
  const valueBand = bytes32[9] % 100;

  console.log(
    `[fulfill] rarity=${rarity} token=${tokenIndex} band=${valueBand}`
  );

  // On-chain fulfill if IDL is present
  if (program) {
    try {
      const sig = await callFulfillOrder(
        program,
        order.pubkey,
        Array.from(bytes32)
      );
      console.log(`[fulfill] On-chain: ${sig}`);
    } catch (err) {
      console.error("[fulfill] RPC failed:", err);
      return;
    }
  } else {
    console.log("[fulfill] No IDL — local derive only");
  }

  await settlePrize({
    user: order.user,
    packId: order.packId,
    tokenIndex,
    valueBand,
  });
}

async function pollOrders() {
  console.log("[poll] …");

  if (program) {
    try {
      const pending = await fetchPendingOrders(program);
      console.log(`[poll] ${pending.length} pending order(s)`);
      for (const o of pending) {
        await processOrder(o);
      }
      return;
    } catch (err) {
      console.warn("[poll] fetchPendingOrders failed:", (err as Error).message);
    }
  }

  // No program / no orders — idle
}

async function main() {
  console.log("Poke Rips Executor");
  console.log("RPC      :", RPC_URL);
  console.log("Program  :", PROGRAM_ID.toBase58());
  console.log("Executor :", executor.publicKey.toBase58());
  console.log("IDL      :", program ? "loaded" : "missing");
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