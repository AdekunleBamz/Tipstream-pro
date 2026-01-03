"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import sdk from "@farcaster/miniapp-sdk";

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

  useEffect(() => {
    const init = async () => {
      try {
        const inMiniApp = await sdk.isInMiniApp();
        setIsInFrame(inMiniApp);
        if (!inMiniApp) return;

        const miniAppContext = await sdk.context;
        setContext(miniAppContext);

        if (miniAppContext?.user) {
          setUserFid(miniAppContext.user.fid);
          setUserName(miniAppContext.user.username || null);
        }

        await sdk.actions.ready();
      } catch (error) {
        console.log("Not in Farcaster miniapp context");
      } finally {
        setIsLoaded(true);
      }
    };

    init();
  }, []);

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

  return (
    <FarcasterContext.Provider value={{ 
      context, 
      isLoaded, 
      isInFrame, 
      sdk, 
      openUrl, 
      close,
      userFid,
      userName 
    }}>
      {children}
    </FarcasterContext.Provider>
  );
}
