---
nodeId: skill_sentiment_analyzer
type: skill
name: "sentiment_analyzer"
sealed: true
invokedBy: "0x5aE9b1c72F43De110FaD39275227C044e89F10d2"
anchorTx: "0x64d6e8f0a2b4c6d8e0f2a4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b2c4"
network: "base-sepolia"
---

# sentiment_analyzer

Multi-source sentiment aggregator optimised for prediction market edge detection. Combines social media signals, on-chain behavioral data, and news sentiment into a single directional score.

## Inputs
- `asset`: Target asset (e.g., "BTC")
- `timeframe`: Lookback window (e.g., "24h", "7d")
- `sources[]`: Which feeds to include (default: all)

## Outputs
- `compositeScore`: -1.0 (extreme fear) to +1.0 (extreme greed)
- `momentum`: Rate of change in sentiment over timeframe
- `sourceBreakdown{}`: Per-source scores
- `contrarian_signal`: Boolean — true when sentiment is at extremes (useful for fade trades)
- `narrativeTopics[]`: Trending narrative themes detected

## Sources & Weights
| Source | Weight | Signal Type |
|--------|--------|-------------|
| Crypto Twitter (CT) | 0.20 | Volume-weighted keyword sentiment |
| Farcaster | 0.15 | Quality-filtered cast sentiment |
| Reddit r/bitcoin + r/cryptocurrency | 0.10 | Comment sentiment + vote momentum |
| Fear & Greed Index | 0.10 | Composite market sentiment |
| Exchange funding rates | 0.15 | Leverage sentiment (positive = long-heavy) |
| Options put/call ratio | 0.15 | Hedging sentiment |
| Whale wallet movements | 0.15 | Behavioral sentiment from large holders |

## Parameters
- `decayHalfLife`: 48h (older signals decay exponentially)
- `extremeThreshold`: 0.8 (absolute value — triggers contrarian flag)
- `minSourcesRequired`: 4 (skip if fewer than 4 sources return data)
- `narrativeMinMentions`: 50 (minimum mentions to flag a narrative topic)
