# DailyCheckIn Contract

Streak-based engagement system for the TipStream Pro platform.

## Overview

DailyCheckIn allows users to check in once per day and build consecutive day streaks. Missing a day resets the streak to 1. This gamification feature encourages daily platform engagement.

## Contract Details

- **Solidity Version**: ^0.8.21
- **License**: MIT
- **No Constructor Parameters**

## How It Works

1. User calls `checkIn()` function once per day
2. If called on consecutive day, streak increments
3. If a day is missed, streak resets to 1
4. Duplicate check-ins on same day are rejected

## Streak Logic

```
Day 1: checkIn() → streak = 1
Day 2: checkIn() → streak = 2
Day 3: checkIn() → streak = 3
Day 4: (missed)
Day 5: checkIn() → streak = 1 (reset)
```

## Events

| Event | Parameters | Description |
|-------|------------|-------------|
| `CheckedIn` | `user`, `day`, `streak` | Emitted on successful check-in |

## Functions

### Read Functions

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `lastCheckIn(address)` | User address | `uint256` | Day number of last check-in |
| `streak(address)` | User address | `uint256` | Current streak count |
| `getStreak(address)` | User address | `uint256` | Alias for streak mapping |

### Write Functions

| Function | Access | Description |
|----------|--------|-------------|
| `checkIn()` | Public | Record daily check-in, update streak |

## Day Calculation

Days are calculated as:
```solidity
day = block.timestamp / 1 days
```

This uses Unix timestamps divided by 86400 seconds, creating universal day boundaries.

## Error Handling

| Error | Condition |
|-------|-----------|
| `"Already checked in"` | User already checked in today |

## Gas Costs

- Check-in (new streak): ~45,000 gas
- Check-in (continue streak): ~25,000 gas

## Integration Example

```typescript
import { useWriteContract } from 'wagmi';

const { writeContract } = useWriteContract();

const handleCheckIn = () => {
  writeContract({
    address: CONTRACTS.DailyCheckIn,
    abi: DailyCheckInABI,
    functionName: 'checkIn',
  });
};
```

## Frontend Display

```typescript
// Check if user can check in today
const today = Math.floor(Date.now() / 1000 / 86400);
const canCheckIn = lastCheckIn !== today;
```

## Future Enhancements

- Streak-based rewards
- Leaderboard for longest streaks
- Achievement NFTs for milestones
- Streak protection mechanics

## Security Considerations

- No access control needed (users manage own data)
- No funds held in contract
- Immutable day calculation prevents manipulation

## Deployment

No constructor parameters required:

```bash
# Deploy via Remix or Hardhat
npx hardhat run scripts/deploy-checkin.js --network base
```

## License

MIT License
