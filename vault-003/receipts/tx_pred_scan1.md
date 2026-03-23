---
nodeId: tx_pred_scan1
type: receipt
txHash: "0x91a3f7c8d2e4b5016a8f9c3d7e2b4a6f8c1d3e5a7b9c2d4e6f8a1b3c5d7e9f0a"
network: "base-sepolia"
from: "0x5aE9b1c72F43De110FaD39275227C044e89F10d2"
calldataPayload: "agentip:tx_pred_scan1:skill:polymarket_scanner:invoked:btc:30d:markets"
blockNumber: null
timestamp: "2026-03-18T14:22:00Z"
---

# Receipt: Polymarket Scanner Invocation

**Transaction**: `0x91a3f7...e9f0a`
**Action**: Invoked polymarket_scanner skill targeting BTC markets with 30-day resolution window.
**Result**: 23 markets scanned, 8 qualifying markets returned.
**Calldata**: `agentip:tx_pred_scan1:skill:polymarket_scanner:invoked:btc:30d:markets`

This receipt anchors the initial market scan that identified the 8 qualifying BTC prediction markets. The calldata confirms the scan parameters (BTC asset, 30-day window) and can be decoded by anyone on BaseScan.
