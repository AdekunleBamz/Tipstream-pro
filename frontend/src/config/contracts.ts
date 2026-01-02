// Contract addresses on Base Mainnet
export const CONTRACTS = {
  TipStream: "0x9FB4486fD78aB583f091958E331b7A805c5775d4" as `0x${string}`,
  SubscriptionManager: "0xde57810A28652745446E4f188D30076c57D8C4d2" as `0x${string}`,
  TipNFT: "0x47b1E98c56A2a3Cd95722e25A118654Ddf93FED0" as `0x${string}`,
  DailyCheckIn: "0x30fa4DE1205AFDe0F00Cee051c5c3dA8Dc3C7Ef8" as `0x${string}`,
} as const;

// Platform fee in wei (0.0001 ETH)
export const PLATFORM_FEE = BigInt("100000000000000");

// Minimum tip amount in wei (0.001 ETH)
export const MIN_TIP_AMOUNT = BigInt("1000000000000000");

// Base Chain ID
export const BASE_CHAIN_ID = 8453;
