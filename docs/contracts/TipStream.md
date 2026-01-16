# TipStream Contract

Core tipping contract for the TipStream Pro platform.

## Overview

TipStream is the main contract that handles micro-tips between users. It collects a small platform fee and optionally mints NFT receipts for each tip.

## Contract Details

- **Solidity Version**: ^0.8.21
- **License**: MIT
- **Deployed Address**: `0x9FB4486fD78aB583f091958E331b7A805c5775d4`

## Features

### Tipping
- Send ETH tips to any address
- Configurable platform fee
- Optional note with each tip
- Optional NFT receipt minting

### Fee Management
- Flat fee per transaction (not percentage)
- Owner can update fee amount
- Owner can change treasury address

### NFT Integration
- Automatic NFT minting for tips
- Configurable NFT contract address

## Events

| Event | Parameters | Description |
|-------|------------|-------------|
| `Tip` | `from`, `to`, `amount`, `fee`, `note` | Emitted on successful tip |
| `FeeUpdated` | `oldFee`, `newFee` | Emitted when fee changes |
| `TreasuryUpdated` | `oldTreasury`, `newTreasury` | Emitted when treasury changes |

## Functions

### Read Functions

| Function | Returns | Description |
|----------|---------|-------------|
| `owner()` | `address` | Contract owner |
| `treasury()` | `address` | Fee recipient address |
| `fee()` | `uint256` | Current fee in wei |
| `tipNft()` | `address` | NFT contract address |

### Write Functions

| Function | Access | Description |
|----------|--------|-------------|
| `tip(creator, note, mintReceipt)` | Public | Send tip with optional NFT |
| `setFee(uint256)` | Owner only | Update platform fee |
| `setTreasury(address)` | Owner only | Update treasury address |
| `setTipNft(address)` | Owner only | Update NFT contract |

## Tip Flow

```
1. User sends: tipAmount + fee
2. Contract splits payment:
   - fee → treasury
   - tipAmount → creator
3. If mintReceipt=true:
   - NFT minted to sender
4. Emit Tip event
```

## Constructor

```solidity
constructor(
    address _treasury,    // Fee recipient
    uint256 _fee,        // Fee in wei (e.g., 10000000000000 = 0.00001 ETH)
    address _tipNft      // TipNFT contract (can be zero address initially)
)
```

## Error Handling

| Error | Condition |
|-------|-----------|
| `NotOwner()` | Non-owner calling owner function |
| `InvalidAmount()` | msg.value <= fee |
| `TransferFailed()` | ETH transfer failed |

## Gas Costs

| Operation | Approximate Gas |
|-----------|-----------------|
| Tip (no NFT) | ~55,000 |
| Tip (with NFT) | ~120,000 |
| Set fee | ~25,000 |
| Set treasury | ~25,000 |

## Integration

### Frontend Integration

```typescript
import { parseEther } from 'viem';

const tipAmount = parseEther('0.001');
const platformFee = parseEther('0.00001');

writeContract({
  address: TIPSTREAM_ADDRESS,
  abi: TipStreamABI,
  functionName: 'tip',
  args: [creatorAddress, 'Great content!', true],
  value: tipAmount + platformFee,
});
```

### Reading Total Tips

Track tips by listening to `Tip` events:

```typescript
const logs = await publicClient.getLogs({
  address: TIPSTREAM_ADDRESS,
  event: parseAbiItem('event Tip(address indexed from, address indexed to, uint256 amount, uint256 fee, string note)'),
  fromBlock: 'earliest',
});
```

## Security Considerations

- Uses custom errors for gas efficiency
- Simple access control (single owner)
- No reentrancy risks (transfers after state changes)
- Receive function for emergency ETH recovery

## Upgrade Path

Contract is not upgradeable. For upgrades:
1. Deploy new contract
2. Update frontend to new address
3. Migrate NFT minting permissions

## License

MIT License
