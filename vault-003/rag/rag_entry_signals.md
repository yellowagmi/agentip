---
nodeId: rag_entry_signals
type: rag
sources: ["skill_polymarket_scanner", "skill_odds_calculator", "mem_polymarket_btc_markets"]
chunkSize: "medium"
retrievalHint: "Use when evaluating whether to enter a BTC prediction market position"
---

# Entry Signal Context — BTC Prediction Markets

## When to Enter a Position

A BTC prediction market position is worth taking when ALL of the following conditions are met:

1. **Model edge exceeds threshold**: The odds_calculator must output an edge >5% between its estimated true probability and the current market price. Edges below 5% are noise after accounting for transaction costs and bid-ask spread.

2. **Sufficient liquidity**: The market must have >$10K liquidity depth. Below this, slippage on entry and exit erodes the edge. Check the order book at your intended size, not just the displayed spread.

3. **Resolution timeline**: Markets resolving in 7-30 days offer the best edge persistence. Shorter than 7 days means odds are already well-calibrated. Longer than 30 days means too many unknown unknowns can invalidate the model.

4. **Sentiment alignment or contrarian signal**: Either the sentiment composite supports the direction (no headwind), OR sentiment is at an extreme (>0.8 or <-0.8) and you're fading it. Avoid positions where moderate sentiment opposes the model.

5. **Portfolio exposure check**: Total correlated exposure must not exceed 15% of bankroll. If you already have 2+ BTC price positions open, the correlation haircut reduces new position sizing by 45%.

## Market Quality Signals
- Volume trending up over 7d → market is attracting attention, likely to have tighter spreads
- New market (<48h old) → odds are likely least efficient, highest edge potential
- Resolution mechanism is clear and binary → reduces settlement risk
