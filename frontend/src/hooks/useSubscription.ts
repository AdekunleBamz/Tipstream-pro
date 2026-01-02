'use client';

import { useWriteContract, useWaitForTransactionReceipt, useReadContract, useAccount } from 'wagmi';
import { parseEther } from 'viem';
import { CONTRACTS, BASE_CHAIN_ID } from '@/config/contracts';
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
      address: CONTRACTS.SubscriptionManager,
      abi: SubscriptionManagerABI,
      functionName: 'subscribe',
      args: [creator, BigInt(tier)],
      value: parseEther(price),
    });
  };

  return {
    subscribe,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}
