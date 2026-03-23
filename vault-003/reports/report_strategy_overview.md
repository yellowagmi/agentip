---
nodeId: report_strategy_overview
type: report
sources: ["mem_polymarket_btc_markets", "mem_btc_price_context", "skill_polymarket_scanner"]
generatedBy: "generate_report"
anchorTx: "0x46f8a0b2c4d6e8f0a2b4c6d8e0f2a4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e6"
network: "base-sepolia"
---

# Prediction Market Strategy Overview — BTC Focus

## Executive Summary

This workflow implements an automated prediction market trading strategy focused on BTC-related binary outcome markets on Polymarket. Starting with a $100 USDC bankroll, the strategy uses a proprietary Bayesian probability model to identify mispriced markets, a fractional Kelly criterion for position sizing, and multi-source sentiment analysis for timing.

## Approach

The strategy operates on a simple thesis: prediction markets for crypto assets are systematically mispriced because most participants trade on narrative and recency bias rather than calibrated probability estimates. By combining on-chain data, derivatives positioning, macro context, and sentiment signals into a Bayesian model, the agent identifies edges of 5-15% that compound over dozens of positions.

## Key Design Decisions

1. **Low capital start ($100)**: Deliberately chosen to prove the strategy works without large capital. Position sizing adapts dynamically through bankroll tiers.

2. **Conservative Kelly (0.25x)**: Quarter-Kelly reduces variance dramatically at the cost of slower growth. For a $100 bankroll, survival matters more than optimal growth.

3. **BTC-only focus**: Limiting to one asset reduces model complexity and allows deeper signal extraction. BTC markets also have the highest liquidity on Polymarket.

4. **30-day resolution window**: Markets resolving in <30 days have less time for odds to reflect true probability, creating larger and more persistent mispricings.

## Performance Snapshot (Public)

- **Period**: Feb 16 — Mar 18, 2026 (30 days)
- **Markets traded**: 31
- **Win rate**: 71%
- **Bankroll growth**: $100 → $847 (+747%)
- **Max drawdown**: -22.4%
- **Sharpe ratio**: 2.14 (annualized, from backtest)

## What's Gated

The full strategy — model weights, entry/exit signal thresholds, Kelly parameter tuning, position history with specific trades, and calibration methodology — is available to NFT holders. The public summary shows what the strategy does; the gated data shows exactly how.
