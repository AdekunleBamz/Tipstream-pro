# TipNFT Contract

ERC-721 NFT receipt contract for the TipStream Pro platform.

## Overview

TipNFT mints commemorative NFT receipts whenever users send tips through the TipStream platform. Each NFT serves as proof of the tip transaction and can be collected by users.

## Contract Details

- **Token Name**: TipStream Receipt
- **Token Symbol**: TIPR
- **Standard**: ERC-721
- **Solidity Version**: ^0.8.21

## Features

### Minting
- Only authorized minters (TipStream contract) can mint receipts
- Each tip can optionally mint an NFT receipt
- Auto-incrementing token IDs

### Access Control
- Owner can update base URI for metadata
- Owner can change authorized minter address
- Only minter or owner can mint receipts

## Events

| Event | Parameters | Description |
|-------|------------|-------------|
| `ReceiptMinted` | `to`, `tokenId`, `amount`, `note` | Emitted when NFT receipt is minted |
| `BaseURIUpdated` | `oldBase`, `newBase` | Emitted when metadata URI changes |
| `MinterUpdated` | `oldMinter`, `newMinter` | Emitted when minter address changes |

## Functions

### Read Functions

| Function | Returns | Description |
|----------|---------|-------------|
| `nextId()` | `uint256` | Next token ID to be minted |
| `minter()` | `address` | Authorized minter address |
| `balanceOf(address)` | `uint256` | Number of NFTs owned by address |
| `ownerOf(uint256)` | `address` | Owner of specific token ID |
| `tokenURI(uint256)` | `string` | Metadata URI for token |

### Write Functions

| Function | Access | Description |
|----------|--------|-------------|
| `mintReceipt(to, amount, note)` | Minter only | Mint new receipt NFT |
| `setMinter(address)` | Owner only | Update authorized minter |
| `setBaseURI(string)` | Owner only | Update metadata base URI |

## Metadata

NFT metadata follows the ERC-721 metadata standard:

```json
{
  "name": "TipStream Receipt #1",
  "description": "Tip receipt from TipStream Pro",
  "image": "https://adekunlebamz.github.io/Tipstream-pro/images/receipt.svg",
  "attributes": [
    {
      "trait_type": "Platform",
      "value": "TipStream Pro"
    }
  ]
}
```

## Deployment

```solidity
constructor(
    string memory baseURI_,      // Metadata base URI
    address initialOwner,        // Contract owner
    address _minter             // TipStream contract address
)
```

## Integration

After deployment, set the TipNFT address on the TipStream contract:

```solidity
tipStream.setTipNft(tipNftAddress);
```

## Security

- Non-transferable receipts option available
- Owner-controlled minter authorization
- Standard ERC-721 security patterns

## License

MIT License
