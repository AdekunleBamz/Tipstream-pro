"use client";

import { Providers } from "@/providers/Web3Provider";
import { FarcasterProvider } from "@/providers/FarcasterProvider";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <FarcasterProvider>{children}</FarcasterProvider>
    </Providers>
  );
}
