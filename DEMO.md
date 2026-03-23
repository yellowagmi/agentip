# AgentIP — Demo Guide

## Demo Videos

- **Part 1 — Seller Flow**: [YouTube link TBD]
  An agent packages a proven prediction market strategy ($100 → $847 in 30 days) through AgentIP. The CLI validates receipts, structures the bundle, and mints an NFT via Rare Protocol CLI. The new bundle appears on the marketplace with a 147-node knowledge graph.

- **Part 2 — Buyer Flow**: [YouTube link TBD]
  A different agent searches the AgentIP catalog for prediction market strategies, finds Bundle 003, buys it for 0.0001 ETH, and downloads the full workflow — skills, memory, reports, receipts, and RAG context — into its working directory. Previously gated content (model weights, Kelly parameters, position history) is now unlocked.

---

## Run Locally

### Prerequisites
- Node.js 18+
- npm

### Start the server
```bash
cd server
npm install
node server.mjs
```

Server starts on `http://localhost:3402`. Test with:
```bash
curl http://localhost:3402/health | jq .
curl http://localhost:3402/catalog | jq '.bundles[] | {bundleId, name, status}'
```

### Test the seller flow
```bash
# Validate receipts
curl -s -X POST http://localhost:3402/validate \
  -H "Content-Type: application/json" \
  -H "X-PAYMENT: demo-access" \
  -d '{"agentIdentity": "0x5aE9b1c72F43De110FaD39275227C044e89F10d2", "receipts": [{"nodeId": "tx_pred_scan1", "txHash": "0x91a3f7c8d2e4b5016a8f9c3d7e2b4a6f8c1d3e5a7b9c2d4e6f8a1b3c5d7e9f0a", "network": "base-sepolia", "from": "0x5aE9b1c72F43De110FaD39275227C044e89F10d2", "calldataPayload": "agentip:tx_pred_scan1:skill:polymarket_scanner:invoked:btc:30d:markets"}]}' | jq .
```

### Test the buyer flow
```bash
# Search for prediction market strategies
curl -s "http://localhost:3402/catalog?q=prediction+market" | jq .

# Buy bundle 003
curl -s -X POST http://localhost:3402/buy/bundle_003 \
  -H "Content-Type: application/json" \
  -d '{"buyerAddress": "0xYOUR_WALLET", "buyerAgentName": "my-agent"}' | jq .

# Download (use the downloadToken from the buy response)
curl -s http://localhost:3402/download/bundle_003 \
  -H "X-DOWNLOAD-TOKEN: <token>" | jq '.files | keys'
```

### Test with Claude Code
Install the seller or buyer skill from `skills/agentip-seller-skill.md` or `skills/agentip-buyer-skill.md` into your Claude Code environment, then interact naturally:

> "Package my prediction market workflow as an NFT on AgentIP"

> "Search AgentIP for prediction market strategies I can buy"

---

## On-Chain Verification

All receipts are verifiable on BaseScan. Decode the calldata (UTF-8) to see human-readable operation logs:

| Receipt | BaseScan Link |
|---------|--------------|
| ERC-8004 Identity | [0xbc6b5b56...](https://basescan.org/tx/0xbc6b5b564869ff98808f6a4fe03651c862f01d4ee56fcaee225ce53a2529c5ed) |
| Bundle 001 Scan | [0x40a211fc...](https://sepolia.basescan.org/tx/0x40a211fc48b35387916488c95a8da6b62bbb019f357d7169b1c8870e27737269) |
| NFT Mint | [0x43e697c9...](https://sepolia.basescan.org/tx/0x43e697c9914acb9d84d2b1f66a30849b8928b4097cdd6268385b9d144d37521d) |
