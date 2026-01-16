# TipStream Pro Deployment Guide

This guide covers deploying TipStream Pro to production environments.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Frontend Deployment](#frontend-deployment)
- [Smart Contract Deployment](#smart-contract-deployment)
- [Post-Deployment](#post-deployment)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Tools

- Node.js 18+
- npm/yarn/pnpm
- Git
- Foundry (for contracts)
- Vercel CLI (optional)

### Required Accounts

- [Vercel](https://vercel.com) - Frontend hosting
- [Alchemy](https://alchemy.com) or [QuickNode](https://quicknode.com) - RPC provider
- [BaseScan](https://basescan.org) - Contract verification
- [WalletConnect](https://walletconnect.com) - Wallet connection

## Environment Setup

### Frontend Environment Variables

Create a `.env.local` file in the `frontend/` directory:

```bash
# Required
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_ALCHEMY_ID=your_alchemy_api_key

# Contract Addresses (after deployment)
NEXT_PUBLIC_TIPSTREAM_ADDRESS=0x...
NEXT_PUBLIC_SUBSCRIPTION_MANAGER_ADDRESS=0x...
NEXT_PUBLIC_TIP_NFT_ADDRESS=0x...
NEXT_PUBLIC_DAILY_CHECKIN_ADDRESS=0x...

# Network Configuration
NEXT_PUBLIC_CHAIN_ID=8453
NEXT_PUBLIC_CHAIN_NAME=Base

# Optional
NEXT_PUBLIC_FARCASTER_API_URL=https://api.farcaster.xyz
SENTRY_DSN=your_sentry_dsn
```

### Production vs Development

| Variable | Development | Production |
|----------|-------------|------------|
| `CHAIN_ID` | 84532 (Base Sepolia) | 8453 (Base) |
| `RPC_URL` | Testnet RPC | Mainnet RPC |
| `CONTRACTS` | Testnet addresses | Mainnet addresses |

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Connect Repository**

   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Link project
   cd frontend
   vercel link
   ```

2. **Configure Project**

   In Vercel dashboard:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

3. **Add Environment Variables**

   Add all variables from `.env.local` to Vercel:
   - Go to Project Settings → Environment Variables
   - Add each variable for Production/Preview/Development

4. **Deploy**

   ```bash
   # Deploy to preview
   vercel

   # Deploy to production
   vercel --prod
   ```

### Option 2: Self-Hosted

1. **Build the Application**

   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. **Start Production Server**

   ```bash
   npm start
   ```

3. **Using PM2 (Recommended)**

   ```bash
   npm install -g pm2
   pm2 start npm --name "tipstream" -- start
   pm2 save
   ```

4. **Nginx Configuration**

   ```nginx
   server {
       listen 80;
       server_name tipstream.pro;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Option 3: Docker

1. **Create Dockerfile**

   ```dockerfile
   FROM node:18-alpine AS builder
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build

   FROM node:18-alpine AS runner
   WORKDIR /app
   ENV NODE_ENV production
   COPY --from=builder /app/.next/standalone ./
   COPY --from=builder /app/.next/static ./.next/static
   COPY --from=builder /app/public ./public
   EXPOSE 3000
   CMD ["node", "server.js"]
   ```

2. **Build and Run**

   ```bash
   docker build -t tipstream-pro .
   docker run -p 3000:3000 tipstream-pro
   ```

## Smart Contract Deployment

### Using Foundry

1. **Install Dependencies**

   ```bash
   cd contracts
   forge install
   ```

2. **Compile Contracts**

   ```bash
   forge build
   ```

3. **Run Tests**

   ```bash
   forge test
   ```

4. **Deploy to Testnet**

   ```bash
   # Set environment variables
   export PRIVATE_KEY=your_deployer_private_key
   export RPC_URL=https://sepolia.base.org

   # Deploy
   forge script script/Deploy.s.sol:DeployScript \
     --rpc-url $RPC_URL \
     --broadcast \
     --verify
   ```

5. **Deploy to Mainnet**

   ```bash
   export RPC_URL=https://mainnet.base.org

   forge script script/Deploy.s.sol:DeployScript \
     --rpc-url $RPC_URL \
     --broadcast \
     --verify \
     --etherscan-api-key $BASESCAN_API_KEY
   ```

### Contract Verification

Contracts are auto-verified with `--verify` flag. Manual verification:

```bash
forge verify-contract \
  --chain-id 8453 \
  --compiler-version v0.8.21+commit.d9974bed \
  CONTRACT_ADDRESS \
  src/TipStream.sol:TipStream
```

### Deployment Checklist

- [ ] Contracts compiled successfully
- [ ] All tests passing
- [ ] Deployed to testnet first
- [ ] Testnet functionality verified
- [ ] Sufficient mainnet ETH for deployment
- [ ] Contracts verified on BaseScan
- [ ] Frontend updated with new addresses

## Post-Deployment

### Verification Steps

1. **Check Contract Deployment**

   - Verify all contracts on BaseScan
   - Test basic functions via BaseScan

2. **Frontend Verification**

   - Connect wallet successfully
   - Send test tip
   - Check transaction on explorer

3. **Monitoring Setup**

   ```bash
   # Set up uptime monitoring
   curl https://tipstream.pro/api/health
   ```

### Domain Configuration

1. **Add Custom Domain in Vercel**

   - Go to Project Settings → Domains
   - Add `tipstream.pro`
   - Configure DNS records

2. **DNS Records**

   ```
   Type  Name    Value
   A     @       76.76.21.21
   CNAME www     cname.vercel-dns.com
   ```

### SSL/HTTPS

Vercel automatically provisions SSL certificates. For self-hosted:

```bash
# Using Certbot
sudo certbot --nginx -d tipstream.pro -d www.tipstream.pro
```

## Troubleshooting

### Common Issues

**Build Failures**

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

**Contract Deployment Failures**

- Check wallet has sufficient ETH for gas
- Verify RPC endpoint is responsive
- Check private key format

**Environment Variable Issues**

- Ensure all `NEXT_PUBLIC_*` vars are set
- Restart development server after changes
- Check for typos in variable names

**Transaction Failures**

- Check contract addresses are correct
- Verify network matches wallet network
- Check user has sufficient ETH

### Getting Help

- Check [GitHub Issues](https://github.com/AdekunleBamz/Tipstream-pro/issues)
- Join Discord community
- Review deployment logs in Vercel

---

For additional help, please open an issue or contact the team.
