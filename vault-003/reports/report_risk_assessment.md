---
nodeId: report_risk_assessment
type: report
sources: ["mem_position_history", "mem_kelly_params", "mem_model_weights"]
generatedBy: "generate_report"
anchorTx: "0x46f8a0b2c4d6e8f0a2b4c6d8e0f2a4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e6"
network: "base-sepolia"
sealed: true
---

# Risk Assessment & Model Performance (GATED)

## Model Calibration Analysis

### Brier Score Breakdown by Probability Bucket
| Predicted Probability | Positions | Actual Win Rate | Brier Score |
|-----------------------|-----------|-----------------|-------------|
| 0.20 - 0.35 | 5 | 40% | 0.156 |
| 0.35 - 0.50 | 8 | 62% | 0.132 |
| 0.50 - 0.65 | 10 | 70% | 0.118 |
| 0.65 - 0.80 | 6 | 83% | 0.108 |
| 0.80 - 0.95 | 2 | 100% | 0.045 |

The model is well-calibrated in the 50-80% range but slightly overconfident in the 20-35% range (predicting higher probability than observed). Recommendation: apply 0.85x correction factor for low-probability predictions.

## Drawdown Analysis

### Max Drawdown Event (Day 8-11)
- **Trigger**: Three consecutive losses on BTC price markets during unexpected Fed hawkish guidance
- **Drawdown**: -22.4% ($186 → $144)
- **Recovery**: 3.2 days via two high-conviction wins on ETF flow markets
- **Lesson**: Macro regime shifts are the primary risk. Circuit breaker activated correctly at Day 9.
- **Adjustment made**: Increased macro regime weight from 0.05 → 0.08 in model v3.2

### Simulated Worst Case (Monte Carlo, 10,000 runs)
- **Median 30d return**: +412%
- **5th percentile**: -38% (ruin path)
- **95th percentile**: +2,140%
- **Probability of ruin (<$10)**: 3.2%
- **Probability of 5x**: 68%
- **Probability of 10x**: 41%

## Edge Decay Analysis
Prediction market edges are not permanent. As more sophisticated participants enter:
- Average edge at entry has declined from +11% (Week 1) → +7.8% (Week 4)
- Recommendation: diversify to Kalshi and emerging platforms where edges are wider
- Estimated remaining edge lifespan at current market participation: 3-6 months

## Correlation Risk
Current 3 open positions share BTC price as underlying:
- Correlation between positions: 0.72 (high)
- Effective independent bets: 1.4 (not 3)
- Portfolio is long BTC directionally — vulnerable to sharp correction
- Mitigation: Kelly correlation haircut already applied (0.45 reduction)

## Recommendations
1. Begin allocating 20% of new positions to non-BTC markets (ETH, SOL prediction markets)
2. Consider hedging directional BTC exposure with small NO positions on extreme upside markets
3. Monitor Brier score weekly — if it exceeds 0.15, pause new positions and recalibrate
4. Target bankroll of $2,000 before increasing Kelly multiplier to 0.30
