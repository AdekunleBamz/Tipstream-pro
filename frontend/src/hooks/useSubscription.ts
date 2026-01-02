'use client';

import { useWriteContract, useWaitForTransactionReceipt, useReadContract, useAccount } from 'wagmi';
import { parseEther } from 'viem';
import { SUBSCRIPTION_MANAGER_ADDRESS, BASE_CHAIN_ID } from '@/config/contracts';
import { SubscriptionManagerABI } from '@/config/abis';

export function useSubscription() {
  const { address } = useAccount();
  
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const subscribe = async (
    creator: `0x${string}`,
    tier: number,
    price: string
  ) => {
    writeContract({
      address: SUBSCRIPTION_MANAGER_ADDRESS,
      abi: SubscriptionManagerABI,
      functionName: 'subscribe',
      args: [creator, tier],
      value: parseEther(price),
    });
  };

  const createTier = async (
    tier: number,
    price: string,
    duration: number,
    name: string
  ) => {
    writeContract({
      address: SUBSCRIPTION_MANAGER_ADDRESS,
      abi: SubscriptionManagerABI,
      functionName: 'setTier',
      args: [tier, parseEther(price), BigInt(duration), name],
    });
  };

  const getSubscription = (subscriber: `0x${string}`, creator: `0x${string}`) => {
    return useReadContract({
      address: SUBSCRIPTION_MANAGER_ADDRESS,
      abi: SubscriptionManagerABI,
      functionName: 'getSubscription',
      args: [subscriber, creator],
      chainId: BASE_CHAIN_ID,
    });
  };

  const { data: totalSubscribers } = useReadContract({
    address: SUBSCRIPTION_MANAGER_ADDRESS,
    abi: SubscriptionManagerABI,
    functionName: 'totalSubscriptions',
    chainId: BASE_CHAIN_ID,
  });

  return {
    subscribe,
    createTier,
    getSubscription,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
    totalSubscribers: totalSubscribers as bigint | undefined,
  };
}
