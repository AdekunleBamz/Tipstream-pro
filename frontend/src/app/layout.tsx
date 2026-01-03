import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClientProviders } from "@/providers/ClientProviders";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
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
    images: [
      {
        url: "https://tipstream-pro.vercel.app/api/og",
        width: 1200,
        height: 630,
        alt: "TipStream Pro",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TipStream Pro",
    description: "The ultimate micro-tipping platform for Farcaster creators",
    images: ["https://tipstream-pro.vercel.app/api/og"],
  },
  other: {
    "fc:frame": "vNext",
    "fc:frame:image": "https://tipstream-pro.vercel.app/api/og",
    "fc:frame:button:1": "💰 Send Tip",
    "fc:frame:button:1:action": "link",
    "fc:frame:button:1:target": "https://tipstream-pro.vercel.app/tip",
    "fc:frame:button:2": "📊 Dashboard",
    "fc:frame:button:2:action": "link",
    "fc:frame:button:2:target": "https://tipstream-pro.vercel.app/dashboard",
    "fc:frame:button:3": "✅ Check-In",
    "fc:frame:button:3:action": "link",
    "fc:frame:button:3:target": "https://tipstream-pro.vercel.app/checkin",
    "fc:frame:button:4": "🚀 Open App",
    "fc:frame:button:4:action": "launch_frame",
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
        className={`${inter.variable} antialiased bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 min-h-screen`}
        suppressHydrationWarning
      >
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
