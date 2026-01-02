"use client";

import { Providers } from "@/providers/Web3Provider";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>;
}
