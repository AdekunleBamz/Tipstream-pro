'use client';

import { useReadContract, useAccount } from 'wagmi';
import { TIPNFT_ADDRESS, BASE_CHAIN_ID } from '@/config/contracts';
import { TipNFTABI } from '@/config/abis';

export function useTipNFT() {
  const { address } = useAccount();

  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: TIPNFT_ADDRESS,
    abi: TipNFTABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: BASE_CHAIN_ID,
  });

  const { data: totalSupply, refetch: refetchSupply } = useReadContract({
    address: TIPNFT_ADDRESS,
    abi: TipNFTABI,
    functionName: 'totalSupply',
    chainId: BASE_CHAIN_ID,
  });

  const getTokenURI = (tokenId: bigint) => {
    return useReadContract({
      address: TIPNFT_ADDRESS,
      abi: TipNFTABI,
      functionName: 'tokenURI',
      args: [tokenId],
      chainId: BASE_CHAIN_ID,
    });
  };

  const getTokenOwner = (tokenId: bigint) => {
    return useReadContract({
      address: TIPNFT_ADDRESS,
      abi: TipNFTABI,
      functionName: 'ownerOf',
      args: [tokenId],
      chainId: BASE_CHAIN_ID,
    });
  };

  return {
    balance: balance as bigint | undefined,
    totalSupply: totalSupply as bigint | undefined,
    getTokenURI,
    getTokenOwner,
    refetchBalance,
    refetchSupply,
  };
}
