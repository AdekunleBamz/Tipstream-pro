'use client';

import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { parseEther } from 'viem';
import { TIPSTREAM_ADDRESS, BASE_CHAIN_ID } from '@/config/contracts';
import { TipStreamABI } from '@/config/abis';

export function useTipStream() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const { data: platformFee } = useReadContract({
    address: TIPSTREAM_ADDRESS,
    abi: TipStreamABI,
    functionName: 'PLATFORM_FEE',
    chainId: BASE_CHAIN_ID,
  });

  const { data: totalTips } = useReadContract({
    address: TIPSTREAM_ADDRESS,
    abi: TipStreamABI,
    functionName: 'totalTips',
    chainId: BASE_CHAIN_ID,
  });

  const { data: totalVolume } = useReadContract({
    address: TIPSTREAM_ADDRESS,
    abi: TipStreamABI,
    functionName: 'totalVolume',
    chainId: BASE_CHAIN_ID,
  });

  const sendTip = async (
    recipient: `0x${string}`,
    amount: string,
    note: string,
    mintNft: boolean
  ) => {
    const tipAmount = parseEther(amount);
    const fee = platformFee || parseEther('0.0001');
    const totalValue = tipAmount + (fee as bigint);

    writeContract({
      address: TIPSTREAM_ADDRESS,
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
    platformFee,
    totalTips: totalTips as bigint | undefined,
    totalVolume: totalVolume as bigint | undefined,
  };
}
