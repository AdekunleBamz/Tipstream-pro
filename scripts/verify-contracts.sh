#!/bin/bash

# ================================================
# TipStream Pro - Contract Verification Script
# ================================================
# Verifies deployed contracts on Basescan
# Usage: ./verify-contracts.sh [deployment-file]

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

DEPLOY_FILE=$1

echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     TipStream Pro - Contract Verification      ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
echo ""

# Find latest deployment file if not provided
if [ -z "$DEPLOY_FILE" ]; then
    DEPLOY_FILE=$(ls -t deployments/*.json 2>/dev/null | head -1)
    
    if [ -z "$DEPLOY_FILE" ]; then
        echo -e "${RED}Error: No deployment file found${NC}"
        echo "Run deploy-contracts.sh first or provide a deployment file"
        exit 1
    fi
    
    echo -e "${YELLOW}Using latest deployment: $DEPLOY_FILE${NC}"
fi

# Load environment
source .env

if [ -z "$BASESCAN_API_KEY" ]; then
    echo -e "${RED}Error: BASESCAN_API_KEY not set in .env${NC}"
    exit 1
fi

# Parse deployment file
NETWORK=$(jq -r '.network' $DEPLOY_FILE)
CHAIN_ID=$(jq -r '.chainId' $DEPLOY_FILE)
TIP_NFT=$(jq -r '.contracts.TipNFT' $DEPLOY_FILE)
TIP_STREAM=$(jq -r '.contracts.TipStream' $DEPLOY_FILE)
SUBSCRIPTION=$(jq -r '.contracts.SubscriptionManager' $DEPLOY_FILE)
CHECKIN=$(jq -r '.contracts.DailyCheckIn' $DEPLOY_FILE)

echo -e "Network: ${GREEN}$NETWORK${NC} (Chain ID: $CHAIN_ID)"
echo ""

# Set explorer URL
case $NETWORK in
    base-mainnet)
        ETHERSCAN_URL="https://api.basescan.org/api"
        ;;
    base-sepolia)
        ETHERSCAN_URL="https://api-sepolia.basescan.org/api"
        ;;
    *)
        echo -e "${RED}Error: Verification not supported for $NETWORK${NC}"
        exit 1
        ;;
esac

# Navigate to contracts directory
cd contracts

# Verify TipNFT
echo -e "${YELLOW}Verifying TipNFT at $TIP_NFT...${NC}"
forge verify-contract \
    --chain-id $CHAIN_ID \
    --etherscan-api-key $BASESCAN_API_KEY \
    --watch \
    $TIP_NFT \
    src/TipNFT.sol:TipNFT || echo -e "${YELLOW}TipNFT verification may already exist${NC}"

echo ""

# Verify TipStream
echo -e "${YELLOW}Verifying TipStream at $TIP_STREAM...${NC}"
forge verify-contract \
    --chain-id $CHAIN_ID \
    --etherscan-api-key $BASESCAN_API_KEY \
    --constructor-args $(cast abi-encode "constructor(address)" $TIP_NFT) \
    --watch \
    $TIP_STREAM \
    src/TipStream.sol:TipStream || echo -e "${YELLOW}TipStream verification may already exist${NC}"

echo ""

# Verify SubscriptionManager
echo -e "${YELLOW}Verifying SubscriptionManager at $SUBSCRIPTION...${NC}"
forge verify-contract \
    --chain-id $CHAIN_ID \
    --etherscan-api-key $BASESCAN_API_KEY \
    --watch \
    $SUBSCRIPTION \
    src/SubscriptionManager.sol:SubscriptionManager || echo -e "${YELLOW}SubscriptionManager verification may already exist${NC}"

echo ""

# Verify DailyCheckIn
echo -e "${YELLOW}Verifying DailyCheckIn at $CHECKIN...${NC}"
forge verify-contract \
    --chain-id $CHAIN_ID \
    --etherscan-api-key $BASESCAN_API_KEY \
    --watch \
    $CHECKIN \
    src/DailyCheckIn.sol:DailyCheckIn || echo -e "${YELLOW}DailyCheckIn verification may already exist${NC}"

cd ..

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║      Contract Verification Complete!           ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════╝${NC}"
echo ""
echo "View on Basescan:"
case $NETWORK in
    base-mainnet)
        echo "  TipNFT: https://basescan.org/address/$TIP_NFT"
        echo "  TipStream: https://basescan.org/address/$TIP_STREAM"
        echo "  SubscriptionManager: https://basescan.org/address/$SUBSCRIPTION"
        echo "  DailyCheckIn: https://basescan.org/address/$CHECKIN"
        ;;
    base-sepolia)
        echo "  TipNFT: https://sepolia.basescan.org/address/$TIP_NFT"
        echo "  TipStream: https://sepolia.basescan.org/address/$TIP_STREAM"
        echo "  SubscriptionManager: https://sepolia.basescan.org/address/$SUBSCRIPTION"
        echo "  DailyCheckIn: https://sepolia.basescan.org/address/$CHECKIN"
        ;;
esac