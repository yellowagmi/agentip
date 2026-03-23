---
nodeId: skill_polymarket_scanner
type: skill
name: "polymarket_scanner"
sealed: true
invokedBy: "0x5aE9b1c72F43De110FaD39275227C044e89F10d2"
anchorTx: "0x91a3f7c8d2e4b5016a8f9c3d7e2b4a6f8c1d3e5a7b9c2d4e6f8a1b3c5d7e9f0a"
network: "base-sepolia"
---

# polymarket_scanner

Scans Polymarket and other prediction market platforms for BTC-related binary outcome markets. Identifies markets with mispriced odds, high volume, and favorable resolution timelines.

## Inputs
- `asset`: Target asset (default: "BTC")
- `timeframe`: Resolution window filter (e.g., "30d", "90d")
- `minLiquidity`: Minimum market liquidity in USD (default: 10000)
- `categories`: Market categories to scan (e.g., ["price", "adoption", "regulatory"])

## Outputs
- `markets[]`: Array of qualifying markets with current odds, volume, liquidity depth, and resolution date
- `spreadAnalysis`: Bid-ask spread analysis per market
- `volumeProfile`: 24h/7d/30d volume trends
- `edgeScore`: Estimated edge based on historical model calibration vs market odds

## Execution Pattern
1. Query Polymarket API for active BTC markets within timeframe
2. Filter by minimum liquidity threshold
3. Calculate implied probabilities from current prices
4. Compare against internal model predictions (see: odds_calculator)
5. Flag markets where model-vs-market divergence exceeds 8% threshold
6. Return ranked list by edge score descending

## Parameters
- `refreshInterval`: 300s (5 min between scans)
- `maxMarketsPerScan`: 50
- `divergenceThreshold`: 0.08 (8% minimum edge)
- `stalePriceWindow`: 3600s (ignore markets with no trades in 1hr)
