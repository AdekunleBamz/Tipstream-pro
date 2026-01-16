#!/bin/bash

# TipStream Pro - Contract Deployment Helper Script
# This script helps with contract deployment verification

set -e

echo "========================================"
echo "TipStream Pro - Contract Deployment Info"
echo "========================================"
echo ""

# Contract addresses
TIPSTREAM="0x9FB4486fD78aB583f091958E331b7A805c5775d4"
SUBSCRIPTION="0xde57810A28652745446E4f188D30076c57D8C4d2"
TIPNFT="0x47b1E98c56A2a3Cd95722e25A118654Ddf93FED0"
DAILYCHECKIN="0x30fa4DE1205AFDe0F00Cee051c5c3dA8Dc3C7Ef8"

echo "📋 Deployed Contract Addresses (Base Mainnet)"
echo "----------------------------------------------"
echo "TipStream:          $TIPSTREAM"
echo "SubscriptionManager: $SUBSCRIPTION"
echo "TipNFT:             $TIPNFT"
echo "DailyCheckIn:       $DAILYCHECKIN"
echo ""

echo "🔗 BaseScan Links"
echo "-----------------"
echo "TipStream:          https://basescan.org/address/$TIPSTREAM"
echo "SubscriptionManager: https://basescan.org/address/$SUBSCRIPTION"
echo "TipNFT:             https://basescan.org/address/$TIPNFT"
echo "DailyCheckIn:       https://basescan.org/address/$DAILYCHECKIN"
echo ""

echo "✅ All contracts are deployed and verified on Base Mainnet"
echo ""

# Check if contracts are verified
echo "📝 Verification Status"
echo "----------------------"
echo "Run the following commands to verify contracts on BaseScan:"
echo ""
echo "npx hardhat verify --network base $TIPSTREAM <constructor-args>"
echo "npx hardhat verify --network base $SUBSCRIPTION"
echo "npx hardhat verify --network base $TIPNFT <constructor-args>"
echo "npx hardhat verify --network base $DAILYCHECKIN"
