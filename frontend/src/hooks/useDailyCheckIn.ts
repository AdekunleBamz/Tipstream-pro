'use client';

import { useWriteContract, useWaitForTransactionReceipt, useReadContract, useAccount } from 'wagmi';
import { CONTRACTS, BASE_CHAIN_ID } from '@/config/contracts';
import { DailyCheckInABI } from '@/config/abis';

export function useDailyCheckIn() {
  const { address } = useAccount();
  
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const { data: userStats, refetch: refetchStats } = useReadContract({
    address: CONTRACTS.DailyCheckIn,
    abi: DailyCheckInABI,
    functionName: 'getStreak',
    args: address ? [address] : undefined,
    chainId: BASE_CHAIN_ID,
  });

  const { data: lastCheckIn } = useReadContract({
    address: CONTRACTS.DailyCheckIn,
    abi: DailyCheckInABI,
    functionName: 'lastCheckIn',
    args: address ? [address] : undefined,
    chainId: BASE_CHAIN_ID,
  });

  const checkIn = async () => {
    writeContract({
      address: CONTRACTS.DailyCheckIn,
      abi: DailyCheckInABI,
      functionName: 'checkIn',
    });
  };

  // Check if already checked in today
  const today = Math.floor(Date.now() / 1000 / 86400);
  const canCheckInToday = lastCheckIn ? Number(lastCheckIn) !== today : true;

  return {
    checkIn,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
    currentStreak: userStats as bigint | undefined,
    canCheckInToday,
    refetchStats,
  };
}
