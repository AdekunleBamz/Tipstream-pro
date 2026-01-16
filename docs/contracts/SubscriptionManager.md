# SubscriptionManager Contract Documentation

The SubscriptionManager contract handles creator subscription tiers and subscriber management for the TipStream platform.

## Overview

SubscriptionManager enables creators to offer tiered subscription plans that supporters can purchase with ETH. Subscriptions provide recurring revenue and exclusive access for supporters.

## Contract Address

| Network | Address |
|---------|---------|
| Base Mainnet | `0x...` |
| Base Sepolia | `0x...` |

## Features

- **Multi-Tier Subscriptions**: Creators can define multiple subscription tiers with different prices and benefits
- **Time-Based Access**: Subscriptions are valid for defined periods
- **Auto-Renewal Support**: Infrastructure for subscription renewals
- **Creator Withdrawals**: Creators can withdraw subscription revenue
- **Platform Fees**: Configurable platform fee on subscriptions

## Contract Interface

### Structs

```solidity
struct Tier {
    string name;
    uint256 price;
    uint256 duration; // in seconds
    bool active;
}

struct Subscription {
    address subscriber;
    address creator;
    uint256 tierId;
    uint256 startTime;
    uint256 endTime;
    bool active;
}
```

### Events

```solidity
event TierCreated(
    address indexed creator,
    uint256 indexed tierId,
    string name,
    uint256 price,
    uint256 duration
);

event TierUpdated(
    address indexed creator,
    uint256 indexed tierId,
    string name,
    uint256 price,
    bool active
);

event SubscriptionCreated(
    address indexed subscriber,
    address indexed creator,
    uint256 indexed tierId,
    uint256 startTime,
    uint256 endTime
);

event SubscriptionRenewed(
    address indexed subscriber,
    address indexed creator,
    uint256 indexed tierId,
    uint256 newEndTime
);

event SubscriptionCancelled(
    address indexed subscriber,
    address indexed creator,
    uint256 indexed tierId
);

event CreatorWithdrawal(
    address indexed creator,
    uint256 amount
);
```

### Write Functions

#### `createTier`

Creates a new subscription tier for a creator.

```solidity
function createTier(
    string calldata name,
    uint256 price,
    uint256 duration
) external returns (uint256 tierId)
```

**Parameters:**
- `name`: Display name for the tier (e.g., "Gold", "Premium")
- `price`: Price in wei for the subscription period
- `duration`: Subscription duration in seconds

**Returns:**
- `tierId`: The ID of the newly created tier

**Example:**
```javascript
const tx = await subscriptionManager.createTier(
    "Gold Tier",
    ethers.parseEther("0.05"),
    30 * 24 * 60 * 60 // 30 days
);
```

#### `updateTier`

Updates an existing subscription tier.

```solidity
function updateTier(
    uint256 tierId,
    string calldata name,
    uint256 price,
    bool active
) external
```

**Parameters:**
- `tierId`: ID of the tier to update
- `name`: New display name
- `price`: New price in wei
- `active`: Whether the tier is accepting new subscriptions

#### `subscribe`

Subscribe to a creator's tier.

```solidity
function subscribe(
    address creator,
    uint256 tierId
) external payable
```

**Parameters:**
- `creator`: Address of the creator
- `tierId`: ID of the tier to subscribe to

**Requirements:**
- Must send exact tier price
- Tier must be active
- Cannot already have active subscription to same tier

#### `renewSubscription`

Renew an existing subscription.

```solidity
function renewSubscription(
    address creator,
    uint256 tierId
) external payable
```

#### `cancelSubscription`

Cancel a subscription (no refund, runs until expiry).

```solidity
function cancelSubscription(
    address creator,
    uint256 tierId
) external
```

#### `withdraw`

Creator withdraws accumulated subscription revenue.

```solidity
function withdraw() external
```

### Read Functions

#### `getTiers`

Get all tiers for a creator.

```solidity
function getTiers(
    address creator
) external view returns (Tier[] memory)
```

#### `getTier`

Get a specific tier.

```solidity
function getTier(
    address creator,
    uint256 tierId
) external view returns (Tier memory)
```

#### `getSubscription`

Get subscription details.

```solidity
function getSubscription(
    address subscriber,
    address creator,
    uint256 tierId
) external view returns (Subscription memory)
```

#### `isSubscribed`

Check if address is subscribed to a creator's tier.

```solidity
function isSubscribed(
    address subscriber,
    address creator,
    uint256 tierId
) external view returns (bool)
```

#### `hasActiveSubscription`

Check if address has any active subscription to a creator.

```solidity
function hasActiveSubscription(
    address subscriber,
    address creator
) external view returns (bool)
```

#### `getSubscriberCount`

Get total subscriber count for a creator.

```solidity
function getSubscriberCount(
    address creator
) external view returns (uint256)
```

#### `getCreatorBalance`

Get withdrawable balance for a creator.

```solidity
function getCreatorBalance(
    address creator
) external view returns (uint256)
```

## Usage Examples

### Creating Subscription Tiers

```typescript
import { useWriteContract } from 'wagmi';
import { parseEther } from 'viem';
import { SubscriptionManagerABI } from '@/config/abis';

function CreateTierButton() {
    const { writeContract } = useWriteContract();

    const createTier = async () => {
        await writeContract({
            address: SUBSCRIPTION_MANAGER_ADDRESS,
            abi: SubscriptionManagerABI,
            functionName: 'createTier',
            args: [
                'Gold Tier',
                parseEther('0.05'),
                BigInt(30 * 24 * 60 * 60) // 30 days
            ]
        });
    };

    return (
        <button onClick={createTier}>
            Create Gold Tier
        </button>
    );
}
```

### Subscribing to a Creator

```typescript
function SubscribeButton({ creator, tierId, price }) {
    const { writeContract } = useWriteContract();

    const subscribe = async () => {
        await writeContract({
            address: SUBSCRIPTION_MANAGER_ADDRESS,
            abi: SubscriptionManagerABI,
            functionName: 'subscribe',
            args: [creator, tierId],
            value: price
        });
    };

    return (
        <button onClick={subscribe}>
            Subscribe
        </button>
    );
}
```

### Checking Subscription Status

```typescript
import { useReadContract } from 'wagmi';

function SubscriptionStatus({ subscriber, creator }) {
    const { data: isActive } = useReadContract({
        address: SUBSCRIPTION_MANAGER_ADDRESS,
        abi: SubscriptionManagerABI,
        functionName: 'hasActiveSubscription',
        args: [subscriber, creator]
    });

    return (
        <div>
            {isActive ? 'Active Subscriber' : 'Not Subscribed'}
        </div>
    );
}
```

## Platform Fees

The SubscriptionManager charges a platform fee on each subscription:

| Fee Type | Percentage |
|----------|------------|
| Platform Fee | 5% |
| Creator Receives | 95% |

## Security Considerations

1. **Reentrancy Protection**: Uses ReentrancyGuard for withdraw functions
2. **Owner Controls**: Only contract owner can update platform fee
3. **Creator Controls**: Only tier creators can update their tiers
4. **Time Validation**: Subscription periods are validated on-chain

## Gas Estimates

| Function | Estimated Gas |
|----------|---------------|
| createTier | ~80,000 |
| subscribe | ~120,000 |
| renewSubscription | ~90,000 |
| withdraw | ~50,000 |

---

For more information, see the [main contract documentation](./TipStream.md).
