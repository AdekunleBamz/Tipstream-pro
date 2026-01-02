'use client';

import { useReadContract, useAccount } from 'wagmi';
import { CONTRACTS, BASE_CHAIN_ID } from '@/config/contracts';
import { TipNFTABI } from '@/config/abis';

export function useTipNFT() {
  const { address } = useAccount();

  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: CONTRACTS.TipNFT,
    abi: TipNFTABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: BASE_CHAIN_ID,
  });

  const { data: nextId, refetch: refetchNextId } = useReadContract({
    address: CONTRACTS.TipNFT,
    abi: TipNFTABI,
    functionName: 'nextId',
    chainId: BASE_CHAIN_ID,
  });

  return {
    balance: balance as bigint | undefined,
    nextId: nextId as bigint | undefined,
    refetchBalance,
    refetchNextId,
  };
}
