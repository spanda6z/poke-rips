export const PACKS = [
  {
    id: "micro",
    name: "Micro Pack",
    description: "Dip a toe. Rip a real bag.",
    minPrize: 1,
    maxPrize: 100,
    priceSol: 0.05,
    color: "from-slate-700 to-slate-900",
  },
  {
    id: "mini",
    name: "Mini Pack",
    description: "Small pack, real potential.",
    minPrize: 5,
    maxPrize: 250,
    priceSol: 0.15,
    color: "from-emerald-800 to-emerald-950",
  },
  {
    id: "starter",
    name: "Starter Pack",
    description: "The classic entry.",
    minPrize: 10,
    maxPrize: 500,
    priceSol: 0.35,
    color: "from-blue-800 to-blue-950",
  },
  {
    id: "degen",
    name: "Degen Pack",
    description: "Higher risk. Higher reward.",
    minPrize: 25,
    maxPrize: 1500,
    priceSol: 1.0,
    color: "from-purple-800 to-purple-950",
  },
  {
    id: "whale",
    name: "Whale Pack",
    description: "For the big players.",
    minPrize: 100,
    maxPrize: 10000,
    priceSol: 5.0,
    color: "from-yellow-700 to-orange-950",
  },
] as const;

export const RARITIES = [
  { name: "Common", chance: 0.55, color: "slate" },
  { name: "Uncommon", chance: 0.25, color: "emerald" },
  { name: "Rare", chance: 0.12, color: "blue" },
  { name: "Ultra Rare", chance: 0.06, color: "purple" },
  { name: "Secret Rare", chance: 0.018, color: "pink" },
  { name: "Legendary", chance: 0.002, color: "yellow" },
] as const;

export const BOOST_TIERS = [
  { name: "Spark", amount: 250_000, bonus: 0.08 },
  { name: "Charge", amount: 1_000_000, bonus: 0.15 },
  { name: "Surge", amount: 2_500_000, bonus: 0.22 },
  { name: "Apex", amount: 5_000_000, bonus: 0.30 },
] as const;