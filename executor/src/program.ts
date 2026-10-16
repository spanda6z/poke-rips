/**
 * Anchor program client for Poke Rips.
 *
 * After `anchor build`, copy target/idl/poke_rips.json → executor/idl/poke_rips.json
 * and update PROGRAM_ID.
 */

import { AnchorProvider, Program, Wallet, Idl } from "@coral-xyz/anchor";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import * as fs from "fs";
import * as path from "path";

const PROGRAM_ID = new PublicKey(
  process.env.PROGRAM_ID || "PokeRips11111111111111111111111111111111111"
);

export function loadIdl(): Idl | null {
  const candidates = [
    path.join(__dirname, "../idl/poke_rips.json"),
    path.join(process.cwd(), "idl/poke_rips.json"),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) {
      return JSON.parse(fs.readFileSync(p, "utf8")) as Idl;
    }
  }
  return null;
}

export function createProgram(
  connection: Connection,
  payer: Keypair
): Program | null {
  const idl = loadIdl();
  if (!idl) {
    console.warn(
      "[program] No IDL found at executor/idl/poke_rips.json — fulfill_order RPC disabled"
    );
    return null;
  }
  const wallet = new Wallet(payer);
  const provider = new AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });
  return new Program(idl, provider);
}

export function configPda(programId = PROGRAM_ID): [PublicKey, number] {
  return PublicKey.findProgramAddressSync([Buffer.from("config")], programId);
}

export function orderPda(
  user: PublicKey,
  packId: number,
  programId = PROGRAM_ID
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("order"), user.toBuffer(), Buffer.from([packId])],
    programId
  );
}

/**
 * Call fulfill_order with 32 random bytes.
 */
export async function callFulfillOrder(
  program: Program,
  orderPubkey: PublicKey,
  randomBytes: number[]
): Promise<string> {
  const [config] = configPda();
  // @ts-expect-error IDL methods typed after build
  const sig = await program.methods
    .fulfillOrder(randomBytes)
    .accounts({
      config,
      order: orderPubkey,
    })
    .rpc();
  return sig;
}

/**
 * Fetch all Order accounts with status = Pending (0).
 * Requires IDL + deployed program.
 */
export async function fetchPendingOrders(
  program: Program
): Promise<
  Array<{
    pubkey: PublicKey;
    user: PublicKey;
    packId: number;
    status: number;
    vrfSeed: number[];
    priceLamports: bigint;
  }>
> {
  // @ts-expect-error account types from IDL
  const all = await program.account.order.all();
  return all
    .filter((o: any) => o.account.status === 0)
    .map((o: any) => ({
      pubkey: o.publicKey,
      user: o.account.user as PublicKey,
      packId: o.account.packId as number,
      status: o.account.status as number,
      vrfSeed: Array.from(o.account.vrfSeed as number[]),
      priceLamports: BigInt(o.account.priceLamports?.toString?.() ?? 0),
    }));
}
