'use client';

import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { parseEther } from 'viem';
import { CONTRACTS, BASE_CHAIN_ID, PLATFORM_FEE } from '@/config/contracts';
import { TipStreamABI } from '@/config/abis';

export function useTipStream() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const sendTip = async (
    recipient: `0x${string}`,
    amount: string,
    note: string,
    mintNft: boolean
  ) => {
    const tipAmount = parseEther(amount);
    const totalValue = tipAmount + PLATFORM_FEE;

    writeContract({
      address: CONTRACTS.TipStream,
      abi: TipStreamABI,
      functionName: 'tip',
      args: [recipient, note, mintNft],
      value: totalValue,
    });
  };

  return {
    sendTip,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
    platformFee: PLATFORM_FEE,
  };
}
