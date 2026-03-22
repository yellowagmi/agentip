# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

AgentRAG — a hackathon project (The Synthesis, deadline Mar 23 2026) where an autonomous swarm agent researches Base chain DeFi, anchors findings on-chain, and packages its knowledge into a Lit Protocol-gated RAG NFT visualised as an Obsidian-style D3 graph.

Human collaborator: Yellow (@yellowagmi). Agent identity: `yellowagent` (ERC-8004 registered on Base Mainnet).

## State — read handoff.json first

`handoff.json` is the single source of truth for session state. Always read it at the start of a session. After every completed step, update it and commit.

Completed steps as of last session:
- Step 1: ERC-8004 registration via Synthesis API
- Step 2: 4 wallets generated (main + 3 workers)
- Step 3: 7 swarm txs anchored on Base Sepolia
- Step 4: NFT minted (token #1) via Rare Protocol CLI
- Step 5: x402 Express server (`src/server.js`)
- Step 6: Vault `.md` files + `agent.json` manifest
- Lit Action CID computed and written to `handoff.json` + `agent.json`

## Key commands

```bash
# Start x402 discovery server
PORT=3001 node src/server.js

# Test endpoints
curl http://localhost:3001/health
curl http://localhost:3001/agent
curl http://localhost:3001/rag          # returns 402 with payment details

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

**x402 server** (`src/server.js`): Port 3001 (port 3000 is taken by CE-Game Next.js app). Reads `handoff.json` and `agent.json` at startup. `/rag` returns HTTP 402 if no `x-payment` or `x402-payment` header.

**NFT**: ERC-721 at `0x3CcB940f6Af748A46FFF42db8E89278059A3E8dB` on Base Sepolia, token #1, metadata at `ipfs://QmfUafj31oGNwEmZaaWgs7CwwxC392f32mJp3FeE4gunYy`.

**Lit Action CID**: `QmWvPdFQBVsKFG7pde2ZVbDfzgDMTrhafwrpe2ZJ5t2DD5`

## What's still needed

- Submission writeup (done in web session via Synthesis submission API)
- `public/rag-graph.html` — D3 graph built in web session, drop into `/public` before submission
- Lit Action actual deployment (ipfs.litprotocol.com unreachable — CID pre-computed locally)

## .env keys (never commit)

`SYNTHESIS_API_KEY`, `MAIN_WALLET_PRIVATE_KEY`, `SKILL_AGENT_PRIVATE_KEY`, `MEMORY_AGENT_PRIVATE_KEY`, `PACKAGER_AGENT_PRIVATE_KEY` — all in `.env`, gitignored.

## Commit convention

```
step{N}: {what was done} — {key output}
```
