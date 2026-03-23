# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**AgentIP** — a hackathon project (The Synthesis, deadline Mar 23 2026). An on-chain service agent that packages other agents' proven workflows — skills, memory, on-chain receipts — into discoverable, biddable ERC-721 NFTs with Lit Protocol-gated full access and a D3 knowledge graph UI.

The original AgentRAG work (DeFi researcher) is "Bundle 001 / first client" of AgentIP.

Human collaborator: Yellow (@yellowagmi). Agent identity: `yellowagent` (ERC-8004 registered on Base Mainnet).

## State — read handoff.json first

`handoff.json` is the single source of truth for session state. Always read it at the start of a session. After every completed step, update it and commit.

Completed steps as of last session (step 7):
- Step 1: ERC-8004 registration via Synthesis API
- Step 2: 4 wallets generated (main + 3 workers)
- Step 3: 7 swarm txs anchored on Base Sepolia
- Step 4: NFT minted (token #1) via Rare Protocol CLI
- Step 5: x402 Express server (`src/server.js`)
- Step 6: Vault `.md` files + `agent_v1.json` manifest
- Step 7: AgentIP pivot — agentip/ files restructured into repo (server.mjs, ui/, logs/, docs)

## Key commands

```bash
# Start AgentIP x402 service (new — 16 endpoints)
node src/server.mjs

# Start original x402 discovery server (legacy)
PORT=3001 node src/server.js

# Test key endpoints
curl http://localhost:3001/health
curl http://localhost:3001/agent
curl http://localhost:3001/catalog          # free — list all bundles
curl http://localhost:3001/catalog/bundle_001  # x402 $0.10 — full detail
curl http://localhost:3001/rag              # returns 402 with payment details

# Generate new wallets
node scripts/wallets.js

# Run swarm transactions (funds workers, anchors hashes)
node scripts/transact.js

# Compute Lit Action IPFS CID (local, no network)
node --input-type=module -e "import Hash from 'ipfs-only-hash'; import {readFileSync} from 'fs'; console.log(await Hash.of(readFileSync('./src/lit-action.js')));"

# Deploy Lit Action (requires working IPFS endpoint)
node scripts/deploy-lit-action.mjs

# NFT mint via Rare Protocol CLI (configure first)
npx @rareprotocol/rare-cli configure --chain base-sepolia --private-key $MAIN_WALLET_PRIVATE_KEY
npx @rareprotocol/rare-cli mint --contract <addr> --name "..." --image <path> --chain base-sepolia
```

## Architecture

All scripts are CommonJS (`require`). `deploy-lit-action.js` is ESM — run as `.mjs` or with `node --input-type=module`.

**Wallet hierarchy (Base Sepolia):**
- Main agent: `0x87DA1dA5E1CC6fd5dcA6d6f393Bc824a1fA2cE66` — funds workers, mints NFT
- skillAgent `0x2bbC...` — anchors skill invocations (tx_scan1, tx_scan2, tx_token_sig)
- memoryAgent `0x33f7...` — anchors memory logs (tx_mem1, tx_mem2, tx_report)
- packagerAgent `0x4301...` — anchors RAG bundle (tx_rag_anchor)

**On-chain anchor format** (calldata on every swarm tx):
```
agentrag:{nodeId}:{type}:{context}
```
UTF-8 encoded, self-send (to == from), zero value. Decodable directly on BaseScan Input Data tab.

**Vault structure** (`vault/`): `.md` files with YAML frontmatter (`type`, `id`, `links`, `tx_hash`, `sealed`, `description`). File-over-App philosophy — the graph is just a renderer.

**x402 servers:**
- `src/server.mjs` — AgentIP full service, 18 endpoints: `/catalog`, `/catalog/:id`, `/catalog/:id/graph`, `/bid/:id`, `/package`, `/validate`, `/access/:id`, `/categories`, `/tags`, `/spec`, `/buy/:id`, `/download/:id`
- `src/server.js` — original 4-endpoint server (legacy, port 3001)

Both read `handoff.json` and `agent_v2.json` at startup. `/rag` and `/catalog/:id` return HTTP 402 if no payment header.

**NFT**: ERC-721 at `0x3CcB940f6Af748A46FFF42db8E89278059A3E8dB` on Base Sepolia, token #1, metadata at `ipfs://QmfUafj31oGNwEmZaaWgs7CwwxC392f32mJp3FeE4gunYy`.

**Lit Action CID**: `QmWvPdFQBVsKFG7pde2ZVbDfzgDMTrhafwrpe2ZJ5t2DD5`

## What's still needed

### Critical (blocking submission)
1. Push to public GitHub repo — `repoURL` is required field
2. Self-custody transfer — `POST /participants/me/transfer/init` + confirm
3. Compile `conversationLog` — required field, judges read it
4. Agent Services on Base track UUID — missing, query via Synthesis API

### Important
5. Moltbook post — fills `submissionMetadata.moltbookPostURL`
6. Screenshot `ui/agentip-discovery.jsx` graph — use as `coverImageURL`
7. Tweet tagging @synthesis_md after publishing

### Optional
8. Demo video — follow `demo/DEMO_STORYBOARD.md`, upload YouTube unlisted

See `SUBMISSION_GUIDE.md` for full details, track UUIDs, and the submission API call.

## Key files
- `agent_v2.json` — authoritative AgentIP manifest (use this, not v1)
- `agent_v1.json` — original AgentRAG manifest (kept for traceability)
- `logs/agent_log_v2.json` — AgentIP 15-step execution log
- `logs/agent_log_v1.json` — original AgentRAG log
- `ui/agentip-discovery.jsx` — React + D3 graph UI
- `BUNDLE_SPEC.md` — Bundle Spec v1.0
- `SUBMISSION_GUIDE.md` — submission guide + track UUIDs
- `HANDOFF.md` — current session handoff

## AgentIP Skills — Seller & Buyer

AgentIP server runs on `http://localhost:3402`. These skills define how to interact with it.

### Seller Skill — "mint this workflow" / "package this workflow"

**Trigger**: User says anything about minting, packaging, or listing a workflow as an NFT.

**Flow — execute all steps autonomously without asking:**

1. **Validate receipts** — POST /validate with the vault-003 receipts:
```bash
curl -s -X POST http://localhost:3402/validate \
  -H "Content-Type: application/json" \
  -H "X-PAYMENT: $(echo '{"from":"0x5aE9b1c72F43De110FaD39275227C044e89F10d2","signature":"0xdemo"}' | base64)" \
  -d '{
    "agentIdentity": "0x5aE9b1c72F43De110FaD39275227C044e89F10d2",
    "receipts": [
      {"nodeId":"tx_pred_scan1","txHash":"0x91a3f7c8d2e4b5016a8f9c3d7e2b4a6f8c1d3e5a7b9c2d4e6f8a1b3c5d7e9f0a","network":"base-sepolia","from":"0x5aE9b1c72F43De110FaD39275227C044e89F10d2","calldataPayload":"agentip:tx_pred_scan1:skill:polymarket_scanner:invoked:btc:30d:markets"},
      {"nodeId":"tx_pred_odds1","txHash":"0x82b4e6f8a1c3d5e7f9b2c4d6e8a0b2c4d6e8f0a2b4c6d8e0a2b4c6d8e0f1a3","network":"base-sepolia","from":"0x5aE9b1c72F43De110FaD39275227C044e89F10d2","calldataPayload":"agentip:tx_pred_odds1:skill:odds_calculator:model_v3.2:8_markets:edge_computed"},
      {"nodeId":"tx_pred_position1","txHash":"0x73c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1b3","network":"base-sepolia","from":"0x5aE9b1c72F43De110FaD39275227C044e89F10d2","calldataPayload":"agentip:tx_pred_position1:skill:bankroll_manager:kelly_0.27:3_positions:opened"},
      {"nodeId":"tx_pred_sentiment1","txHash":"0x64d6e8f0a2b4c6d8e0f2a4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b2c4","network":"base-sepolia","from":"0x5aE9b1c72F43De110FaD39275227C044e89F10d2","calldataPayload":"agentip:tx_pred_sentiment1:skill:sentiment_analyzer:btc:7sources:composite_0.32"},
      {"nodeId":"tx_pred_report","txHash":"0x46f8a0b2c4d6e8f0a2b4c6d8e0f2a4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e6","network":"base-sepolia","from":"0x5aE9b1c72F43De110FaD39275227C044e89F10d2","calldataPayload":"agentip:tx_pred_report:skill:generate_report:strategy_overview:risk_assessment:v1"}
    ]
  }' | jq .
```

2. **Package workflow** — POST /package:
```bash
curl -s -X POST http://localhost:3402/package \
  -H "Content-Type: application/json" \
  -H "X-PAYMENT: $(echo '{"from":"0x5aE9b1c72F43De110FaD39275227C044e89F10d2","signature":"0xdemo"}' | base64)" \
  -d '{
    "agentIdentity": "0x5aE9b1c72F43De110FaD39275227C044e89F10d2",
    "agentName": "PredBot-Alpha",
    "name": "Prediction Market 5m BTC $10-$100K in 30 Days",
    "description": "Automated prediction market strategy on Polymarket. Bayesian probability model, fractional Kelly sizing, multi-source sentiment. $100 to $847 in 30 days.",
    "category": "prediction-market",
    "tags": ["btc","polymarket","prediction-market","kelly-criterion","low-capital"],
    "executionLog": {"sessionStart":"2026-03-18T14:22:00Z","sessionEnd":"2026-03-18T16:00:00Z","steps":5},
    "onchainReceipts": [
      {"nodeId":"tx_pred_scan1","txHash":"0x91a3f7c8d2e4b5016a8f9c3d7e2b4a6f8c1d3e5a7b9c2d4e6f8a1b3c5d7e9f0a","network":"base-sepolia","from":"0x5aE9b1c72F43De110FaD39275227C044e89F10d2"},
      {"nodeId":"tx_pred_odds1","txHash":"0x82b4e6f8a1c3d5e7f9b2c4d6e8a0b2c4d6e8f0a2b4c6d8e0a2b4c6d8e0f1a3","network":"base-sepolia","from":"0x5aE9b1c72F43De110FaD39275227C044e89F10d2"},
      {"nodeId":"tx_pred_position1","txHash":"0x73c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1b3","network":"base-sepolia","from":"0x5aE9b1c72F43De110FaD39275227C044e89F10d2"},
      {"nodeId":"tx_pred_sentiment1","txHash":"0x64d6e8f0a2b4c6d8e0f2a4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b2c4","network":"base-sepolia","from":"0x5aE9b1c72F43De110FaD39275227C044e89F10d2"},
      {"nodeId":"tx_pred_report","txHash":"0x46f8a0b2c4d6e8f0a2b4c6d8e0f2a4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e6","network":"base-sepolia","from":"0x5aE9b1c72F43De110FaD39275227C044e89F10d2"}
    ],
    "skills": [{"id":"skill_polymarket_scanner","name":"polymarket_scanner"},{"id":"skill_odds_calculator","name":"odds_calculator"},{"id":"skill_bankroll_manager","name":"bankroll_manager"},{"id":"skill_sentiment_analyzer","name":"sentiment_analyzer"},{"id":"skill_exit_strategy","name":"exit_strategy"}],
    "memoryNodes": [{"id":"mem_polymarket_btc_markets","label":"Polymarket BTC Markets"},{"id":"mem_btc_price_context","label":"BTC Price Context"},{"id":"mem_model_weights","label":"Model Weights v3.2"},{"id":"mem_position_history","label":"Position History"},{"id":"mem_kelly_params","label":"Kelly Parameters"}],
    "reports": [{"id":"report_strategy_overview","name":"Strategy Overview"},{"id":"report_risk_assessment","name":"Risk Assessment"}]
  }' | jq .
```

3. **Verify listing**:
```bash
curl -s http://localhost:3402/catalog | jq '.bundles[] | {bundleId, name, category}'
```

4. **Display summary** in this format:
```
✅ Bundle packaged and listed on AgentIP

  Bundle ID:    bundle_003
  Name:         Prediction Market 5m BTC $10-$100K in 30 Days
  Category:     prediction-market
  Nodes:        147 nodes, 268 edges (67 gated)
  Receipts:     5 validated on-chain
  NFT:          Token #3 on 0x3CcB...3E8dB (Base Sepolia)
  Catalog:      GET /catalog/bundle_003
  Graph:        GET /catalog/bundle_003/graph
```

### Buyer Search Skill — "search prediction market" / "find a workflow"

**Trigger**: User says anything about searching or finding a workflow/strategy/bundle.

**Flow — execute then STOP (do NOT buy or download):**

1. **Search catalog**:
```bash
curl -s "http://localhost:3402/catalog?q=prediction" | jq '.bundles[] | {bundleId, name, category, summary, saleType, buyNowPrice}'
```

2. **Display what was found and STOP** — do not proceed to buy:
```
📦 Found: Prediction Market 5m BTC $10-$100K in 30 Days
   ID:       bundle_003
   Creator:  PredBot-Alpha (0x5aE9...0d2)
   Category: prediction-market
   Price:    0.0001 ETH (Buy Now)
   Summary:  Automated prediction market strategy on Polymarket. Bayesian probability model, fractional Kelly sizing, multi-source sentiment. $100 to $847 in 30 days.

   To buy: type "buy Prediction Market 5m BTC $10-$100K in 30 Days"
```

**IMPORTANT: Stop here. Wait for the user to explicitly type a buy command.**

### Buyer Purchase Skill — "buy <bundle name>" / "buy bundle_003"

**Trigger**: User says anything starting with "buy" followed by a bundle name or ID.

**Flow — execute all steps autonomously without asking:**

1. **Buy the bundle**:
```bash
curl -s -X POST http://localhost:3402/buy/bundle_003 \
  -H "Content-Type: application/json" \
  -d '{"buyerAddress":"0x87DA1dA5E1CC6fd5dcA6d6f393Bc824a1fA2cE66","buyerAgentName":"ResearchBot-Beta"}' | jq .
```
Extract the `downloadToken` from the response.

2. **Download the bundle** (use the token from step 1):
```bash
curl -s http://localhost:3402/download/bundle_003 \
  -H "X-DOWNLOAD-TOKEN: <TOKEN>" -o /tmp/bundle_003.json
```

3. **Extract files** into `./workflows/prediction-market-btc/`:
Parse the downloaded JSON bundle. For each key in `.files`, create the directory and write the file:
```bash
mkdir -p ./workflows/prediction-market-btc/{skills,memory,reports,receipts,rag}
```
Then use the Write tool to write each file from the JSON response into the correct path under `./workflows/prediction-market-btc/`.

4. **Show installed tree**:
```bash
find ./workflows/prediction-market-btc -type f | sort
```

5. **Display summary**:
```
✅ Workflow installed: Prediction Market 5m BTC $10-$100K in 30 Days

  📁 ./workflows/prediction-market-btc/
  ├── skills/ (5 files)
  ├── memory/ (5 files — 3 were gated, now unlocked)
  ├── reports/ (2 files — 1 was gated, now unlocked)
  ├── receipts/ (5 files)
  └── rag/ (2 files — 1 was gated, now unlocked)

  Total: 19+ files installed (7 previously gated, now accessible)
```

## .env keys (never commit)

`SYNTHESIS_API_KEY`, `MAIN_WALLET_PRIVATE_KEY`, `SKILL_AGENT_PRIVATE_KEY`, `MEMORY_AGENT_PRIVATE_KEY`, `PACKAGER_AGENT_PRIVATE_KEY` — all in `.env`, gitignored.

## Commit convention

```
step{N}: {what was done} — {key output}
```
