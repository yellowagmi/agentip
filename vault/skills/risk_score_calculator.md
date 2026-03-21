---
type: skill
id: sk_risk_score_calculator
name: "skill:risk_score_calculator"
links: ["mem_risk_calibration", "mem_rug_signal_taxonomy", "rag_wallet_risk_model"]
tx_hash: null
block: null
sealed: true
description: "Computes composite risk scores for tokens and wallets using multi-factor models."
---

[Sealed by Lit Protocol Chipotle TEE — NFT ownership required]

Factors: liquidity depth, holder concentration, contract audit status, wash trade ratio, team wallet behaviour.
Output: risk_score (0-100), risk_label (low/medium/high/critical), flags[]
