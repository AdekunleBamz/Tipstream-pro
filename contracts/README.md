# TipStream Pro Smart Contracts

Solidity smart contracts for the TipStream micro-tipping platform on Base chain.

## Overview

TipStream Pro consists of four main contracts:

| Contract | Description |
|----------|-------------|
| `TipStream.sol` | Core tipping logic with platform fees |
| `TipNFT.sol` | ERC-721 commemorative tip NFTs |
| `SubscriptionManager.sol` | Monthly creator subscriptions |
| `DailyCheckIn.sol` | Gamification with daily rewards |

## Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation) (forge, cast, anvil)
- Node.js 18+ (for scripts)

## Quick Start

```bash
# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Navigate to contracts directory
cd contracts

# Copy environment file
cp .env.example .env
# Edit .env with your values

# Build contracts
forge build

# Run tests
forge test

# Deploy to Base Sepolia
../scripts/deploy-contracts.sh base-sepolia

# Verify on Basescan
../scripts/verify-contracts.sh
```

## Contract Details

### TipStream.sol

The main tipping contract that handles ETH tips between users.

**Key Features:**
- Send tips with optional messages
- Platform fee collection (configurable)
- Event emission for frontend indexing
- Integration with TipNFT for commemorative minting

**Functions:**
```solidity
function tip(address creator, string calldata message) external payable
function withdrawFees() external onlyOwner
function setFeeRecipient(address _recipient) external onlyOwner
function setPlatformFeeBps(uint256 _feeBps) external onlyOwner
```

### TipNFT.sol

ERC-721 contract for minting commemorative tip NFTs.

**Key Features:**
- Automatic minting on tips (optional)
- Dynamic metadata with tip details
- Supports various tip milestones

**Functions:**
```solidity
function mint(address to, uint256 tipAmount) external
function tokenURI(uint256 tokenId) public view returns (string memory)
function setBaseURI(string calldata _baseURI) external onlyOwner
```

### SubscriptionManager.sol

Handles recurring creator subscriptions.

**Key Features:**
- Monthly subscription tiers
- Auto-renewal support
- Grace period for expiring subscriptions
- Subscriber benefits tracking

**Functions:**
```solidity
function subscribe(address creator) external payable
function renewSubscription(address creator) external payable
function cancelSubscription(address creator) external
function isActiveSubscriber(address subscriber, address creator) public view returns (bool)
```

### DailyCheckIn.sol

Gamification contract for daily engagement rewards.

**Key Features:**
- Daily check-in tracking
- Streak counter with bonuses
- Points/reward accumulation
- Leaderboard support

**Functions:**
```solidity
function checkIn() external
function getStreak(address user) external view returns (uint256)
function getLastCheckIn(address user) external view returns (uint256)
function getPoints(address user) external view returns (uint256)
```

## Testing

```bash
# Run all tests
forge test

# Run with verbosity
forge test -vvv

# Run specific test
forge test --match-test testTipWithMessage

# Gas report
forge test --gas-report

# Coverage
forge coverage
```

## Deployment

### Local Development

```bash
# Start local node
anvil

# Deploy to local
./scripts/deploy-contracts.sh localhost
```

### Testnet (Base Sepolia)

```bash
# Ensure .env has BASE_SEPOLIA_RPC and PRIVATE_KEY
./scripts/deploy-contracts.sh base-sepolia

# Verify contracts
./scripts/verify-contracts.sh
```

### Mainnet (Base)

```bash
# ⚠️ Double-check everything before mainnet deployment
./scripts/deploy-contracts.sh base-mainnet

# Verify
./scripts/verify-contracts.sh
```

## Security Considerations

- All contracts use OpenZeppelin libraries where applicable
- Owner functions protected with `onlyOwner` modifier
- Reentrancy guards on external calls
- Fee calculations checked for overflow

## Deployed Addresses

### Base Mainnet (Chain ID: 8453)

| Contract | Address |
|----------|---------|
| TipStream | `0x9FB4486fD78aB583f091958E331b7A805c5775d4` |
| TipNFT | `0x47b1E98c56A2a3Cd95722e25A118654Ddf93FED0` |
| SubscriptionManager | `0xde57810A28652745446E4f188D30076c57D8C4d2` |
| DailyCheckIn | `0x30fa4DE1205AFDe0F00Cee051c5c3dA8Dc3C7Ef8` |

## Gas Optimization

- Minimal storage writes
- Use of immutable variables
- Batch operations where possible
- Event-based data instead of storage

## License

MIT License - see [LICENSE](../LICENSE) for details.
