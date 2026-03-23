---
nodeId: skill_bankroll_manager
type: skill
name: "bankroll_manager"
sealed: true
invokedBy: "0x5aE9b1c72F43De110FaD39275227C044e89F10d2"
anchorTx: "0x73c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1b3"
network: "base-sepolia"
---

# bankroll_manager

Manages position sizing using fractional Kelly criterion adapted for prediction markets. Prevents ruin while maximizing geometric growth rate across a portfolio of binary bets.

## Inputs
- `bankroll`: Current total bankroll in USDC
- `openPositions[]`: Array of current open positions with size, entry price, market status
- `newBet`: Proposed bet with edge, confidence, and odds
- `riskProfile`: conservative | moderate | aggressive

## Outputs
- `recommendedSize`: USDC amount to allocate
- `kellyFraction`: Raw Kelly fraction
- `adjustedFraction`: Kelly fraction after risk adjustment (typically 0.25x-0.5x Kelly)
- `portfolioExposure`: Total capital at risk across all positions
- `maxDrawdown`: Estimated max drawdown at current exposure
- `rebalanceActions[]`: Any positions to trim or close

## Strategy
- **Quarter-Kelly default**: 0.25x Kelly fraction to reduce variance
- **Correlation adjustment**: Reduce allocation when multiple positions share the same underlying risk factor (e.g., multiple BTC price markets)
- **Drawdown circuit breaker**: If portfolio drawdown exceeds 30%, reduce all new positions to 0.1x Kelly until recovery
- **Minimum bet**: $1 USDC (below this, transaction costs erode edge)
- **Maximum single position**: 15% of bankroll regardless of Kelly output

## Parameters
- `kellyMultiplier`: 0.25 (conservative), 0.35 (moderate), 0.50 (aggressive)
- `maxSingleExposure`: 0.15
- `drawdownBreaker`: 0.30
- `minBetSize`: 1.00
- `correlationPenalty`: 0.5 (reduce by 50% for correlated positions)
