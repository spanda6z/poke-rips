"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Shop" },
  { href: "/collection", label: "Collection" },
  { href: "/vote", label: "Vote" },
  { href: "/stats", label: "Stats" },
  { href: "/fair", label: "Fairness" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-white/10 bg-poke-bg/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-black text-poke-yellow text-xl tracking-tight">
            POKE RIPS
          </Link>
          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "text-poke-yellow"
                    : "text-slate-400 hover:text-white"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <WalletMultiButton className="!bg-poke-yellow !text-black !font-bold !rounded-full" />
      </div>
    </nav>
  );
}