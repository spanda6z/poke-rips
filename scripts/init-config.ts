/**
 * One-time initialize_config after deploy.
 *
 * Usage (from repo root, after IDL exists):
 *   npx ts-node scripts/init-config.ts
 *
 * Requires ANCHOR_PROVIDER_URL and ANCHOR_WALLET, or defaults to devnet + ~/.config/solana/id.json
 */

import * as anchor from "@coral-xyz/anchor";
import { Program, BN } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import * as fs from "fs";
import * as path from "path";

async function main() {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const idlPath = path.join(__dirname, "../target/idl/poke_rips.json");
  if (!fs.existsSync(idlPath)) {
    throw new Error("Missing target/idl/poke_rips.json — run anchor build first");
  }
  const idl = JSON.parse(fs.readFileSync(idlPath, "utf8"));
  const program = new Program(idl, provider);

  const [configPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("config")],
    program.programId
  );
  const [treasuryPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("treasury")],
    program.programId
  );

  console.log("Program:", program.programId.toBase58());
  console.log("Config :", configPda.toBase58());
  console.log("Treasury:", treasuryPda.toBase58());
  console.log("Authority:", provider.wallet.publicKey.toBase58());

  const feeBps = 100; // 1%
  const refundTimeoutSlots = new BN(50_000);

  const sig = await program.methods
    .initializeConfig(feeBps, refundTimeoutSlots)
    .accounts({
      config: configPda,
      treasury: treasuryPda,
      authority: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  console.log("initialize_config tx:", sig);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
