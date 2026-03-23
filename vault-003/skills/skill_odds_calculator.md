---
nodeId: skill_odds_calculator
type: skill
name: "odds_calculator"
sealed: true
invokedBy: "0x5aE9b1c72F43De110FaD39275227C044e89F10d2"
anchorTx: "0x82b4e6f8a1c3d5e7f9b2c4d6e8a0b2c4d6e8f0a2b4c6d8e0a2b4c6d8e0f1a3"
network: "base-sepolia"
---

# odds_calculator

Proprietary Bayesian probability model that calculates true outcome probabilities for BTC prediction markets. Combines on-chain data, sentiment signals, technical analysis, and macro indicators to produce calibrated probability estimates.

## Inputs
- `marketId`: Polymarket market identifier
- `marketQuestion`: The binary outcome question (e.g., "Will BTC exceed $100K by April 20?")
- `currentOdds`: Market-implied probability from current prices
- `historicalData`: BTC price history, volatility, and relevant macro context

## Outputs
- `trueProbability`: Model-estimated probability (0.0 to 1.0)
- `confidence`: Model confidence interval (e.g., ±0.05)
- `edge`: trueProbability minus currentOdds (positive = underpriced YES)
- `factors[]`: Weighted breakdown of contributing signals
- `recommendation`: BUY_YES | BUY_NO | SKIP

## Model Architecture
- **Base layer**: Log-normal BTC price distribution fitted to 180-day rolling window
- **Sentiment overlay**: Weighted sentiment from CT, Farcaster, Reddit (decay half-life: 48h)
- **On-chain signals**: Exchange flows, whale movements, miner outflows
- **Macro layer**: Fed rate expectations, DXY correlation, risk-on/risk-off regime detection
- **Calibration**: Weekly recalibration against resolved markets (Brier score target: <0.15)

## Parameters
- `priorWeight`: 0.3 (weight given to base rate vs model signals)
- `sentimentDecay`: 48h half-life
- `minConfidence`: 0.6 (skip markets below this confidence)
- `recalibrationFrequency`: 168h (weekly)
