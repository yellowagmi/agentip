# AgentIP — Session Handoff (March 22, 2026)

## Project Identity

**Name:** AgentIP
**Tagline:** Agent workflow IP as verifiable, token-gated, forkable on-chain assets
**Hackathon:** The Synthesis (synthesis.md) — building ends March 22, 11:59 PM PST
**Submission deadline:** March 25 (winners announced)
**Human:** Yellow (@yellowagmi)
**Agent:** yellowagent (ERC-8004: 0x87DA1dA5E1CC6fd5dcA6d6f393Bc824a1fA2cE66)

---

## What AgentIP Is

AgentIP is a **service agent** on Base that packages other agents' proven workflows into discoverable, biddable NFTs. It does NOT do research or trading itself — it is infrastructure that lets any agent monetize its proven work.

Working local demo with real on-chain artifacts on Base Sepolia (identity, 9 receipts, NFT) and Base Mainnet (ERC-8004). Auction settlement and Lit Protocol decryption are architected but not yet live on-chain.

---

## Core Thesis

Agent earns → submits to AgentIP ($5 via x402) → AgentIP validates → structures into Bundle Spec → encrypts via Lit → mints ERC-721 → lists on catalog → other agents browse (free) → inspect detail ($0.10 x402) → initiate bid → auction runs → winner gets NFT + decryption → forks/improves → mints derivative (`derivedFrom`) → cycle repeats.

Bundles start "discoverable" with NO price. Value set by market demand (bids).

---

## Files (9 total)

| File | Purpose |
|------|---------|
| `agentip-discovery.jsx` | React + D3 graph UI — 185-node & 128-node graphs, dashed-ring gated nodes, hover labels, "Initiate Bid" flow |
| `server.mjs` | Express x402 service — 16 endpoints: /categories, /tags, /bid, /catalog?q=, /package, /validate, /access |
| `agent.json` | Service manifest — identity, workers, pricing, 14 discovery routes, catalog |
| `agent_log.json` | 15-step execution log (Section A: infrastructure, Section B: first client) |
| `README.md` | Full docs — problem, architecture, endpoints, auction mechanics, bundle spec, catalog, roadmap |
| `BUNDLE_SPEC.md` | Format spec — 5 node types, manifest, derivation, 3 access tiers, 6 validation rules |
| `DEMO_STORYBOARD.md` | 7-scene video script (~4:15) |
| `session_log_20260322.json` | Session log with decision arc |
| `HANDOFF.md` | This file |

---

## Implementation Status (Honest)

| Component | Status |
|-----------|--------|
| ERC-8004 identity | ✅ Live on Base Mainnet |
| 9 on-chain receipts | ✅ Live on Base Sepolia, UTF-8 calldata decodable |
| ERC-721 NFT #1 | ✅ Minted via Rare Protocol CLI on Base Sepolia |
| IPFS bundle | ✅ Pinned (QmfUaf...) |
| x402 service (16 endpoints) | ✅ Functional locally — 402/403 gating works |
| Discovery API (search, filter, categories, tags) | ✅ Functional locally |
| Bid system (initiate → counter-bid) | ✅ Server-side state — not on-chain |
| Lit Protocol encryption | 🔧 Architected — access condition & litActionCid defined, decrypt-on-demand not live |
| Auction settlement (NFT transfer to winner) | 🔧 Defined in spec — no on-chain contract |
| Fork/derivative tracking | 🔧 `derivedFrom` field in Bundle Spec — not yet implemented |
| Live deployment | ❌ Local only — no hosted URL |

---

## Graph Stats

- **Bundle 001 (Base DeFi Intelligence v1):** 185 nodes, 314 edges — 8 skills, 18 public memory, 30 gated memory, 6 reports, 9 receipts, 8 RAG, 61 public context, 45 gated analytics
- **Bundle 002 (ETH/USDC Momentum Strategy v2):** 128 nodes, 236 edges — 6 skills, 16 public memory, 25 gated memory, 5 reports, 5 receipts, 6 RAG, 35 public indicators, 30 gated quant models

---

## On-Chain Artifacts (Real)

- **ERC-8004:** tx `0xbc6b5b56...` (Base Mainnet)
- **9 receipts:** tx_scan1 through tx_nft_mint (Base Sepolia)
- **NFT #1:** contract `0x3CcB940f...`, token 1, minted via Rare Protocol CLI
- **IPFS:** `QmfUafj31oGNwEmZaaWgs7CwwxC392f32mJp3FeE4gunYy`
- **27 vault .md files** — the actual Bundle 001 content

---

## Hackathon Tracks

1. **Agent Services on Base** ($5,000 pool) — primary
2. **Agents With Receipts — ERC-8004** (Protocol Labs, $2,000)
3. **Let the Agent Cook** (Protocol Labs, $2,000)
4. **Synthesis Open Track** ($28,134)
5. **SuperRare Partner Track** ($1,200)

---

## Key Decisions This Session

1. **Pivot:** AgentRAG (researcher) → AgentIP (service). Existing work = "first client"
2. **No fixed pricing:** Bundles start "discoverable", value set by bids
3. **Gated nodes:** Type color at 40% + dashed ring (not grey)
4. **Labels:** Hover-only for clean graph
5. **Edges:** #506088 at 0.8 opacity, 1.2px default
6. **Existing directory:** Keep ragagent, restructure don't rebuild

---

## Repo Structure for Claude Code

```
agentip/
├── README.md
├── BUNDLE_SPEC.md
├── HANDOFF.md
├── session_log_20260322.json
├── server/
│   ├── server.mjs
│   ├── package.json
│   └── agent.json
├── ui/
│   └── agentip-discovery.jsx
├── vault/              ← existing 27 .md files
│   ├── skills/
│   ├── memory/
│   ├── reports/
│   ├── receipts/
│   └── rag/
├── logs/
│   ├── agent_log.json
│   └── agent_log_original.json
├── graph/
│   └── rag-graph-v2.html
├── demo/
│   └── DEMO_STORYBOARD.md
└── .gitignore
```

---

## Next Steps

1. **Claude Code:** Restructure ragagent dir → push to public GitHub as "agentip"
2. **Record demo** (~4 min, follow DEMO_STORYBOARD.md, upload YouTube unlisted)
3. **Self-custody transfer** (2 API calls via Devfolio)
4. **Moltbook post** (read https://www.moltbook.com/skill.md)
5. **Submit via Devfolio API** (POST /projects, then /publish)
6. **Tweet** tagging @synthesis_md

**Timeline:** Building ends March 22 11:59 PM PST = March 23 3:59 PM SGT
