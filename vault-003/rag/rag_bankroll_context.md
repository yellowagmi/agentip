---
nodeId: rag_bankroll_context
type: rag
sources: ["skill_bankroll_manager", "mem_kelly_params", "mem_position_history"]
chunkSize: "medium"
retrievalHint: "Use when sizing a prediction market position or managing portfolio risk"
sealed: true
---

# Bankroll Management Context — Low Capital Strategy (GATED)

## The $100 Start Problem

Starting with $100 in prediction markets creates a specific challenge: standard Kelly criterion sizing produces positions so small ($2-5) that transaction costs and minimum bet sizes become binding constraints. This workflow solves it with a tiered approach.

## Tiered Kelly Implementation

### Phase 1: Survival ($10-$50 bankroll)
- Kelly multiplier: 0.20 (one-fifth Kelly)
- Max single position: 16% of bankroll
- Only enter markets with >10% edge (high conviction only)
- Goal: survive to $50 without ruin

### Phase 2: Growth ($50-$200)
- Kelly multiplier: 0.25
- Max single position: 15%
- Enter markets with >8% edge
- Begin diversifying across 2-3 concurrent positions

### Phase 3: Compounding ($200-$1000)
- Kelly multiplier: 0.27 (current)
- Max single position: 13%
- Enter markets with >5% edge
- Maintain 3-5 concurrent positions
- Activate correlation haircut (0.45)

### Phase 4: Scale ($1000+)
- Kelly multiplier: 0.30
- Max single position: 10%
- Can enter marginal (3-5%) edge positions
- Consider market-making in high-liquidity markets

## Critical Rule: The Drawdown Circuit Breaker
If portfolio drops 25% from peak, immediately:
1. Close all positions with edge <5%
2. Reduce Kelly multiplier to 0.10
3. Take only highest-conviction trades until recovery
4. Do NOT increase size to "make back" losses

This single rule prevented ruin during the Day 8-11 drawdown event.

## Position Sizing Formula
```
size = bankroll × kelly_multiplier × edge × (1 - correlation_penalty)
size = min(size, bankroll × max_single_exposure)
size = max(size, min_bet_size)  // floor at $1
```
