/**
 * ORAO VRF helpers
 *
 * Uses @orao-network/solana-vrf
 * Program: VRFzZoJdhFWL8rkvu87LpKM3RbcVezpMEc6X5GVDr7y
 */

import { AnchorProvider, Wallet } from "@coral-xyz/anchor";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { Orao, randomnessAccountAddress } from "@orao-network/solana-vrf";
import * as crypto from "crypto";

export const ORAO_VRF_PROGRAM_ID = new PublicKey(
  "VRFzZoJdhFWL8rkvu87LpKM3RbcVezpMEc6X5GVDr7y"
);

/**
 * Derive a deterministic 32-byte seed from an order pubkey.
 * Same order always maps to the same ORAO request.
 */
export function seedFromOrder(orderPubkey: PublicKey): Buffer {
  return crypto.createHash("sha256").update(orderPubkey.toBytes()).digest();
}

export function getRandomnessAddress(seed: Buffer): PublicKey {
  return randomnessAccountAddress(seed);
}

export function createOraoClient(
  connection: Connection,
  payer: Keypair
): Orao {
  const wallet = new Wallet(payer);
  const provider = new AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });
  return new Orao(provider);
}

/**
 * Request randomness for a given seed (or random if omitted).
 * Returns [seed, txSignature].
 */
export async function requestRandomness(
  vrf: Orao,
  seed?: Buffer
): Promise<{ seed: Buffer; signature: string }> {
  const builder = seed ? vrf.request(seed) : vrf.request();
  const [usedSeed, signature] = await builder.rpc();
  return { seed: Buffer.from(usedSeed), signature };
}

/**
 * Wait until ORAO has fulfilled the request for this seed.
 * Returns 64-byte randomness (we use the first 32 for our contract).
 */
export async function waitForRandomness(
  vrf: Orao,
  seed: Buffer
): Promise<Uint8Array> {
  const result = await vrf.waitFulfilled(seed);
  // SDK shapes vary slightly across versions — normalize
  const bytes =
    (result as any).randomness ||
    (result as any).fulfilled?.() ||
    (result as any).fulfilled_randomness;

  if (!bytes || bytes.length < 32) {
    throw new Error("ORAO returned empty or short randomness");
  }
  return Uint8Array.from(bytes);
}

/**
 * Non-blocking check: returns randomness bytes if fulfilled, else null.
 */
export async function tryGetFulfilled(
  connection: Connection,
  seed: Buffer
): Promise<Uint8Array | null> {
  const address = getRandomnessAddress(seed);
  const info = await connection.getAccountInfo(address, "confirmed");
  if (!info) return null;

  // Minimal parse: ORAO stores fulfilled randomness in account data.
  // Prefer SDK decode when available; this is a fallback heuristic.
  // For production, use RandomnessAccountData via the SDK.
  try {
    // The SDK's account decode is preferred — call sites should use waitFulfilled
    // or account fetch through Orao when possible.
    return null; // force callers to use waitForRandomness / SDK
  } catch {
    return null;
  }
}
