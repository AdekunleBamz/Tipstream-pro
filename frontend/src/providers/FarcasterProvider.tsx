"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import sdk from "@farcaster/miniapp-sdk";
import { useConnect, useAccount, useDisconnect } from "wagmi";

// Define the context type based on what the SDK returns
type FrameContextType = Awaited<typeof sdk.context>;

interface FarcasterContextType {
  context: FrameContextType | null;
  isLoaded: boolean;
  isInFrame: boolean;
  sdk: typeof sdk;
  openUrl: (url: string) => void;
  close: () => void;
  userFid: number | null;
  userName: string | null;
  connectWallet: () => Promise<void>;
  ethProvider: typeof sdk.wallet.ethProvider | null;
}

const FarcasterContext = createContext<FarcasterContextType>({
  context: null,
  isLoaded: false,
  isInFrame: false,
  sdk: sdk,
  openUrl: () => {},
  close: () => {},
  userFid: null,
  userName: null,
  connectWallet: async () => {},
  ethProvider: null,
});

export function useFarcaster() {
  return useContext(FarcasterContext);
}

export function FarcasterProvider({ children }: { children: ReactNode }) {
  const [context, setContext] = useState<FrameContextType | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInFrame, setIsInFrame] = useState(false);
  const [userFid, setUserFid] = useState<number | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [ethProvider, setEthProvider] = useState<typeof sdk.wallet.ethProvider | null>(null);

  const { connect, connectors } = useConnect();
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    const init = async () => {
      try {
        const inMiniApp = await sdk.isInMiniApp();
        setIsInFrame(inMiniApp);
        
        if (inMiniApp) {
          const miniAppContext = await sdk.context;
          setContext(miniAppContext);

          if (miniAppContext?.user) {
            setUserFid(miniAppContext.user.fid);
            setUserName(miniAppContext.user.username || null);
          }

          // Get the Farcaster wallet provider
          const provider = await sdk.wallet.getEthereumProvider();
          if (provider) {
            setEthProvider(sdk.wallet.ethProvider);
          }

          await sdk.actions.ready();
        }
      } catch (error) {
        console.log("Not in Farcaster miniapp context:", error);
      } finally {
        setIsLoaded(true);
      }
    };

    init();
  }, []);

  // Auto-connect to Farcaster wallet when inside Mini App
  useEffect(() => {
    const autoConnect = async () => {
      if (isInFrame && isLoaded && !isConnected && ethProvider) {
        try {
          // Request accounts from Farcaster wallet
          const accounts = await ethProvider.request({ method: "eth_requestAccounts" });
          if (accounts && accounts.length > 0) {
            // Find injected connector and connect
            const injectedConnector = connectors.find(c => c.id === "injected");
            if (injectedConnector) {
              connect({ connector: injectedConnector });
            }
          }
        } catch (error) {
          console.log("Auto-connect failed:", error);
        }
      }
    };

    autoConnect();
  }, [isInFrame, isLoaded, isConnected, ethProvider, connect, connectors]);

  const openUrl = useCallback((url: string) => {
    if (isInFrame) {
      sdk.actions.openUrl(url);
    } else {
      window.open(url, "_blank");
    }
  }, [isInFrame]);

  const close = useCallback(() => {
    if (isInFrame) {
      sdk.actions.close();
    }
  }, [isInFrame]);

  const connectWallet = useCallback(async () => {
    if (isInFrame && ethProvider) {
      try {
        const accounts = await ethProvider.request({ method: "eth_requestAccounts" });
        if (accounts && accounts.length > 0) {
          const injectedConnector = connectors.find(c => c.id === "injected");
          if (injectedConnector) {
            connect({ connector: injectedConnector });
          }
        }
      } catch (error) {
        console.error("Failed to connect Farcaster wallet:", error);
      }
    } else {
      // Fall back to first available connector
      const connector = connectors[0];
      if (connector) {
        connect({ connector });
      }
    }
  }, [isInFrame, ethProvider, connect, connectors]);

  return (
    <FarcasterContext.Provider value={{ 
      context, 
      isLoaded, 
      isInFrame, 
      sdk, 
      openUrl, 
      close,
      userFid,
      userName,
      connectWallet,
      ethProvider,
    }}>
      {children}
    </FarcasterContext.Provider>
  );
}
