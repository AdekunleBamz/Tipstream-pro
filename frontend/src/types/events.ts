// Contract event types

export interface TipEvent {
  from: `0x${string}`;
  to: `0x${string}`;
  amount: bigint;
  fee: bigint;
  note: string;
  blockNumber: bigint;
  transactionHash: `0x${string}`;
}

export interface SubscriptionEvent {
  subscriber: `0x${string}`;
  creator: `0x${string}`;
  tierId: bigint;
  price: bigint;
  expiresAt: bigint;
  blockNumber: bigint;
  transactionHash: `0x${string}`;
}

export interface CheckInEvent {
  user: `0x${string}`;
  day: bigint;
  streak: bigint;
  blockNumber: bigint;
  transactionHash: `0x${string}`;
}

export interface NFTMintEvent {
  to: `0x${string}`;
  tokenId: bigint;
  amount: bigint;
  note: string;
  blockNumber: bigint;
  transactionHash: `0x${string}`;
}

export interface FeeUpdatedEvent {
  oldFee: bigint;
  newFee: bigint;
  blockNumber: bigint;
  transactionHash: `0x${string}`;
}

export interface TreasuryUpdatedEvent {
  oldTreasury: `0x${string}`;
  newTreasury: `0x${string}`;
  blockNumber: bigint;
  transactionHash: `0x${string}`;
}

export interface PlanSetEvent {
  creator: `0x${string}`;
  tierId: bigint;
  price: bigint;
  period: bigint;
  active: boolean;
  blockNumber: bigint;
  transactionHash: `0x${string}`;
}

export type ContractEvent = 
  | TipEvent 
  | SubscriptionEvent 
  | CheckInEvent 
  | NFTMintEvent 
  | FeeUpdatedEvent 
  | TreasuryUpdatedEvent
  | PlanSetEvent;
