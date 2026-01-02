# TipStream Pro

**Stream Tips, Stack Stats, Surge Rankings**

A Micro-Tipping & Content Monetization Platform for Farcaster creators with ultra-low fees on Base Chain.

## Features

- 🎯 **Micro-Tipping** - Send/receive tips as low as 0.001 ETH
- 💰 **Ultra-Low Fees** - Only 0.0001 ETH per transaction
- 🎫 **NFT Receipts** - Every tip mints a commemorative NFT
- 📅 **Daily Check-In** - Build streaks for engagement rewards
- 💳 **Subscriptions** - Monthly recurring payments to creators
- 📊 **Analytics** - Real-time tracking dashboard

## Deployed Contracts (Base Chain)

| Contract | Address | Status |
|----------|---------|--------|
| TipStream | `0x9FB4486fD78aB583f091958E331b7A805c5775d4` | ✅ Deployed |
| SubscriptionManager | `0xde57810A28652745446E4f188D30076c57D8C4d2` | ✅ Deployed |
| TipNFT | `0x47b1E98c56A2a3Cd95722e25A118654Ddf93FED0` | ✅ Deployed |
| DailyCheckIn | `0x30fa4DE1205AFDe0F00Cee051c5c3dA8Dc3C7Ef8` | ✅ Deployed |

## NFT Metadata

Metadata is hosted via GitHub Pages:
- **Base URI**: `https://adekunlebamz.github.io/Tipstream-pro/metadata/`
- **Image**: `https://adekunlebamz.github.io/Tipstream-pro/images/receipt.svg`

## Deployment Guide (Remix)

### 1. TipNFT
```
Constructor params:
- baseURI_: "https://adekunlebamz.github.io/Tipstream-pro/metadata/"
- initialOwner: <your-wallet-address>
```

### 2. DailyCheckIn
```
No constructor params needed - just deploy!
```

### 3. Update TipStream
After deploying TipNFT, call `setTipNft(<TipNFT-address>)` on TipStream contract.

## Tech Stack

- **Blockchain**: Base Chain
- **Contracts**: Solidity 0.8.21
- **Frontend**: React + TypeScript + Tailwind (coming soon)
- **Wallet**: wagmi + viem

## File Structure

```
├── contracts/
│   ├── TipStream.sol          # Main tipping contract
│   ├── SubscriptionManager.sol # Recurring payments
│   ├── TipNFT.sol              # Receipt NFTs
│   └── DailyCheckIn.sol        # Streak rewards
├── metadata/
│   └── 1.json ... 10.json      # NFT metadata
├── images/
│   └── receipt.svg             # NFT image
└── .env.example
```

## Setup GitHub Pages

1. Go to repo Settings → Pages
2. Source: Deploy from branch `main`, folder `/root`
3. Your metadata will be at: `https://adekunlebamz.github.io/Tipstream-pro/metadata/`

## License

MIT
