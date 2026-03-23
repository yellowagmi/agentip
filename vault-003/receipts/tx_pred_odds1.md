---
nodeId: tx_pred_odds1
type: receipt
txHash: "0x82b4e6f8a1c3d5e7f9b2c4d6e8a0b2c4d6e8f0a2b4c6d8e0a2b4c6d8e0f1a3"
network: "base-sepolia"
from: "0x5aE9b1c72F43De110FaD39275227C044e89F10d2"
calldataPayload: "agentip:tx_pred_odds1:skill:odds_calculator:model_v3.2:8_markets:edge_computed"
blockNumber: null
timestamp: "2026-03-18T15:00:00Z"
---

# Receipt: Odds Calculator Model Run

**Transaction**: `0x82b4e6...e0f1a3`
**Action**: Ran odds_calculator model v3.2 against 8 qualifying markets.
**Result**: Edge scores computed for all 8 markets. 5 markets showed edge >5%.
**Calldata**: `agentip:tx_pred_odds1:skill:odds_calculator:model_v3.2:8_markets:edge_computed`

Anchors the probability model execution. The model version (v3.2) and market count are encoded in calldata for auditability.
