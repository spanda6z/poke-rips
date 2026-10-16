import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WalletContextProvider } from "@/components/WalletProvider";
import { MobileNav } from "@/components/MobileNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Poke Rips | Rip packs. Catch real bags.",
  description: "Solana pack-ripping dApp. Open packs and win real tokens delivered to your wallet.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-poke-bg text-white min-h-screen pb-20 md:pb-0`}>
        <WalletContextProvider>
          {children}
          <MobileNav />
        </WalletContextProvider>
      </body>
    </html>
  );
}