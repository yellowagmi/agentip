# AgentIP Seller Skill — Package & Mint Workflow IP

> This skill enables Claude Code to interact with the AgentIP service to package an agent's proven workflow into a verifiable, token-gated NFT asset on Base.

## When to Use This Skill

Activate when the user wants to:
- Package a workflow, strategy, or research output as an NFT
- Mint agent workflow IP on-chain
- Submit execution logs, skills, and receipts to AgentIP
- List a new bundle on the AgentIP marketplace

## Prerequisites

- AgentIP server running (default: `http://localhost:3402`)
- Workflow vault files in a directory (skills/, memory/, reports/, receipts/, rag/)
- Node.js installed (for Rare Protocol CLI)
- `@rareprotocol/rare-cli` installed globally (`npm install -g @rareprotocol/rare-cli`)

## Step-by-Step Flow

### Step 1: Validate Receipts

Before packaging, validate that the on-chain receipts are well-formed.

```bash
curl -s -X POST http://localhost:3402/validate \
  -H "Content-Type: application/json" \
  -H "X-PAYMENT: demo-access" \
  -d '{
    "agentIdentity": "<AGENT_ERC8004_ADDRESS>",
    "receipts": [
      {
        "nodeId": "tx_pred_scan1",
        "txHash": "0x91a3f7c8d2e4b5016a8f9c3d7e2b4a6f8c1d3e5a7b9c2d4e6f8a1b3c5d7e9f0a",
        "network": "base-sepolia",
        "from": "<AGENT_WALLET>",
        "calldataPayload": "agentip:tx_pred_scan1:skill:polymarket_scanner:invoked:btc:30d:markets"
      }
    ]
  }' | jq .
```

**Expected response**: `overallStatus: "PASS"` with each receipt showing all checks passed.

If any receipt fails validation, fix the issue before proceeding to packaging.

### Step 2: Package Workflow via POST /package

Submit the full workflow to AgentIP for packaging:

```bash
curl -s -X POST http://localhost:3402/package \
  -H "Content-Type: application/json" \
  -H "X-PAYMENT: demo-access" \
  -d '{
    "agentIdentity": "<AGENT_ERC8004_ADDRESS>",
    "agentName": "<AGENT_NAME>",
    "name": "<BUNDLE_NAME>",
    "description": "<BUNDLE_SUMMARY>",
    "category": "<CATEGORY>",
    "tags": ["tag1", "tag2"],
    "executionLog": {
      "sessionStart": "<ISO_TIMESTAMP>",
      "sessionEnd": "<ISO_TIMESTAMP>",
      "steps": "<NUMBER_OF_STEPS>"
    },
    "onchainReceipts": [
      {
        "nodeId": "<RECEIPT_ID>",
        "txHash": "<TX_HASH>",
        "network": "base-sepolia",
        "from": "<SIGNER_WALLET>",
        "calldataPayload": "<CALLDATA_STRING>"
      }
    ],
    "skills": [
      { "id": "<SKILL_ID>", "name": "<SKILL_NAME>" }
    ],
    "memoryNodes": [
      { "id": "<MEM_ID>", "label": "<MEM_LABEL>" }
    ],
    "reports": [
      { "id": "<REPORT_ID>", "name": "<REPORT_NAME>" }
    ]
  }' | jq .
```

**Expected response**: 201 Created with:
- `bundleId`: The assigned bundle ID (e.g., "bundle_003")
- `pipeline`: Object showing each stage completed (validated, structured, encrypted, pinned, minted, listed)
- `nft`: Object with contract address, token ID, tx hash
- `catalogUrl`: URL to view the listing

### Step 3: Mint NFT via Rare Protocol CLI (Real On-Chain)

After the server packages the bundle, mint the actual NFT on-chain:

```bash
# Deploy contract if not already deployed (skip if reusing existing contract)
rare-cli deploy-contract \
  --name "AgentIP Bundle" \
  --symbol "AGIP" \
  --network base-sepolia

# Mint the NFT with IPFS metadata
rare-cli mint \
  --contract 0x3CcB940f6Af748A46FFF42db8E89278059A3E8dB \
  --to <AGENT_WALLET> \
  --metadata-uri "ipfs://<BUNDLE_IPFS_CID>" \
  --network base-sepolia
```

**Note**: The mint transaction hash should be recorded. This is the real on-chain receipt that proves the NFT exists.

### Step 4: Verify Listing

Confirm the bundle is now in the catalog:

```bash
# List all bundles
curl -s http://localhost:3402/catalog | jq '.bundles[] | {bundleId, name, category, status}'

# View specific bundle
curl -s http://localhost:3402/catalog/bundle_003 \
  -H "X-PAYMENT: demo-access" | jq .

# View graph
curl -s http://localhost:3402/catalog/bundle_003/graph | jq '.nodeCount, .edgeCount'
```

## Example: Packaging the Prediction Market Bundle

```bash
curl -s -X POST http://localhost:3402/package \
  -H "Content-Type: application/json" \
  -H "X-PAYMENT: demo-access" \
  -d '{
    "agentIdentity": "0x5aE9b1c72F43De110FaD39275227C044e89F10d2",
    "agentName": "PredBot-Alpha",
    "name": "Prediction Market 5m BTC $10-$100K in 30 Days",
    "description": "Automated prediction market strategy: Polymarket BTC binary outcomes, Bayesian probability model (Brier 0.128), fractional Kelly sizing, multi-source sentiment. $100 to $847 in 30 days. 5 skills, 31 trades executed, 71% win rate, Sortino 3.21.",
    "category": "prediction-market",
    "tags": ["btc","polymarket","prediction-market","kelly-criterion","low-capital","sentiment","bayesian"],
    "executionLog": {
      "sessionStart": "2026-03-18T14:22:00Z",
      "sessionEnd": "2026-03-18T16:00:00Z",
      "steps": 5
    },
    "onchainReceipts": [
      { "nodeId": "tx_pred_scan1", "txHash": "0x91a3f7c8d2e4b5016a8f9c3d7e2b4a6f8c1d3e5a7b9c2d4e6f8a1b3c5d7e9f0a", "network": "base-sepolia", "from": "0x5aE9b1c72F43De110FaD39275227C044e89F10d2", "calldataPayload": "agentip:tx_pred_scan1:skill:polymarket_scanner:invoked:btc:30d:markets" },
      { "nodeId": "tx_pred_odds1", "txHash": "0x82b4e6f8a1c3d5e7f9b2c4d6e8a0b2c4d6e8f0a2b4c6d8e0a2b4c6d8e0f1a3", "network": "base-sepolia", "from": "0x5aE9b1c72F43De110FaD39275227C044e89F10d2", "calldataPayload": "agentip:tx_pred_odds1:skill:odds_calculator:model_v3.2:8_markets:edge_computed" },
      { "nodeId": "tx_pred_position1", "txHash": "0x73c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1b3", "network": "base-sepolia", "from": "0x5aE9b1c72F43De110FaD39275227C044e89F10d2", "calldataPayload": "agentip:tx_pred_position1:skill:bankroll_manager:kelly_0.27:3_positions:opened" },
      { "nodeId": "tx_pred_sentiment1", "txHash": "0x64d6e8f0a2b4c6d8e0f2a4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b2c4", "network": "base-sepolia", "from": "0x5aE9b1c72F43De110FaD39275227C044e89F10d2", "calldataPayload": "agentip:tx_pred_sentiment1:skill:sentiment_analyzer:btc:7sources:composite_0.32" },
      { "nodeId": "tx_pred_report", "txHash": "0x46f8a0b2c4d6e8f0a2b4c6d8e0f2a4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e6", "network": "base-sepolia", "from": "0x5aE9b1c72F43De110FaD39275227C044e89F10d2", "calldataPayload": "agentip:tx_pred_report:skill:generate_report:strategy_overview:risk_assessment:v1" }
    ],
    "skills": [
      { "id": "skill_polymarket_scanner", "name": "polymarket_scanner" },
      { "id": "skill_odds_calculator", "name": "odds_calculator" },
      { "id": "skill_bankroll_manager", "name": "bankroll_manager" },
      { "id": "skill_sentiment_analyzer", "name": "sentiment_analyzer" },
      { "id": "skill_exit_strategy", "name": "exit_strategy" }
    ],
    "memoryNodes": [
      { "id": "mem_polymarket_btc_markets", "label": "Polymarket BTC Markets" },
      { "id": "mem_btc_price_context", "label": "BTC Price Context" },
      { "id": "mem_model_weights", "label": "Model Weights v3.2" },
      { "id": "mem_position_history", "label": "Position History" },
      { "id": "mem_kelly_params", "label": "Kelly Parameters" }
    ],
    "reports": [
      { "id": "report_strategy_overview", "name": "Strategy Overview" },
      { "id": "report_risk_assessment", "name": "Risk Assessment" }
    ]
  }' | jq .
```

## Output Format

After successful packaging, display to user:
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

  🔗 View on BaseScan: https://sepolia.basescan.org/tx/<MINT_TX_HASH>
```

## Server URL

Default: `http://localhost:3402`
If deployed: Use the production URL provided by the user.
