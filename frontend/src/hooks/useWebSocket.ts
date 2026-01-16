'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

// ============================================================================
// Types
// ============================================================================

export type WebSocketStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export interface WebSocketMessage<T = unknown> {
  type: string;
  payload: T;
  timestamp: number;
}

export interface UseWebSocketOptions {
  url: string;
  protocols?: string | string[];
  reconnect?: boolean;
  reconnectInterval?: number;
  reconnectAttempts?: number;
  onOpen?: (event: Event) => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (event: Event) => void;
  onMessage?: (message: WebSocketMessage) => void;
}

export interface UseWebSocketReturn<T = unknown> {
  status: WebSocketStatus;
  lastMessage: WebSocketMessage<T> | null;
  send: (message: WebSocketMessage) => void;
  sendJson: (data: object) => void;
  disconnect: () => void;
  reconnect: () => void;
  messageHistory: WebSocketMessage<T>[];
}

// ============================================================================
// useWebSocket Hook
// ============================================================================

export function useWebSocket<T = unknown>(
  options: UseWebSocketOptions
): UseWebSocketReturn<T> {
  const {
    url,
    protocols,
    reconnect = true,
    reconnectInterval = 3000,
    reconnectAttempts = 5,
    onOpen,
    onClose,
    onError,
    onMessage,
  } = options;

  const [status, setStatus] = useState<WebSocketStatus>('disconnected');
  const [lastMessage, setLastMessage] = useState<WebSocketMessage<T> | null>(null);
  const [messageHistory, setMessageHistory] = useState<WebSocketMessage<T>[]>([]);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectCountRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setStatus('connecting');

    try {
      wsRef.current = new WebSocket(url, protocols);

      wsRef.current.onopen = (event) => {
        setStatus('connected');
        reconnectCountRef.current = 0;
        onOpen?.(event);
      };

      wsRef.current.onclose = (event) => {
        setStatus('disconnected');
        onClose?.(event);

        if (reconnect && reconnectCountRef.current < reconnectAttempts) {
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectCountRef.current++;
            connect();
          }, reconnectInterval);
        }
      };

      wsRef.current.onerror = (event) => {
        setStatus('error');
        onError?.(event);
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage<T> = JSON.parse(event.data);
          setLastMessage(message);
          setMessageHistory((prev) => [...prev.slice(-99), message]);
          onMessage?.(message as WebSocketMessage);
        } catch {
          // Handle non-JSON messages
          const message: WebSocketMessage<T> = {
            type: 'raw',
            payload: event.data as T,
            timestamp: Date.now(),
          };
          setLastMessage(message);
          setMessageHistory((prev) => [...prev.slice(-99), message]);
        }
      };
    } catch (error) {
      setStatus('error');
    }
  }, [url, protocols, reconnect, reconnectInterval, reconnectAttempts, onOpen, onClose, onError, onMessage]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    reconnectCountRef.current = reconnectAttempts; // Prevent auto-reconnect
    wsRef.current?.close();
    setStatus('disconnected');
  }, [reconnectAttempts]);

  const send = useCallback((message: WebSocketMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  }, []);

  const sendJson = useCallback((data: object) => {
    const message: WebSocketMessage = {
      type: 'message',
      payload: data,
      timestamp: Date.now(),
    };
    send(message);
  }, [send]);

  const reconnectFn = useCallback(() => {
    reconnectCountRef.current = 0;
    disconnect();
    connect();
  }, [connect, disconnect]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      wsRef.current?.close();
    };
  }, [connect]);

  return {
    status,
    lastMessage,
    send,
    sendJson,
    disconnect,
    reconnect: reconnectFn,
    messageHistory,
  };
}

// ============================================================================
// useWebSocketSubscription Hook
// ============================================================================

export interface SubscriptionOptions {
  channel: string;
  onData?: (data: unknown) => void;
}

export function useWebSocketSubscription(
  ws: UseWebSocketReturn,
  options: SubscriptionOptions
) {
  const { channel, onData } = options;

  useEffect(() => {
    // Subscribe to channel
    ws.send({
      type: 'subscribe',
      payload: { channel },
      timestamp: Date.now(),
    });

    return () => {
      // Unsubscribe from channel
      ws.send({
        type: 'unsubscribe',
        payload: { channel },
        timestamp: Date.now(),
      });
    };
  }, [ws, channel]);

  useEffect(() => {
    if (ws.lastMessage && ws.lastMessage.type === channel) {
      onData?.(ws.lastMessage.payload);
    }
  }, [ws.lastMessage, channel, onData]);
}

// ============================================================================
// useRealtimePrices Hook
// ============================================================================

export interface PriceData {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  timestamp: number;
}

export function useRealtimePrices(symbols: string[]) {
  const [prices, setPrices] = useState<Record<string, PriceData>>({});
  const [isConnected, setIsConnected] = useState(false);

  const ws = useWebSocket({
    url: 'wss://prices.tipstream.pro/ws',
    onOpen: () => setIsConnected(true),
    onClose: () => setIsConnected(false),
    onMessage: (message) => {
      if (message.type === 'price') {
        const data = message.payload as PriceData;
        setPrices((prev) => ({
          ...prev,
          [data.symbol]: data,
        }));
      }
    },
  });

  useEffect(() => {
    if (ws.status === 'connected') {
      ws.send({
        type: 'subscribe',
        payload: { symbols },
        timestamp: Date.now(),
      });
    }
  }, [ws.status, symbols]);

  return {
    prices,
    isConnected,
    reconnect: ws.reconnect,
  };
}

// ============================================================================
// useRealtimeNotifications Hook
// ============================================================================

export interface Notification {
  id: string;
  type: 'tip' | 'subscription' | 'nft' | 'system';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
}

export function useRealtimeNotifications(userId?: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const ws = useWebSocket({
    url: userId ? `wss://notifications.tipstream.pro/ws?user=${userId}` : '',
    onMessage: (message) => {
      if (message.type === 'notification') {
        const notification = message.payload as Notification;
        setNotifications((prev) => [notification, ...prev.slice(0, 49)]);
        setUnreadCount((prev) => prev + 1);
      }
    },
  });

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  return {
    notifications,
    unreadCount,
    isConnected: ws.status === 'connected',
    markAsRead,
    markAllAsRead,
    clearNotifications,
  };
}

// ============================================================================
// useLiveActivity Hook
// ============================================================================

export interface ActivityEvent {
  id: string;
  type: 'tip' | 'subscription' | 'nft_mint' | 'check_in';
  from: string;
  to: string;
  amount?: string;
  nftId?: number;
  timestamp: number;
}

export function useLiveActivity() {
  const [activities, setActivities] = useState<ActivityEvent[]>([]);

  const ws = useWebSocket({
    url: 'wss://activity.tipstream.pro/ws',
    onMessage: (message) => {
      if (message.type === 'activity') {
        const activity = message.payload as ActivityEvent;
        setActivities((prev) => [activity, ...prev.slice(0, 99)]);
      }
    },
  });

  return {
    activities,
    isConnected: ws.status === 'connected',
    reconnect: ws.reconnect,
  };
}

export default useWebSocket;
