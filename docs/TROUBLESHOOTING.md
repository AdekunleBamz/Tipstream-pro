# TipStream Pro Troubleshooting Guide

This guide helps resolve common issues encountered while using or developing TipStream Pro.

## Table of Contents

- [Wallet Connection Issues](#wallet-connection-issues)
- [Transaction Failures](#transaction-failures)
- [Network Issues](#network-issues)
- [Frontend Issues](#frontend-issues)
- [Smart Contract Issues](#smart-contract-issues)
- [Build Issues](#build-issues)
- [Performance Issues](#performance-issues)

## Wallet Connection Issues

### Cannot Connect Wallet

**Symptoms:**
- "Connect Wallet" button doesn't respond
- Wallet popup doesn't appear
- Connection times out

**Solutions:**

1. **Check Browser Extension**
   - Ensure MetaMask/wallet extension is installed and unlocked
   - Try refreshing the page after unlocking

2. **Check WalletConnect Project ID**
   ```bash
   # Verify env variable is set
   echo $NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID
   ```

3. **Clear Browser Storage**
   ```javascript
   // In browser console
   localStorage.clear();
   sessionStorage.clear();
   location.reload();
   ```

4. **Try Different Browser**
   - Some browsers block wallet popups
   - Disable popup blockers for TipStream

### Wallet Disconnects Randomly

**Symptoms:**
- User is logged out unexpectedly
- "Connect Wallet" appears after page reload

**Solutions:**

1. **Check Wagmi Persistence**
   ```typescript
   // Ensure storage is configured
   const config = createConfig({
     // ...
     storage: createStorage({
       storage: localStorage
     })
   });
   ```

2. **Check for Conflicting Extensions**
   - Multiple wallet extensions can conflict
   - Try disabling other wallet extensions

### Wrong Network

**Symptoms:**
- "Wrong network" error displayed
- Transactions fail with network mismatch

**Solutions:**

1. **Switch Network in Wallet**
   - Open wallet extension
   - Switch to Base Mainnet (8453) or Base Sepolia (84532)

2. **Add Base Network**
   ```javascript
   // Request network add
   await window.ethereum.request({
     method: 'wallet_addEthereumChain',
     params: [{
       chainId: '0x2105', // 8453
       chainName: 'Base',
       rpcUrls: ['https://mainnet.base.org'],
       nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
       blockExplorerUrls: ['https://basescan.org']
     }]
   });
   ```

## Transaction Failures

### Insufficient Funds

**Symptoms:**
- "Insufficient funds for gas" error
- Transaction rejected before confirmation

**Solutions:**

1. **Check Balance**
   - Ensure wallet has enough ETH for tip amount + gas
   - On Base, gas is typically 0.0001-0.001 ETH

2. **Get Testnet ETH**
   - For Base Sepolia: [Base Faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet)

### Transaction Pending Forever

**Symptoms:**
- Transaction stuck in pending state
- Block explorer shows pending

**Solutions:**

1. **Speed Up Transaction**
   - In MetaMask: click "Speed Up"
   - Increase gas price

2. **Cancel Transaction**
   - Send 0 ETH to yourself with same nonce
   - Use "Cancel" in MetaMask

3. **Reset Account**
   - MetaMask → Settings → Advanced → Reset Account
   - ⚠️ This clears transaction history

### Transaction Reverted

**Symptoms:**
- "Transaction reverted" error
- "Execution reverted" in explorer

**Common Causes:**

1. **Invalid Recipient**
   ```
   Error: Cannot tip yourself
   Solution: Use a different recipient address
   ```

2. **Zero Amount**
   ```
   Error: Amount must be greater than 0
   Solution: Enter a positive tip amount
   ```

3. **Contract Paused**
   ```
   Error: Contract is paused
   Solution: Wait for contract unpause (admin action)
   ```

4. **Check Revert Reason**
   - View transaction on BaseScan
   - Check "Revert reason" in transaction details

## Network Issues

### RPC Connection Failed

**Symptoms:**
- "Network unavailable" error
- Cannot fetch on-chain data

**Solutions:**

1. **Check RPC URL**
   ```bash
   # Test RPC connection
   curl -X POST https://mainnet.base.org \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
   ```

2. **Use Alternative RPC**
   ```typescript
   // Configure fallback transports
   const config = createConfig({
     chains: [base],
     transports: {
       [base.id]: fallback([
         http('https://mainnet.base.org'),
         http('https://base.llamarpc.com'),
         http('https://1rpc.io/base'),
       ])
     }
   });
   ```

3. **Check Alchemy/QuickNode Status**
   - Visit provider status page
   - Check API key quota

### Rate Limited

**Symptoms:**
- 429 errors in console
- Intermittent data loading

**Solutions:**

1. **Reduce Request Frequency**
   ```typescript
   // Add polling interval
   const { data } = useReadContract({
     // ...
     query: {
       refetchInterval: 30000, // 30 seconds instead of 4
     }
   });
   ```

2. **Upgrade RPC Plan**
   - Free tier has limited requests
   - Consider paid Alchemy/QuickNode plan

## Frontend Issues

### Page Not Loading

**Symptoms:**
- White screen
- Infinite loading spinner

**Solutions:**

1. **Check Console Errors**
   - Open Developer Tools (F12)
   - Check Console tab for errors

2. **Clear Cache**
   ```bash
   # Clear Next.js cache
   rm -rf .next
   npm run build
   ```

3. **Check Environment Variables**
   - Ensure all `NEXT_PUBLIC_*` vars are set
   - Restart dev server after changes

### Styling Issues

**Symptoms:**
- Unstyled components
- CSS not loading

**Solutions:**

1. **Rebuild Tailwind**
   ```bash
   npm run build:css
   ```

2. **Check PostCSS Config**
   ```javascript
   // postcss.config.mjs
   export default {
     plugins: {
       '@tailwindcss/postcss': {}
     }
   };
   ```

### Data Not Updating

**Symptoms:**
- Stale data displayed
- Changes not reflected

**Solutions:**

1. **Invalidate Queries**
   ```typescript
   import { useQueryClient } from '@tanstack/react-query';
   
   const queryClient = useQueryClient();
   queryClient.invalidateQueries({ queryKey: ['tips'] });
   ```

2. **Force Refetch**
   ```typescript
   const { refetch } = useReadContract({...});
   await refetch();
   ```

## Smart Contract Issues

### Contract Not Found

**Symptoms:**
- "Contract not deployed" error
- Empty response from contract calls

**Solutions:**

1. **Check Contract Address**
   ```typescript
   // Verify address is correct for network
   console.log('Contract:', CONTRACT_ADDRESS);
   console.log('Chain:', chainId);
   ```

2. **Verify Deployment**
   - Check address on BaseScan
   - Ensure contract is verified

### ABI Mismatch

**Symptoms:**
- "Invalid function" error
- Decoding failures

**Solutions:**

1. **Update ABI**
   - Regenerate ABI from contract
   - Ensure ABI matches deployed version

2. **Check Function Signature**
   ```typescript
   // Verify function exists in ABI
   console.log(abi.find(x => x.name === 'sendTip'));
   ```

## Build Issues

### Build Fails

**Symptoms:**
- `npm run build` exits with error
- TypeScript compilation errors

**Solutions:**

1. **Check TypeScript Errors**
   ```bash
   npx tsc --noEmit
   ```

2. **Update Dependencies**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Check ESLint**
   ```bash
   npm run lint -- --fix
   ```

### Out of Memory

**Symptoms:**
- "JavaScript heap out of memory"
- Build killed

**Solutions:**

1. **Increase Node Memory**
   ```bash
   NODE_OPTIONS="--max-old-space-size=4096" npm run build
   ```

2. **Reduce Bundle Size**
   - Enable dynamic imports
   - Remove unused dependencies

## Performance Issues

### Slow Page Load

**Symptoms:**
- Pages take > 3 seconds to load
- Large JavaScript bundles

**Solutions:**

1. **Analyze Bundle**
   ```bash
   ANALYZE=true npm run build
   ```

2. **Enable Lazy Loading**
   ```typescript
   const HeavyComponent = dynamic(
     () => import('./HeavyComponent'),
     { loading: () => <Skeleton /> }
   );
   ```

3. **Optimize Images**
   - Use Next.js Image component
   - Serve WebP format

### Slow Contract Calls

**Symptoms:**
- Long wait for blockchain data
- UI feels sluggish

**Solutions:**

1. **Use Multicall**
   ```typescript
   import { multicall } from 'viem/actions';
   
   const results = await multicall(client, {
     contracts: [
       { address, abi, functionName: 'balanceOf', args: [user] },
       { address, abi, functionName: 'totalSupply' },
     ]
   });
   ```

2. **Cache Results**
   ```typescript
   const { data } = useReadContract({
     query: {
       staleTime: 60000, // Cache for 1 minute
     }
   });
   ```

## Getting More Help

If you're still experiencing issues:

1. **Check GitHub Issues**: [TipStream Issues](https://github.com/AdekunleBamz/Tipstream-pro/issues)
2. **Join Discord**: Community support channel
3. **Open New Issue**: Include reproduction steps, error messages, and environment details

---

Remember to check the browser console and network tab for detailed error information before reporting issues.
