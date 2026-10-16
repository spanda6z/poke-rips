"use client";

import { Navbar } from "@/components/Navbar";
import { CardFrame } from "@/components/CardFrame";

// Demo cards so the page isn't empty
const DEMO_CARDS = [
  { rarity: "Rare", tokenSymbol: "JUP", tokenAmount: "18.4", valueUsd: 92 },
  { rarity: "Uncommon", tokenSymbol: "WIF", tokenAmount: "65", valueUsd: 28 },
  { rarity: "Common", tokenSymbol: "BONK", tokenAmount: "2.1M", valueUsd: 7.4 },
  { rarity: "Ultra Rare", tokenSymbol: "PYTH", tokenAmount: "120", valueUsd: 295 },
];

export default function CollectionPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Your Collection</h1>
            <p className="text-slate-400">Cards from packs you have ripped.</p>
          </div>
          <div className="text-sm text-slate-500">
            {DEMO_CARDS.length} cards
          </div>
        </div>

        {DEMO_CARDS.length === 0 ? (
          <div className="bg-poke-surface border border-white/10 rounded-2xl p-16 text-center text-slate-500">
            No cards yet. Go rip a pack.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {DEMO_CARDS.map((card, i) => (
              <CardFrame key={i} {...card} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}