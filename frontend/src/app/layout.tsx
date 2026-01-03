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
        url: "https://tipstream-pro.vercel.app/og-image.png",
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
    images: ["https://tipstream-pro.vercel.app/og-image.png"],
  },
  other: {
    "fc:frame": JSON.stringify({
      version: "next",
      imageUrl: "https://tipstream-pro.vercel.app/og-image.png",
      button: {
        title: "💰 Send Tip",
        action: {
          type: "launch_frame",
          name: "TipStream Pro",
          url: "https://tipstream-pro.vercel.app/frame",
          splashImageUrl: "https://tipstream-pro.vercel.app/splash.png",
          splashBackgroundColor: "#111827"
        }
      }
    }),
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
