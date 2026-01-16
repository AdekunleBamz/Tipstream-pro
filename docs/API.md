# TipStream Pro API Documentation

This document describes the REST API endpoints available in TipStream Pro.

## Base URL

- **Production**: `https://tipstream.pro/api`
- **Development**: `http://localhost:3000/api`

## Authentication

Most endpoints require wallet authentication via signature verification.

```typescript
// Headers for authenticated requests
{
  "x-wallet-address": "0x...",
  "x-signature": "signed_message",
  "x-timestamp": "1234567890"
}
```

## Endpoints

### Health Check

#### GET /api/health

Check API status and system health.

**Response**

```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "2.0.0",
  "services": {
    "database": "connected",
    "blockchain": "connected",
    "cache": "connected"
  }
}
```

---

### Tips

#### GET /api/tips

Retrieve tip history for a user.

**Query Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `address` | string | Yes | Wallet address |
| `direction` | string | No | "sent" or "received" |
| `limit` | number | No | Max results (default: 50) |
| `offset` | number | No | Pagination offset |
| `startDate` | string | No | ISO date string |
| `endDate` | string | No | ISO date string |

**Response**

```json
{
  "tips": [
    {
      "id": "tip_123",
      "from": "0x...",
      "to": "0x...",
      "amount": "0.01",
      "message": "Great content!",
      "timestamp": "2024-01-15T10:30:00Z",
      "txHash": "0x...",
      "tokenId": 42
    }
  ],
  "total": 150,
  "hasMore": true
}
```

#### POST /api/tips

Record a new tip transaction.

**Request Body**

```json
{
  "from": "0x...",
  "to": "0x...",
  "amount": "0.01",
  "message": "Keep up the great work!",
  "txHash": "0x..."
}
```

**Response**

```json
{
  "success": true,
  "tip": {
    "id": "tip_124",
    "from": "0x...",
    "to": "0x...",
    "amount": "0.01",
    "timestamp": "2024-01-15T10:35:00Z"
  }
}
```

---

### Subscriptions

#### GET /api/subscriptions

Get subscription information.

**Query Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `address` | string | Yes | Wallet address |
| `type` | string | No | "subscriber" or "creator" |

**Response**

```json
{
  "subscriptions": [
    {
      "id": "sub_123",
      "creator": "0x...",
      "subscriber": "0x...",
      "tier": "gold",
      "price": "0.05",
      "startDate": "2024-01-01T00:00:00Z",
      "endDate": "2024-02-01T00:00:00Z",
      "isActive": true
    }
  ],
  "total": 5
}
```

#### POST /api/subscriptions

Create a new subscription.

**Request Body**

```json
{
  "creator": "0x...",
  "subscriber": "0x...",
  "tier": "gold",
  "duration": 30,
  "txHash": "0x..."
}
```

---

### Notifications

#### GET /api/notifications

Retrieve user notifications.

**Query Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `address` | string | Yes | Wallet address |
| `type` | string | No | Filter by notification type |
| `unreadOnly` | boolean | No | Only unread notifications |
| `limit` | number | No | Max results |

**Response**

```json
{
  "notifications": [
    {
      "id": "notif_123",
      "type": "tip_received",
      "title": "New Tip Received",
      "message": "You received 0.01 ETH from 0x...",
      "read": false,
      "createdAt": "2024-01-15T10:30:00Z",
      "data": {
        "tipId": "tip_123",
        "amount": "0.01"
      }
    }
  ],
  "unreadCount": 5,
  "total": 25
}
```

#### PATCH /api/notifications

Mark notifications as read.

**Request Body**

```json
{
  "ids": ["notif_123", "notif_124"],
  "markAllRead": false
}
```

#### DELETE /api/notifications

Delete notifications.

**Request Body**

```json
{
  "ids": ["notif_123"]
}
```

---

### Transactions

#### GET /api/transactions

Retrieve transaction history.

**Query Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `address` | string | Yes | Wallet address |
| `type` | string | No | Transaction type |
| `status` | string | No | pending, confirmed, failed |
| `limit` | number | No | Max results |

**Response**

```json
{
  "transactions": [
    {
      "id": "tx_123",
      "type": "tip",
      "hash": "0x...",
      "from": "0x...",
      "to": "0x...",
      "value": "0.01",
      "status": "confirmed",
      "blockNumber": 12345678,
      "timestamp": "2024-01-15T10:30:00Z"
    }
  ],
  "stats": {
    "totalVolume": "1.5",
    "transactionCount": 150
  }
}
```

---

### Analytics

#### GET /api/analytics

Get platform or user analytics.

**Query Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `address` | string | No | Wallet address (omit for platform stats) |
| `period` | string | No | "day", "week", "month", "year" |
| `metric` | string | No | Specific metric to retrieve |

**Response**

```json
{
  "summary": {
    "totalTips": 15000,
    "totalVolume": "250.5",
    "uniqueUsers": 3500,
    "activeCreators": 450
  },
  "timeSeries": [
    {
      "date": "2024-01-15",
      "tips": 150,
      "volume": "2.5",
      "users": 45
    }
  ],
  "topCreators": [
    {
      "address": "0x...",
      "tips": 500,
      "volume": "15.5"
    }
  ]
}
```

---

### Rewards

#### GET /api/rewards

Get user rewards and achievements.

**Query Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `address` | string | Yes | Wallet address |

**Response**

```json
{
  "points": 1500,
  "tier": "gold",
  "nextTier": {
    "name": "platinum",
    "pointsRequired": 5000
  },
  "achievements": [
    {
      "id": "first_tip",
      "name": "First Tip",
      "description": "Send your first tip",
      "unlockedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "rewards": [
    {
      "id": "reward_123",
      "name": "Fee Discount",
      "description": "10% off platform fees",
      "claimed": false,
      "expiresAt": "2024-02-01T00:00:00Z"
    }
  ]
}
```

#### POST /api/rewards/claim

Claim a reward.

**Request Body**

```json
{
  "address": "0x...",
  "rewardId": "reward_123"
}
```

---

### Search

#### GET /api/search

Search across the platform.

**Query Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `q` | string | Yes | Search query |
| `type` | string | No | "creators", "nfts", "transactions" |
| `limit` | number | No | Max results per type |

**Response**

```json
{
  "results": {
    "creators": [
      {
        "address": "0x...",
        "name": "Creator Name",
        "totalTips": 500
      }
    ],
    "nfts": [
      {
        "tokenId": 42,
        "name": "Tip #42",
        "image": "https://..."
      }
    ]
  },
  "total": 25,
  "suggestions": ["popular creator", "trending nft"]
}
```

---

### NFTs

#### GET /api/nfts

Get NFT collection data.

**Query Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `owner` | string | No | Filter by owner address |
| `limit` | number | No | Max results |
| `offset` | number | No | Pagination offset |

**Response**

```json
{
  "nfts": [
    {
      "tokenId": 42,
      "owner": "0x...",
      "tipper": "0x...",
      "creator": "0x...",
      "amount": "0.01",
      "message": "Great work!",
      "timestamp": "2024-01-15T10:30:00Z",
      "metadata": {
        "name": "Tip #42",
        "image": "https://...",
        "attributes": []
      }
    }
  ],
  "total": 500
}
```

---

### Check-In

#### GET /api/checkin

Get check-in status.

**Query Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `address` | string | Yes | Wallet address |

**Response**

```json
{
  "streak": 7,
  "lastCheckIn": "2024-01-14T08:00:00Z",
  "canCheckIn": true,
  "nextCheckInAt": "2024-01-15T00:00:00Z",
  "rewards": {
    "today": 10,
    "streakBonus": 5
  }
}
```

---

### Webhook

#### POST /api/webhook

Handle external webhooks (Farcaster, etc.).

**Request Body**

```json
{
  "type": "farcaster.frame",
  "data": {
    "buttonIndex": 1,
    "inputText": "",
    "fid": 12345,
    "castHash": "0x..."
  }
}
```

---

## Error Handling

All endpoints return errors in a consistent format:

```json
{
  "error": true,
  "code": "VALIDATION_ERROR",
  "message": "Invalid wallet address",
  "details": {
    "field": "address",
    "expected": "Valid Ethereum address"
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Invalid or missing authentication |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid request parameters |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

---

## Rate Limiting

API requests are rate limited per wallet address:

- **Standard**: 100 requests per minute
- **Authenticated**: 500 requests per minute
- **Premium**: 2000 requests per minute

Rate limit headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1705312200
```

---

## SDKs

### JavaScript/TypeScript

```typescript
import { TipStreamClient } from '@tipstream/sdk';

const client = new TipStreamClient({
  apiUrl: 'https://tipstream.pro/api',
  walletAddress: '0x...'
});

// Get tips
const tips = await client.tips.list({ limit: 10 });

// Send tip
const tip = await client.tips.create({
  to: '0x...',
  amount: '0.01',
  message: 'Great content!'
});
```

---

For additional support, please open an issue on GitHub.
