# SubscriptionManager Smart Contract

## Overview

SubscriptionManager enables creators to set up subscription plans and allows fans to subscribe with recurring payments.

## Contract Address

**Base Mainnet**: `0xde57810A28652745446E4f188D30076c57D8C4d2`

## Features

- Three subscription tiers (Basic, Pro, VIP)
- Creator-controlled plan pricing
- Time-based subscription validity
- Auto-expiry after subscription period

## Subscription Tiers

| Tier | ID | Default Price | Period |
|------|-----|---------------|--------|
| Basic | 0 | 0.0002 ETH | 30 days |
| Pro | 1 | 0.0004 ETH | 30 days |
| VIP | 2 | 0.0006 ETH | 30 days |

## Functions

### Public Functions

#### `subscribe(address creator, uint256 tierId)`

Subscribe to a creator's plan.

**Parameters:**
- `creator`: Creator's wallet address
- `tierId`: Subscription tier (0, 1, or 2)

**Value:** Must match the plan price

#### `setPlan(address creator, uint256 tierId, uint256 price, uint256 period, bool active)`

Set up or update a subscription plan (creator only).

**Parameters:**
- `creator`: Must be msg.sender
- `tierId`: Tier to configure
- `price`: Price in wei
- `period`: Duration in seconds
- `active`: Whether plan is active

### View Functions

#### `isActive(address subscriber, address creator, uint256 tierId)`

Check if a subscription is currently active.

#### `plans(address creator, uint256 tierId)`

Get plan details: `(price, period, active)`

#### `subscriptions(address subscriber, address creator, uint256 tierId)`

Get subscription expiry timestamp.

## Events

### `Subscribed(address indexed subscriber, address indexed creator, uint256 tierId, uint256 expiresAt)`
Emitted when someone subscribes.

### `PlanSet(address indexed creator, uint256 tierId, uint256 price, uint256 period, bool active)`
Emitted when a creator sets up a plan.

## Workflow

### For Creators

1. Connect wallet
2. Call `setPlan()` for each tier you want to offer
3. Share your address with fans

### For Subscribers

1. Find creator address
2. Check if plan is active with `plans()`
3. Call `subscribe()` with correct value
4. Check status with `isActive()`

## Security Considerations

1. Payments go directly to creators
2. No platform fee on subscriptions
3. Subscription data is on-chain
4. Cannot cancel subscriptions (they expire naturally)
