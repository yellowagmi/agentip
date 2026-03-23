---
nodeId: skill_exit_strategy
type: skill
name: "exit_strategy"
sealed: true
invokedBy: "0x5aE9b1c72F43De110FaD39275227C044e89F10d2"
anchorTx: "0x55e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5"
network: "base-sepolia"
---

# exit_strategy

Determines optimal exit timing for prediction market positions. Handles both profit-taking and loss-cutting scenarios, factoring in time decay, liquidity, and updated probability estimates.

## Inputs
- `position`: Current position details (market, side, size, entryPrice, currentPrice)
- `timeToResolution`: Hours until market resolves
- `currentModelProb`: Updated model probability from odds_calculator
- `marketLiquidity`: Current order book depth
- `portfolioContext`: Other open positions and total exposure

## Outputs
- `action`: HOLD | SELL_PARTIAL | SELL_FULL | ADD
- `urgency`: low | medium | high | critical
- `reason`: Human-readable explanation
- `targetExitPrice`: If selling, optimal limit price
- `slippageEstimate`: Expected slippage given current liquidity

## Exit Rules
1. **Edge evaporation**: If model edge drops below 3%, begin scaling out
2. **Time decay**: As resolution approaches with no edge, sell — time premium decays
3. **Liquidity dry-up**: If spread widens beyond 5%, prioritize exit before liquidity vanishes
4. **Stop-loss**: If position is down 40% from entry and model confidence has dropped, full exit
5. **Profit target**: If position is up 3x+ and model shows edge is now <5%, take 50% profit
6. **Correlation cascade**: If multiple correlated positions are moving against us simultaneously, reduce all
7. **Resolution proximity**: Within 24h of resolution, reassess all positions — either high conviction hold or full exit

## Parameters
- `minEdgeToHold`: 0.03
- `spreadExitThreshold`: 0.05
- `stopLossPercent`: 0.40
- `profitTakeMultiple`: 3.0
- `resolutionProximityHours`: 24
