"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import sdk, { type FrameContext } from "@farcaster/frame-sdk";

interface FarcasterContextType {
  context: FrameContext | null;
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
  const [context, setContext] = useState<FrameContext | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInFrame, setIsInFrame] = useState(false);
  const [userFid, setUserFid] = useState<number | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const frameContext = await sdk.context;
        
        if (frameContext) {
          setContext(frameContext);
          setIsInFrame(true);
          
          // Extract user info
          if (frameContext.user) {
            setUserFid(frameContext.user.fid);
            setUserName(frameContext.user.username || null);
          }
          
          // Signal to Farcaster that the frame is ready
          sdk.actions.ready();
        }
      } catch (error) {
        console.log("Not in Farcaster frame context");
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
