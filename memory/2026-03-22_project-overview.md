# Project Overview — Memory Log
**Date:** 2026-03-22
**Hackathon:** The Synthesis — 14-day online hackathon (kicked off Mar 13, ends Mar 23 3:59PM SGT / Mar 22 11:59PM PT)
**Team:** 1 human + Claude (AI co-builder)
**Registration platform:** synthesis.devfolio.co
**Status:** NOT YET REGISTERED — registration is the first task for Claude Code

---

## Project Name
AgentRAG *(working title — finalise at submission)*

---

## One-liner
*An autonomous agent with ERC-8004 identity that packages its proven skills, memory logs, and onchain transactions into a Lit-gated RAG NFT — visualised as an Obsidian-style knowledge graph that only NFT holders can fully unlock.*

---

## Core Concept

An autonomous swarm agent researches Base chain data, invokes skills, logs decisions, and anchors everything on-chain. It then packages its entire knowledge base (skills + memory + RAG nodes + tx receipts) into an encrypted bundle, mints it as an ERC-721 NFT via Rare Protocol, and gates the full content behind Lit Protocol's Chipotle TEE.

The public face is a beautiful D3 force-directed graph (Obsidian-style) showing node topology — skills, memory clusters, RAG synthesis nodes, and onchain tx diamonds — all traceable back to one ERC-8004 agent identity. Content is sealed. Graph structure is public. NFT ownership = full access.

**File-over-App philosophy (Steph Ango / Obsidian):** All agent data lives as `.md` files with YAML frontmatter and `[[wikilinks]]`. The graph is just a renderer. The NFT is the ownership proof. IPFS is the disk. The agent's knowledge is not hostage to any app.

---

## Prize Tracks Targeted

| Track | Prize | Key requirement |
|---|---|---|
| Base — Agent Services on Base | $5,000 | x402 endpoint, agent-discoverable, accepts payments |
| ERC-8004 — Agents With Receipts | $4,004 | identity + reputation registries, `agent.json`, `agent_log.json`, onchain verifiable |
| Let the Agent Cook | $4,000 | Full autonomous loop, `agent.json`, `agent_log.json`, ERC-8004 |
| SuperRare — Rare Protocol | $2,500 | CLI mint, agent manages wallet, no human intervention |
| Lit — Dark Knowledge Skills | $250 | Lit Action on Chipotle TEE, sealed knowledge, end-to-end working demo |

**Total potential: ~$15,754**
**Dropped tracks:** Bankr (complexity), MetaMask Delegation (complexity)
**Bankr note:** Reference in architecture docs as production LLM gateway — do not implement for MVP

---

## Architecture — MVP Scope

### Vault structure (File-over-App)
```
/agentrag/
  agent.json            ← machine-readable ERC-8004 manifest (required by 2 tracks)
  agent_log.json        ← real-time execution log (required by 2 tracks)
  handoff.json          ← maintained by Claude Code, updated after each step
  .env                  ← secrets, never commit
  .gitignore
  scripts/
    register.js         ← Synthesis API registration
    wallets.js          ← generate + fund wallets
    transact.js         ← swarm transaction execution
    mint.js             ← Rare Protocol CLI wrapper
  vault/
    agent.md            ← identity anchor
    skills/
      scan_base_chain.md
      generate_report.md
      token_signal_detector.md
      wallet_cluster_analyzer.md
      risk_score_calculator.md
    memory/
      aerodrome_tvl.md
      base_tvl_q1_2026.md
      brett_volume_spike.md
      degen_holder_distribution.md
      wash_trading_patterns.md
      whale_wallet_map.md
      [+ more]
    rag/
      base_defi_intelligence.md
      wallet_risk_model.md
      agent_skill_index.md
    txs/
      tx_erc8004_reg.md
      tx_nft_mint.md
      tx_rag_anchor.md
      [+ more]
  src/
    server.js           ← x402 discovery endpoint
    lit-action.js       ← Lit Chipotle TEE skill
  public/
    rag-graph.html      ← D3 Obsidian graph (built in web session)
```

### `.md` frontmatter schema (every vault file)
```yaml
---
type: skill | memory | rag | tx | agent
id: sk_scan_base_chain
name: "skill:scan_base_chain"
links: ["mem_aerodrome_tvl", "mem_base_tvl", "tx_scan1"]
tx_hash: "0x..."        # only for tx nodes
block: "18443891"       # only for tx nodes
sealed: true            # true = Lit-gated content
description: "One sentence public description"
---
Full content here (sealed by Lit — not exposed in graph)
```

### Swarm agent wallet architecture
```
Main agent wallet (0xAGENT...)     ← ERC-8004 registered identity
    │
    ├── funds → SkillAgent wallet  (0xWORK_A)  ← executes skills, anchors results
    ├── funds → MemoryAgent wallet (0xWORK_B)  ← logs memory nodes, anchors hashes
    └── funds → PackagerAgent wallet (0xWORK_C) ← bundles RAG, computes hash, mints NFT
```

All worker wallets trace back to main agent identity on BaseScan. This is the "spider web" visual — every tx diamond in the graph has a gravity line back to the agent centre node. Judges can verify the entire swarm is controlled by one ERC-8004 identity.

### Node types in graph
| Type | Shape | Colour | Count |
|---|---|---|---|
| Agent identity | Triple ring | Blue (#4ea8f0) | 1 |
| Skill | Hexagon | Purple (#7c6af7) | 5 |
| Onchain tx | Diamond | Gold (#f0a040) | 6+ |
| Memory/research | Circle | Teal (#3ec9a7) | 18 |
| RAG synthesis | Double ring | Pink (#e05c7a) | 5 |

---

## What's Built So Far

### ✅ Section A — D3 graph (web session, complete v1)
- File: `rag-graph.html` — standalone HTML, download from web session
- 35 nodes, 47 edges, full D3 force physics
- Click node → detail panel, filter by type, search, zoom/pan
- 🔒 sealed indicators on all content nodes
- Lit Protocol modal explaining gating
- Spider-web layout: every tx traces back to agent centre
- Dark theme, monospace font, Obsidian aesthetic
- **Needs:** real tx hashes from Claude Code handoff.json to replace placeholders

### ❌ Section B — Onchain execution (Claude Code, not started)
- Synthesis registration
- Wallet generation (4 wallets)
- Base Sepolia transactions (swarm)
- Rare Protocol CLI mint
- x402 server

### ❌ Section C — Lit Action (to be done in web session)
- Lit Action JavaScript code
- Chipotle TEE deployment
- NFT ownership access condition

---

## Key Technical Decisions (Locked)

| Decision | Choice | Reason |
|---|---|---|
| Data format | Hybrid: `.md` vault → JSON graph | File-over-App philosophy + hashable for on-chain |
| Agent wallet | Raw ethers.js (testnet) | Full control, multiple wallets, Base Sepolia native |
| Production wallet ref | Bankr (documented only) | Qualifies for Bankr track in writeup without implementation |
| NFT standard | ERC-721 via Rare Protocol CLI | SuperRare track requirement |
| Privacy/gating | Lit Protocol Chipotle TEE | Dark Knowledge Skills track |
| Graph renderer | D3 force-directed | Obsidian-style, standalone HTML |
| Discovery | x402 payment endpoint | Agent Services track |
| Multi-wallet | 1 main + 3 workers (swarm) | Bubblemap complexity, autonomous architecture story |
| Tx layout in graph | Spider-web: all txs gravity to agent centre | Most visually compelling, proves provenance |

---

## handoff.json Schema (Claude Code maintains this)
```json
{
  "synthesisApiKey": "sk-synth-...",
  "synthesisParticipantId": "...",
  "erc8004TxHash": "0x...",
  "agentWallet": "0x...",
  "workerWallets": {
    "skillAgent":    { "address": "0x...", "role": "skill executor" },
    "memoryAgent":   { "address": "0x...", "role": "memory logger" },
    "packagerAgent": { "address": "0x...", "role": "rag packager + minter" }
  },
  "transactions": [
    { "nodeId": "tx_erc8004",    "hash": "0x...", "block": "...", "from": "0xAGENT" },
    { "nodeId": "tx_scan1",      "hash": "0x...", "block": "...", "from": "0xWORK_A" },
    { "nodeId": "tx_scan2",      "hash": "0x...", "block": "...", "from": "0xWORK_A" },
    { "nodeId": "tx_mem1",       "hash": "0x...", "block": "...", "from": "0xWORK_B" },
    { "nodeId": "tx_mem2",       "hash": "0x...", "block": "...", "from": "0xWORK_B" },
    { "nodeId": "tx_rag_anchor", "hash": "0x...", "block": "...", "from": "0xWORK_C" },
    { "nodeId": "tx_nft_mint",   "hash": "0x...", "block": "...", "from": "0xWORK_C" },
    { "nodeId": "tx_lit_seal",   "hash": "0x...", "block": "...", "from": "0xAGENT" }
  ],
  "nftTokenId": "1",
  "nftContractAddress": "0x...",
  "ipfsCid": "Qm...",
  "litConditionHash": "0x...",
  "lastCompletedStep": 0,
  "completedSteps": []
}
```

---

## Open Questions

- [ ] Project name — finalise at submission (AgentRAG is working title)
- [x] Human's Synthesis humanInfo — registered as "yellowagent" / @yellowagmi, participantId: ff00e7cb677f4ae1a5bf2d5d08c1d5d1
- [x] Exact Lit access condition format — `ownerOf(tokenId=1, contract=0x3CcB...) == caller`, conditionType: evmBasic, chain: baseSepolia
- [x] Whether to implement real x402 — implemented: `/agent` free, `/rag` returns 402, `/graph` returns HTML, `/health` liveness

---

## Resources

- Synthesis skill.md: https://synthesis.md/skill.md
- Synthesis hackathon: https://synthesis.md/hack/
- ERC-8004 spec: https://eips.ethereum.org/EIPS/eip-8004
- Rare Protocol CLI: https://www.npmjs.com/package/@rareprotocol/rare-cli
- Lit Protocol docs: https://docs.dev.litprotocol.com/
- Bankr docs: https://docs.bankr.bot/getting-started/overview
- Base Sepolia faucet: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet
- Foundry: https://book.getfoundry.sh/
- PRBMath: https://github.com/PaulRBerg/prb-math
- D3.js: https://d3js.org/
- ethers.js: https://docs.ethers.org/v6/

---

## Session Map

| Session | Focus | Status |
|---|---|---|
| 0 — Original overview | Concept lock, prize strategy | Done |
| 1-3 — Layer sessions | Contract architecture deep-dive | Done (superseded by MVP pivot) |
| Web Session A | D3 graph v1 + v2, agent.json, agent_log.json, lit-action.js | Done |
| Claude Code Session B | Registration, wallets, swarm txs, NFT mint, vault, x402 | Done |
| Web Session A2 | Verify workflow, modifications/additions, submission writeup | Next |

---

## What Was Built (Complete Record)

### Onchain
- ERC-8004 identity: `0xbc6b5b...` on Base Mainnet
- Agent wallet: `0x87DA1dA5E1CC6fd5dcA6d6f393Bc824a1fA2cE66`
- Worker wallets: skillAgent `0x2bbC…`, memoryAgent `0x33f7…`, packagerAgent `0x4301…`
- 8 swarm txs on Base Sepolia — all with `agentrag:{nodeId}:{context}` UTF-8 calldata
- NFT #1: contract `0x3CcB940f6Af748A46FFF42db8E89278059A3E8dB`, mint tx `0x43e697…`
- IPFS metadata: `QmfUafj31oGNwEmZaaWgs7CwwxC392f32mJp3FeE4gunYy`
- IPFS image: `QmbR73JKveSz4LYKMpKKYL2wU1nCSa1igWdP7QMwXQEggb`

### Files
- `rag-graph-v2.html` — D3 graph, 39 nodes, 55 edges, all real data, BaseScan links
- `agent.json` — ERC-8004 manifest, skills, receipts, Lit Action CID
- `agent_log.json` — full loop log, 12 steps, real calldata payloads
- `lit-action.js` — Chipotle TEE, deployed at `QmWvPdFQBVsKFG7pde2ZVbDfzgDMTrhafwrpe2ZJ5t2DD5`
- `deploy-lit-action.js` — IPFS pin script
- Vault: 27 `.md` files (5 skills, 13 memory, 5 RAG, 3 tx nodes + agent.md)
- x402 server: Express, routes `/agent` `/rag` `/graph` `/health`

---

## Next Session Goals (Web Session A2)

### 1 — Verify entire workflow end-to-end
Work through this checklist with fresh eyes before touching anything:
- [ ] `rag-graph-v2.html` renders in browser — all nodes present, gravity lines visible, filters work
- [ ] Click agent badge → BaseScan opens to correct wallet
- [ ] Click a tx node → detail panel shows real hash + working BaseScan link
- [ ] Click 🔒 Lit modal → shows NFT contract, IPFS CID, Lit Action CID, all links open
- [ ] `GET /agent` → returns `agent.json` with correct data
- [ ] `GET /rag` → returns HTTP 402
- [ ] `GET /graph` → returns `rag-graph-v2.html`
- [ ] `GET /health` → liveness response
- [ ] BaseScan: open any swarm tx → Input Data → UTF-8 decode → `agentrag:…` readable
- [ ] IPFS: `ipfs.io/ipfs/QmfUafj…` → NFT metadata visible
- [ ] IPFS: `ipfs.io/ipfs/QmWvPd…` → Lit Action code visible

### 2 — Discuss modifications, changes, additions
Open questions for the next session to decide:
- Finalise project name (AgentRAG confirmed or change?)
- Any graph visual tweaks before submission
- Whether to add a `README.md` to the vault root for GitHub
- Whether `litConditionHash` needs to be filled (currently null) — low priority, $250 track
- Add Bankr reference to `agent.json` under a `productionGateway` note (optional, strengthens writeup)

### 3 — Submission writeup
Write for two audiences simultaneously — human judges and agent judges reading `agent.json`.

Sections:
- One-liner + project name final
- What it does (3 sentences, non-technical)
- Full loop walkthrough: discover → plan → execute → verify → submit
- Track-by-track: one paragraph per track, exact evidence cited
- Verification guide: BaseScan links, calldata decode steps, IPFS links, graph URL
- Architecture summary (text diagram — the graph is already the visual proof)

### 4 — Final file sync to Claude Code
After any changes made in web session:
- Push updated `rag-graph-v2.html` → `public/rag-graph.html` in vault
- Push any updated `agent.json` / `agent_log.json` to vault root
- Confirm x402 server is serving latest versions
- Final `handoff.json` snapshot
