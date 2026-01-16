# TipStream Pro Scripts

This directory contains utility scripts for deployment, verification, and maintenance.

## Scripts

### check-deployment.sh

Displays deployed contract addresses and BaseScan links.

```bash
./scripts/check-deployment.sh
```

## Future Scripts

- `deploy-contracts.js` - Hardhat deployment script
- `verify-contracts.js` - Contract verification
- `generate-metadata.js` - NFT metadata generation
- `export-abis.js` - ABI export utility

## Usage

Make scripts executable:
```bash
chmod +x scripts/*.sh
```

## Requirements

- Node.js 18+
- Hardhat (for deployment scripts)
- Environment variables configured
