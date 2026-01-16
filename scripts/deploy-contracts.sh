#!/bin/bash

# ================================================
# TipStream Pro - Contract Deployment Script
# ================================================
# This script helps deploy TipStream contracts to Base chain
# Usage: ./deploy-contracts.sh [network]
# Networks: base-mainnet, base-sepolia, localhost

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default network
NETWORK=${1:-base-sepolia}

echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     TipStream Pro - Contract Deployment        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
echo ""

# Check for required tools
check_requirements() {
    echo -e "${YELLOW}Checking requirements...${NC}"
    
    if ! command -v forge &> /dev/null; then
        echo -e "${RED}Error: Foundry (forge) is not installed${NC}"
        echo "Install: curl -L https://foundry.paradigm.xyz | bash"
        exit 1
    fi
    
    if [ ! -f ".env" ]; then
        echo -e "${RED}Error: .env file not found${NC}"
        echo "Create a .env file with PRIVATE_KEY and RPC_URL"
        exit 1
    fi
    
    echo -e "${GREEN}✓ All requirements met${NC}"
}

# Load environment variables
load_env() {
    echo -e "${YELLOW}Loading environment...${NC}"
    source .env
    
    if [ -z "$PRIVATE_KEY" ]; then
        echo -e "${RED}Error: PRIVATE_KEY not set in .env${NC}"
        exit 1
    fi
    
    case $NETWORK in
        base-mainnet)
            RPC_URL=${BASE_MAINNET_RPC:-"https://mainnet.base.org"}
            CHAIN_ID=8453
            ETHERSCAN_KEY=$BASESCAN_API_KEY
            ;;
        base-sepolia)
            RPC_URL=${BASE_SEPOLIA_RPC:-"https://sepolia.base.org"}
            CHAIN_ID=84532
            ETHERSCAN_KEY=$BASESCAN_API_KEY
            ;;
        localhost)
            RPC_URL="http://localhost:8545"
            CHAIN_ID=31337
            ;;
        *)
            echo -e "${RED}Error: Unknown network '$NETWORK'${NC}"
            echo "Supported: base-mainnet, base-sepolia, localhost"
            exit 1
            ;;
    esac
    
    echo -e "${GREEN}✓ Environment loaded for $NETWORK${NC}"
}

# Build contracts
build_contracts() {
    echo -e "${YELLOW}Building contracts...${NC}"
    
    cd contracts
    forge build
    
    echo -e "${GREEN}✓ Contracts built successfully${NC}"
}

# Deploy contracts
deploy_contracts() {
    echo -e "${YELLOW}Deploying contracts to $NETWORK...${NC}"
    echo ""
    
    # Deploy TipNFT first
    echo -e "${BLUE}1/4 Deploying TipNFT...${NC}"
    TIP_NFT_ADDRESS=$(forge create --rpc-url $RPC_URL \
        --private-key $PRIVATE_KEY \
        --json \
        src/TipNFT.sol:TipNFT | jq -r '.deployedTo')
    echo -e "${GREEN}   TipNFT deployed at: $TIP_NFT_ADDRESS${NC}"
    
    # Deploy TipStream
    echo -e "${BLUE}2/4 Deploying TipStream...${NC}"
    TIP_STREAM_ADDRESS=$(forge create --rpc-url $RPC_URL \
        --private-key $PRIVATE_KEY \
        --constructor-args $TIP_NFT_ADDRESS \
        --json \
        src/TipStream.sol:TipStream | jq -r '.deployedTo')
    echo -e "${GREEN}   TipStream deployed at: $TIP_STREAM_ADDRESS${NC}"
    
    # Deploy SubscriptionManager
    echo -e "${BLUE}3/4 Deploying SubscriptionManager...${NC}"
    SUBSCRIPTION_ADDRESS=$(forge create --rpc-url $RPC_URL \
        --private-key $PRIVATE_KEY \
        --json \
        src/SubscriptionManager.sol:SubscriptionManager | jq -r '.deployedTo')
    echo -e "${GREEN}   SubscriptionManager deployed at: $SUBSCRIPTION_ADDRESS${NC}"
    
    # Deploy DailyCheckIn
    echo -e "${BLUE}4/4 Deploying DailyCheckIn...${NC}"
    CHECKIN_ADDRESS=$(forge create --rpc-url $RPC_URL \
        --private-key $PRIVATE_KEY \
        --json \
        src/DailyCheckIn.sol:DailyCheckIn | jq -r '.deployedTo')
    echo -e "${GREEN}   DailyCheckIn deployed at: $CHECKIN_ADDRESS${NC}"
    
    cd ..
    
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║         All Contracts Deployed!                ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════╝${NC}"
}

# Save deployment addresses
save_addresses() {
    echo -e "${YELLOW}Saving deployment addresses...${NC}"
    
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    DEPLOY_FILE="deployments/${NETWORK}_${TIMESTAMP}.json"
    
    mkdir -p deployments
    
    cat > $DEPLOY_FILE << EOF
{
  "network": "$NETWORK",
  "chainId": $CHAIN_ID,
  "deployedAt": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "contracts": {
    "TipNFT": "$TIP_NFT_ADDRESS",
    "TipStream": "$TIP_STREAM_ADDRESS",
    "SubscriptionManager": "$SUBSCRIPTION_ADDRESS",
    "DailyCheckIn": "$CHECKIN_ADDRESS"
  }
}
EOF
    
    echo -e "${GREEN}✓ Addresses saved to $DEPLOY_FILE${NC}"
}

# Main execution
main() {
    check_requirements
    load_env
    build_contracts
    deploy_contracts
    save_addresses
    
    echo ""
    echo -e "${GREEN}Deployment complete!${NC}"
    echo -e "Update your frontend config with the new addresses."
}

main