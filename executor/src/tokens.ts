/**
 * SPL token helpers — get/create ATA + transfer to user
 */

import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  createAssociatedTokenAccountIdempotentInstruction,
  createTransferCheckedInstruction,
  getAssociatedTokenAddressSync,
  getMint,
  getAccount,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

export function getAta(mint: PublicKey, owner: PublicKey): PublicKey {
  return getAssociatedTokenAddressSync(mint, owner, false, TOKEN_PROGRAM_ID);
}

/**
 * Ensure recipient has an ATA for `mint`. Pays rent from `payer`.
 */
export async function ensureAta(
  connection: Connection,
  payer: Keypair,
  mint: PublicKey,
  owner: PublicKey
): Promise<PublicKey> {
  const ata = getAta(mint, owner);
  const info = await connection.getAccountInfo(ata, "confirmed");
  if (info) return ata;

  const ix = createAssociatedTokenAccountIdempotentInstruction(
    payer.publicKey,
    ata,
    owner,
    mint
  );
  const tx = new Transaction().add(ix);
  await sendAndConfirmTransaction(connection, tx, [payer], {
    commitment: "confirmed",
  });
  return ata;
}

/**
 * Transfer `amount` (raw units) of `mint` from payer's ATA to owner's ATA.
 */
export async function transferTokensToUser(
  connection: Connection,
  payer: Keypair,
  mint: PublicKey,
  owner: PublicKey,
  amount: bigint
): Promise<string> {
  if (amount <= 0n) throw new Error("Transfer amount must be > 0");

  const mintInfo = await getMint(connection, mint);
  const sourceAta = getAta(mint, payer.publicKey);
  const destAta = await ensureAta(connection, payer, mint, owner);

  // Verify source has balance
  const sourceAccount = await getAccount(connection, sourceAta);
  if (sourceAccount.amount < amount) {
    throw new Error(
      `Insufficient token balance: have ${sourceAccount.amount}, need ${amount}`
    );
  }

  const ix = createTransferCheckedInstruction(
    sourceAta,
    mint,
    destAta,
    payer.publicKey,
    amount,
    mintInfo.decimals
  );

  const tx = new Transaction().add(ix);
  const sig = await sendAndConfirmTransaction(connection, tx, [payer], {
    commitment: "confirmed",
  });
  return sig;
}
