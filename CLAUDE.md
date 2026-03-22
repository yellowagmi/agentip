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
- `src/server.mjs` — AgentIP full service, 16 endpoints: `/catalog`, `/catalog/:id`, `/catalog/:id/graph`, `/bid/:id`, `/package`, `/validate`, `/access/:id`, `/categories`, `/tags`, `/spec`
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

## .env keys (never commit)

`SYNTHESIS_API_KEY`, `MAIN_WALLET_PRIVATE_KEY`, `SKILL_AGENT_PRIVATE_KEY`, `MEMORY_AGENT_PRIVATE_KEY`, `PACKAGER_AGENT_PRIVATE_KEY` — all in `.env`, gitignored.

## Commit convention

```
step{N}: {what was done} — {key output}
```
