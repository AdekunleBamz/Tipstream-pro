'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWatchContractEvent, usePublicClient } from 'wagmi';
import { type Abi, type Address, type Log } from 'viem';
import { CONTRACT_ADDRESSES } from '@/config/contracts';
import { TipStreamABI } from '@/config/abis';

interface ContractEvent<T = unknown> {
  id: string;
  eventName: string;
  args: T;
  blockNumber: bigint;
  transactionHash: string;
  timestamp?: number;
}

interface UseContractEventsOptions<T> {
  address: Address;
  abi: Abi;
  eventName: string;
  onEvent?: (event: ContractEvent<T>) => void;
  maxEvents?: number;
  enabled?: boolean;
}

export function useContractEvents<T = unknown>({
  address,
  abi,
  eventName,
  onEvent,
  maxEvents = 50,
  enabled = true,
}: UseContractEventsOptions<T>) {
  const [events, setEvents] = useState<ContractEvent<T>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const publicClient = usePublicClient();

  // Watch for new events
  useWatchContractEvent({
    address,
    abi,
    eventName,
    onLogs(logs) {
      const newEvents = logs.map((log) => {
        const event: ContractEvent<T> = {
          id: `${log.transactionHash}-${log.logIndex}`,
          eventName,
          args: (log as unknown as { args: T }).args,
          blockNumber: log.blockNumber,
          transactionHash: log.transactionHash,
        };
        return event;
      });

      setEvents((prev) => {
        const combined = [...newEvents, ...prev];
        // Remove duplicates and limit size
        const unique = combined.filter(
          (event, index, self) =>
            index === self.findIndex((e) => e.id === event.id)
        );
        return unique.slice(0, maxEvents);
      });

      // Trigger callback for each new event
      newEvents.forEach((event) => onEvent?.(event));
    },
    enabled,
  });

  // Fetch historical events
  const fetchHistoricalEvents = useCallback(
    async (fromBlock: bigint = BigInt(0)) => {
      if (!publicClient || !enabled) return;

      setIsLoading(true);
      try {
        const logs = await publicClient.getContractEvents({
          address,
          abi,
          eventName,
          fromBlock,
          toBlock: 'latest',
        });

        const historicalEvents = logs.map((log) => ({
          id: `${log.transactionHash}-${log.logIndex}`,
          eventName,
          args: (log as unknown as { args: T }).args,
          blockNumber: log.blockNumber,
          transactionHash: log.transactionHash,
        }));

        setEvents((prev) => {
          const combined = [...prev, ...historicalEvents];
          const unique = combined.filter(
            (event, index, self) =>
              index === self.findIndex((e) => e.id === event.id)
          );
          return unique.slice(0, maxEvents);
        });
      } catch (error) {
        console.error('Error fetching historical events:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [publicClient, address, abi, eventName, maxEvents, enabled]
  );

  // Clear events
  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  return {
    events,
    isLoading,
    fetchHistoricalEvents,
    clearEvents,
    eventCount: events.length,
  };
}

/**
 * Hook specifically for TipStream tip events
 */
export interface TipEvent {
  tipper: Address;
  creator: Address;
  amount: bigint;
  message: string;
}

export function useTipEvents(options: { onTip?: (event: ContractEvent<TipEvent>) => void } = {}) {
  return useContractEvents<TipEvent>({
    address: CONTRACT_ADDRESSES.tipStream as Address,
    abi: TipStreamABI as Abi,
    eventName: 'TipSent',
    onEvent: options.onTip,
  });
}

/**
 * Filter events by address
 */
export function filterEventsByAddress<T extends { creator?: Address; tipper?: Address }>(
  events: ContractEvent<T>[],
  address: Address
): ContractEvent<T>[] {
  return events.filter(
    (event) => event.args.creator === address || event.args.tipper === address
  );
}

/**
 * Calculate total from events
 */
export function calculateTotalFromEvents<T extends { amount: bigint }>(
  events: ContractEvent<T>[]
): bigint {
  return events.reduce((total, event) => total + event.args.amount, BigInt(0));
}
