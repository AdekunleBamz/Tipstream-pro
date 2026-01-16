# TipStream Pro Architecture

## System Overview

TipStream Pro is a micro-tipping and creator monetization platform built on Base Chain, integrated with Farcaster for social features.

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                       │
├─────────────────────────────────────────────────────────────┤
│  Components  │  Hooks  │  Providers  │  Utils  │  Config   │
└──────────────┴─────────┴─────────────┴─────────┴───────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Web3 Integration Layer                    │
├─────────────────────────────────────────────────────────────┤
│     wagmi     │    viem    │   RainbowKit   │  Farcaster   │
└───────────────┴────────────┴────────────────┴──────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Base Chain (L2)                          │
├──────────────┬──────────────┬──────────────┬────────────────┤
│  TipStream   │ Subscription │   TipNFT    │  DailyCheckIn  │
│   Contract   │   Manager    │  (ERC-721)  │    Contract    │
└──────────────┴──────────────┴──────────────┴────────────────┘
```

## Tech Stack

### Frontend
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State**: React hooks + wagmi

### Web3
- **Chain**: Base Mainnet (Chain ID: 8453)
- **Wallet**: RainbowKit + wagmi v2
- **Client**: viem
- **Social**: Farcaster Mini App SDK

### Smart Contracts
- **Language**: Solidity 0.8.21
- **Standards**: ERC-721 (NFTs)
- **Libraries**: OpenZeppelin

## Contract Architecture

### TipStream (Core)
- Handles all tip transactions
- Collects platform fees
- Triggers NFT minting

### SubscriptionManager
- Manages creator subscription plans
- Handles recurring payments
- Tracks subscription status

### TipNFT
- ERC-721 receipt tokens
- Minted by TipStream contract
- Commemorative proof of tips

### DailyCheckIn
- Standalone engagement contract
- Tracks daily check-ins
- Maintains streak counts

## Data Flow

### Sending a Tip
```
User Action → Frontend → wagmi → TipStream Contract
                                       │
                         ┌─────────────┼─────────────┐
                         ▼             ▼             ▼
                     Treasury      Creator       TipNFT
                    (receives     (receives     (mints
                      fee)          tip)        receipt)
```

### Creating Subscription
```
Creator Setup → setPlan() → SubscriptionManager
                                    │
User Subscribe → subscribe() ──────┤
                                    │
                     ┌──────────────┴──────────────┐
                     ▼                             ▼
                  Creator                    Subscription
                 (receives                     (recorded)
                  payment)
```

## Directory Structure

```
tipstream-pro/
├── contracts/              # Solidity smart contracts
│   ├── TipStream.sol
│   ├── SubscriptionManager.sol
│   ├── TipNFT.sol
│   └── DailyCheckIn.sol
├── frontend/              # Next.js application
│   ├── src/
│   │   ├── app/          # Pages and routes
│   │   ├── components/   # React components
│   │   ├── config/       # Contract configs and ABIs
│   │   ├── hooks/        # Custom React hooks
│   │   ├── providers/    # Context providers
│   │   ├── types/        # TypeScript definitions
│   │   ├── utils/        # Utility functions
│   │   └── constants/    # Application constants
│   └── public/           # Static assets
├── docs/                  # Documentation
├── scripts/               # Deployment scripts
├── metadata/              # NFT metadata files
└── images/                # NFT images
```

## Security Model

### Contract Security
- Owner-only administrative functions
- Custom errors for gas efficiency
- No upgradability (immutable)

### Frontend Security
- No private keys in code
- Environment variables for configs
- Secure wallet connections

## Deployment

### Contracts
Deployed and verified on Base Mainnet via Remix IDE.

### Frontend
Deployed to Vercel with automatic CI/CD from GitHub.

### NFT Metadata
Hosted on GitHub Pages for decentralized access.

## Performance Considerations

- Base L2 for low gas costs
- Optimistic updates in UI
- Efficient contract design
- Client-side caching

## Future Roadmap

1. Multi-chain support
2. Creator analytics dashboard
3. Referral system
4. Mobile app (React Native)
5. DAO governance
