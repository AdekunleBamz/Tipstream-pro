# TipStream Smart Contract

## Overview

TipStream is the core tipping contract that enables micro-tips between users with optional NFT receipt minting.

## Contract Address

**Base Mainnet**: `0x9FB4486fD78aB583f091958E331b7A805c5775d4`

## Features

- Send tips to any creator address
- Automatic platform fee deduction
- Optional NFT receipt minting
- Owner-controlled fee management
- Treasury management

## Functions

### Public Functions

#### `tip(address creator, string note, bool mintReceipt)`

Send a tip to a creator.

**Parameters:**
- `creator`: The recipient's wallet address
- `note`: Optional message (up to 280 characters)
- `mintReceipt`: Whether to mint an NFT receipt

**Value:** Must send tip amount + platform fee

**Example:**
```solidity
tipStream.tip{value: 0.001 ether + fee}(creatorAddress, "Great content!", true);
```

### View Functions

#### `fee()`
Returns the current platform fee in wei.

#### `treasury()`
Returns the current treasury address.

#### `tipNft()`
Returns the TipNFT contract address.

### Owner Functions

#### `setFee(uint256 newFee)`
Update the platform fee.

#### `setTreasury(address newTreasury)`
Update the treasury address.

#### `setTipNft(address _tipNft)`
Update the TipNFT contract address.

## Events

### `Tip(address indexed from, address indexed to, uint256 amount, uint256 fee, string note)`
Emitted when a tip is sent.

### `FeeUpdated(uint256 oldFee, uint256 newFee)`
Emitted when the fee is updated.

### `TreasuryUpdated(address indexed oldTreasury, address indexed newTreasury)`
Emitted when the treasury is updated.

## Errors

- `NotOwner()`: Caller is not the contract owner
- `InvalidAmount()`: Tip amount is insufficient
- `TransferFailed()`: ETH transfer failed

## Security Considerations

1. All tips are sent directly to creators (non-custodial)
2. Platform fee is sent to treasury
3. Only owner can modify contract parameters
4. No user funds are stored in the contract
