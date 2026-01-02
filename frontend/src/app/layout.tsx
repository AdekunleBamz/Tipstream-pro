import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClientProviders } from "@/providers/ClientProviders";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TipStream Pro | Micro-Tipping for Creators",
  description: "Stream Tips, Stack Stats, Surge Rankings - The ultimate micro-tipping platform for Farcaster creators on Base Chain",
  keywords: ["tipping", "creators", "farcaster", "base", "blockchain", "nft", "web3"],
  authors: [{ name: "TipStream Pro" }],
  openGraph: {
    title: "TipStream Pro",
    description: "The ultimate micro-tipping platform for Farcaster creators",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "TipStream Pro",
    description: "The ultimate micro-tipping platform for Farcaster creators",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 min-h-screen`}
        suppressHydrationWarning
      >
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
