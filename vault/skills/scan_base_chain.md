---
type: skill
id: sk_scan_base_chain
name: "skill:scan_base_chain"
links: ["mem_aerodrome_tvl", "mem_base_tvl_q1_2026", "mem_base_fees_trend", "tx_scan1", "tx_scan2"]
tx_hash: "0x40a211fc48b35387916488c95a8da6b62bbb019f357d7169b1c8870e27737269"
block: "confirmed"
sealed: true
description: "Scans Base chain for contract deployments, token transfers, and liquidity events."
---

[Sealed by Lit Protocol Chipotle TEE — NFT ownership required]

Monitors Base chain events using eth_getLogs with configurable filters.
Output schema: { events: [], summary: string, anchored_tx: string }
Invocation log: stored in agent_log.json
