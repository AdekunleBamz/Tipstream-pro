// Contract addresses on Base Mainnet
export const CONTRACTS = {
  TipStream: "0x9FB4486fD78aB583f091958E331b7A805c5775d4" as `0x${string}`,
  SubscriptionManager: "0xde57810A28652745446E4f188D30076c57D8C4d2" as `0x${string}`,
  TipNFT: "0x47b1E98c56A2a3Cd95722e25A118654Ddf93FED0" as `0x${string}`,
  DailyCheckIn: "0x30fa4DE1205AFDe0F00Cee051c5c3dA8Dc3C7Ef8" as `0x${string}`,
} as const;

// Platform fee in wei (0.00001 ETH)
export const PLATFORM_FEE = BigInt("10000000000000");

// Minimum tip amount in wei (0.0001 ETH)
export const MIN_TIP_AMOUNT = BigInt("100000000000000");

// Subscription tier prices in wei
export const SUBSCRIPTION_TIERS = [
  { id: 0, name: "Basic", price: BigInt("200000000000000"), priceStr: "0.0002", period: 30, emoji: "⭐" },
  { id: 1, name: "Pro", price: BigInt("400000000000000"), priceStr: "0.0004", period: 30, emoji: "💎" },
  { id: 2, name: "VIP", price: BigInt("600000000000000"), priceStr: "0.0006", period: 30, emoji: "👑" },
];

// Base Chain ID
export const BASE_CHAIN_ID = 8453;
