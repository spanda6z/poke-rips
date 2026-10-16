/**
 * On-chain program constants for the frontend.
 * Update PROGRAM_ID after deploy.
 */

import { PublicKey } from "@solana/web3.js";
import { PACKS } from "./constants";

export const PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_PROGRAM_ID ||
    "PokeRips11111111111111111111111111111111111"
);

export function configPda(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync([Buffer.from("config")], PROGRAM_ID);
}

export function treasuryPda(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync([Buffer.from("treasury")], PROGRAM_ID);
}

export function orderPda(user: PublicKey, packId: number): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("order"), user.toBuffer(), Buffer.from([packId])],
    PROGRAM_ID
  );
}

/** Pack price in lamports (1 SOL = 1e9) */
export function packPriceLamports(packId: string): number {
  const pack = PACKS.find((p) => p.id === packId);
  if (!pack) return 0;
  return Math.floor(pack.priceSol * 1_000_000_000);
}

/** Derive vrf_seed = sha256(order_pubkey) — matches executor */
export async function deriveVrfSeed(orderPubkey: PublicKey): Promise<Uint8Array> {
  const data = orderPubkey.toBytes();
  const hash = await crypto.subtle.digest("SHA-256", data);
  return new Uint8Array(hash);
}
