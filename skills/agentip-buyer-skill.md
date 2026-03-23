# AgentIP Buyer Skill — Search, Buy & Install Workflow IP

> This skill enables Claude Code to discover, purchase, and install agent workflow IP bundles from the AgentIP marketplace.

## When to Use This Skill

Activate when the user wants to:
- Search for agent workflows, strategies, or knowledge bundles
- Find a specific type of workflow (e.g., "prediction market strategy", "DeFi research")
- Buy a workflow bundle NFT
- Install/download a purchased workflow into their project
- Browse available agent IP on the AgentIP catalog

## Prerequisites

- AgentIP server accessible (default: `http://localhost:3402`)
- Wallet address for ownership verification (for purchased bundles)

## Step-by-Step Flow

### Step 1: Discover Available Workflows

**Browse the full catalog:**
```bash
curl -s http://localhost:3402/catalog | jq '.bundles[] | {bundleId, name, category, tags, status, saleType, buyNowPrice}'
```

**Search by keyword:**
```bash
curl -s "http://localhost:3402/catalog?q=prediction+market" | jq '.bundles[] | {bundleId, name, summary, status}'
```

**Browse by category:**
```bash
curl -s "http://localhost:3402/catalog?category=prediction-market" | jq '.bundles[] | {bundleId, name, summary}'
```

**List categories:**
```bash
curl -s http://localhost:3402/categories | jq .
```

**List tags:**
```bash
curl -s http://localhost:3402/tags | jq .
```

### Step 2: Inspect a Bundle

**View the public graph (free):**
```bash
curl -s http://localhost:3402/catalog/bundle_003/graph | jq '{nodeCount, edgeCount, gatedNodes: (.nodes | map(select(.visible == false)) | length)}'
```

**View full detail (x402 gated — $0.10):**
```bash
curl -s http://localhost:3402/catalog/bundle_003 \
  -H "X-PAYMENT: demo-access" | jq .
```

When displaying bundle details to the user, format as:
```
📦 Bundle: Prediction Market 5m BTC $10-$100K in 30 Days
   ID:       bundle_003
   Creator:  PredBot-Alpha (0x5aE9...0d2)
   Category: prediction-market
   Tags:     btc, polymarket, kelly-criterion, low-capital
   Nodes:    147 nodes, 268 edges (67 gated)
   Receipts: 5 on-chain (Base Sepolia)

   Summary:  Automated prediction market strategy using Bayesian
             probability model. $100 → $847 in 30 days. 71% win rate.

   💰 Buy Now: 0.0001 ETH
   🔒 Gated content: model weights, Kelly params, position history,
      entry/exit signals, risk assessment, calibration data
```

For bundles that are only "discoverable" (no buy-now price), show:
```
   🔍 Status: Discoverable
   📢 To acquire: Initiate a bid via POST /bid/bundle_001
   ⚠️  Note: Auction system is not yet live on-chain.
        Contact the creator to negotiate access.
```

### Step 3: Buy a Bundle (Secondary Sale)

Only bundles with `saleType: "secondary"` and a `buyNowPrice` can be purchased directly.

```bash
curl -s -X POST http://localhost:3402/buy/bundle_003 \
  -H "Content-Type: application/json" \
  -H "X-PAYMENT: demo-access" \
  -d '{
    "buyerAddress": "<YOUR_WALLET_ADDRESS>",
    "buyerAgentName": "<YOUR_AGENT_NAME>"
  }' | jq .
```

**Expected response**: 200 OK with:
- `status`: "purchased"
- `downloadToken`: Token for accessing the full bundle files
- `nft`: NFT details (contract, tokenId, network)
- `downloadUrl`: Endpoint to fetch the bundle files

### Step 4: Download & Install Bundle

After purchasing, download the full bundle files:

```bash
# Download the bundle
curl -s http://localhost:3402/download/bundle_003 \
  -H "X-DOWNLOAD-TOKEN: <TOKEN_FROM_PURCHASE>" \
  -o bundle_003.json
```

Then extract and install into the working directory:

```bash
# Create workflow directory
mkdir -p ./workflows/prediction-market-btc/{skills,memory,reports,receipts,rag}

# The download response is JSON — parse and write each file
# (Claude Code should parse the JSON and write each file to the correct subdirectory)
```

When installing, Claude Code should:
1. Parse the downloaded JSON bundle
2. Create the directory structure under `./workflows/<bundle-name>/`
3. Write each vault file to its correct subdirectory (skills/, memory/, reports/, receipts/, rag/)
4. Display a summary of installed files

**Expected output after install:**
```
✅ Workflow installed: Prediction Market 5m BTC $10-$100K in 30 Days

  📁 ./workflows/prediction-market-btc/
  ├── skills/
  │   ├── skill_polymarket_scanner.md
  │   ├── skill_odds_calculator.md
  │   ├── skill_bankroll_manager.md
  │   ├── skill_sentiment_analyzer.md
  │   └── skill_exit_strategy.md
  ├── memory/
  │   ├── mem_polymarket_btc_markets.md
  │   ├── mem_btc_price_context.md
  │   ├── mem_model_weights.md          🔓 (was gated — now accessible)
  │   ├── mem_position_history.md       🔓 (was gated — now accessible)
  │   └── mem_kelly_params.md           🔓 (was gated — now accessible)
  ├── reports/
  │   ├── report_strategy_overview.md
  │   └── report_risk_assessment.md     🔓 (was gated — now accessible)
  ├── receipts/
  │   ├── tx_pred_scan1.md
  │   ├── tx_pred_odds1.md
  │   ├── tx_pred_position1.md
  │   ├── tx_pred_sentiment1.md
  │   └── tx_pred_report.md
  └── rag/
      ├── rag_entry_signals.md
      └── rag_bankroll_context.md       🔓 (was gated — now accessible)

  Total: 14 files installed (7 previously gated, now unlocked)

  💡 Start by reading skills/ to understand capabilities,
     then rag/ for ready-to-use context chunks.
```

## Search Tips

When the user asks to find a workflow, try multiple search approaches:

1. **Direct keyword**: `?q=prediction+market`
2. **Category browse**: `?category=trading-strategy` or `?category=prediction-market`
3. **Tag filter**: `?tag=btc` or `?tag=low-capital`
4. **Broad then narrow**: Start with `/categories` to see what exists, then drill into specific categories

If no results match, inform the user what categories and tags are available.

## Server URL

Default: `http://localhost:3402`
If deployed: Use the production URL provided by the user.
