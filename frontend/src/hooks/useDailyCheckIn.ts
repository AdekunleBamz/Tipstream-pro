'use client';

import { useWriteContract, useWaitForTransactionReceipt, useReadContract, useAccount } from 'wagmi';
import { DAILY_CHECKIN_ADDRESS, BASE_CHAIN_ID } from '@/config/contracts';
import { DailyCheckInABI } from '@/config/abis';

export function useDailyCheckIn() {
  const { address } = useAccount();
  
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const { data: userStats, refetch: refetchStats } = useReadContract({
    address: DAILY_CHECKIN_ADDRESS,
    abi: DailyCheckInABI,
    functionName: 'getStreak',
    args: address ? [address] : undefined,
    chainId: BASE_CHAIN_ID,
  });

  const { data: canCheckInToday } = useReadContract({
    address: DAILY_CHECKIN_ADDRESS,
    abi: DailyCheckInABI,
    functionName: 'canCheckIn',
    args: address ? [address] : undefined,
    chainId: BASE_CHAIN_ID,
  });

  const { data: totalCheckIns } = useReadContract({
    address: DAILY_CHECKIN_ADDRESS,
    abi: DailyCheckInABI,
    functionName: 'totalCheckIns',
    chainId: BASE_CHAIN_ID,
  });

  const checkIn = async () => {
    writeContract({
      address: DAILY_CHECKIN_ADDRESS,
      abi: DailyCheckInABI,
      functionName: 'checkIn',
    });
  };

  const stats = userStats as [bigint, bigint, bigint] | undefined;

  return {
    checkIn,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
    currentStreak: stats?.[0],
    longestStreak: stats?.[1],
    totalDays: stats?.[2],
    canCheckInToday: canCheckInToday as boolean | undefined,
    totalCheckIns: totalCheckIns as bigint | undefined,
    refetchStats,
  };
}
