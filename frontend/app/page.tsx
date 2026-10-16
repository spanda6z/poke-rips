"use client";

import { PackCard } from "@/components/PackCard";
import { Navbar } from "@/components/Navbar";

const PACKS = [
  {
    id: "micro",
    name: "Micro Pack",
    description: "Dip a toe. Rip a real bag.",
    minPrize: 1,
    maxPrize: 100,
    priceSol: 0.05,
  },
  {
    id: "mini",
    name: "Mini Pack",
    description: "Small pack, real potential.",
    minPrize: 5,
    maxPrize: 250,
    priceSol: 0.15,
  },
  {
    id: "starter",
    name: "Starter Pack",
    description: "The classic entry.",
    minPrize: 10,
    maxPrize: 500,
    priceSol: 0.35,
  },
  {
    id: "degen",
    name: "Degen Pack",
    description: "Higher risk. Higher reward.",
    minPrize: 25,
    maxPrize: 1500,
    priceSol: 1.0,
  },
  {
    id: "whale",
    name: "Whale Pack",
    description: "For the big players.",
    minPrize: 100,
    maxPrize: 10000,
    priceSol: 5.0,
  },
];

export default function ShopPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-poke-yellow mb-3">
            POKE RIPS
          </h1>
          <p className="text-slate-400 text-lg">
            Rip packs. Catch real Solana bags.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PACKS.map((pack) => (
            <PackCard key={pack.id} pack={pack} />
          ))}
        </div>
      </main>
    </div>
  );
}