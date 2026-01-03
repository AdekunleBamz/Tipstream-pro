"use client";

import { RainbowKitProvider, darkTheme, connectorsForWallets } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { base } from "wagmi/chains";
import { coinbaseWallet, metaMaskWallet, rainbowWallet } from "@rainbow-me/rainbowkit/wallets";
import "@rainbow-me/rainbowkit/styles.css";
import { useState, useEffect, useMemo } from "react";
import { farcasterFrame } from "@farcaster/frame-wagmi-connector";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Create config only on client side to avoid SSR localStorage issues
  const config = useMemo(() => {
    if (typeof window === "undefined") {
      // Return a minimal config for SSR
      return createConfig({
        chains: [base],
        connectors: [],
        transports: {
          [base.id]: http(),
        },
        ssr: true,
      });
    }

    const connectors = connectorsForWallets(
      [
        {
          groupName: "Recommended",
          wallets: [coinbaseWallet, metaMaskWallet, rainbowWallet],
        },
      ],
      {
        appName: "TipStream Pro",
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo",
      }
    );

    // Add Farcaster Frame connector
    const farcasterConnector = farcasterFrame();

    return createConfig({
      chains: [base],
      connectors: [...connectors, farcasterConnector],
      transports: {
        [base.id]: http(),
      },
      ssr: true,
    });
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "#7c3aed",
            accentColorForeground: "white",
            borderRadius: "medium",
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
