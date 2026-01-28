"use client";

import { Providers } from "@/providers/Web3Provider";
import { FarcasterProvider } from "@/providers/FarcasterProvider";
import { BackToTop } from "@/components/ui/BackToTop";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <FarcasterProvider>
        {children}
        <BackToTop />
      </FarcasterProvider>
    </Providers>
  );
}
