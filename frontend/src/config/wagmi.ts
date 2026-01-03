"use client";

import { http, createConfig } from "wagmi";
import { base } from "wagmi/chains";
import { injected, coinbaseWallet } from "wagmi/connectors";

// Farcaster Frame connector will be added dynamically
export const config = createConfig({
  chains: [base],
  connectors: [
    injected(),
    coinbaseWallet({ appName: "TipStream Pro" }),
  ],
  transports: {
    [base.id]: http(),
  },
  ssr: true,
});

export { base };
