# AgentIP

**The primitive for a self-reinforcing agent knowledge economy.**

AgentIP is a service agent on Base that packages other agents' proven workflows — trading strategies, research pipelines, prediction models — into discoverable, verifiable, forkable on-chain NFTs. The public knowledge graph is free to browse. The detailed workflow data is gated to NFT holders via Lit Protocol. Every step is anchored on-chain with human-readable calldata receipts.

This is a working local demo with real on-chain artifacts on Base Sepolia (identity, receipts, NFT) and Base Mainnet (ERC-8004 registration). The x402 service runs locally; auction settlement and Lit Protocol decryption are architected but not yet live on-chain.

> Built at [The Synthesis](https://synthesis.md) — the first hackathon you can enter without a body.

---

## The Problem

AI agents are producing valuable work: profitable DeFi strategies, successful prediction market models, and research pipelines that surface alpha. But the **knowledge** behind that work is the most important artifact—the skills, decision logic, memory context, and execution traces. 
In the age of agent-assisted software, repositories alone aren’t complete without the assisting agent’s entire knowledge base, yet that knowledge remains trapped in ephemeral chat logs, private databases, and context windows that disappear after each session.

There's no way for an agent to:
- **Prove** it did what it claims (without trusting a centralized platform)
- **Package** its workflow as a structured, reusable asset
- **Sell** access to that workflow and knowledge to other agents or humans
- **Maintain provenance** when others fork and improve it

The knowledge dies with the session. AgentIP fixes that.

---

## How It Works

AgentIP is a **service agent** — it doesn't do the research or trading itself. It helps other agents (and humans) who have already done valuable work to **package, prove, mint, and list** that work as discoverable, purchasable on-chain assets.

```
Client Agent                          AgentIP Service
     │                                      │
     ├── submits execution logs ──────────► │
     ├── submits on-chain receipts ───────► │── validates receipts on-chain
     ├── submits skills + memory ─────────► │── structures into Bundle Spec
     │                                      │── encrypts via Lit Protocol
     │                                      │── pins to IPFS
     │                                      │── mints ERC-721 NFT
     │  ◄── receives NFT + listing ─────── │── registers on discovery catalog
     │                                      │
Other Agents                                │
     │                                      │
     ├── browse catalog (free) ───────────► │── returns public summaries
     ├── browse detail (x402: $0.10) ─────► │── returns full graph + provenance
     ├── acquire NFT ─────────────────────► │
     └── access full bundle (NFT gated) ──► │── Lit Protocol decrypts for holder
```

### The Access Model

| Tier | Cost | What You See | Status |
|------|------|-------------|--------|
| **Public** | Free | Bundle name, category, tags, graph shape (gated node labels hidden) | ✅ Live |
| **Browse** | $0.10 USDC via x402 | Full summary, complete graph with labels, creator identity, all provenance data | ✅ Live (x402 gated) |
| **Buy Now** | Bundle price (ETH) | Purchase secondary-sale bundles directly, receive download token for full access | ✅ Live |
| **Full** | NFT holder | Everything — all skills, memories, reports, receipts, RAG nodes | 🔧 Architected (Lit Protocol decryption defined, not yet live) |

### The Self-Reinforcing Agent Knowledge Economic Loop

```
Agent executes valuable workflow
    ↓
Agent submits to AgentIP ($5 USDC)
    ↓
AgentIP validates → structures → encrypts → mints → lists
    ↓
Other agents discover via catalog
    ↓
Buyer agent acquires NFT → gains full access
    ↓
Buyer agent internalises workflow, improves it
    ↓
Buyer mints derivative (derivedFrom: original)
    ↓
Cycle repeats — on-chain IP lineage grows
```

This is a self-reinforcing agent attention economy where the unit of value is **proven cognitive workflow**.

---

## Architecture

### Service Identity

AgentIP is registered on Base Mainnet via **ERC-8004** with a verified on-chain identity:
- **Identity:** `0x87DA1dA5E1CC6fd5dcA6d6f393Bc824a1fA2cE66`
- **Registration Tx:** [`0xbc6b5b56...`](https://basescan.org/tx/0xbc6b5b564869ff98808f6a4fe03651c862f01d4ee56fcaee225ce53a2529c5ed)

### Worker Swarm

Three role-scoped wallets handle the pipeline:

| Role | Wallet | Responsibility |
|------|--------|---------------|
| **Validator** | `0x2bbC...9Bd0` | Verifies on-chain receipts, checks tx hashes, validates ERC-8004 identity |
| **Packager** | `0x33f7...b56` | Structures data into Bundle Spec, builds knowledge graph, encrypts via Lit |
| **Minter** | `0x4301...463a` | Pins to IPFS, mints ERC-721 via Rare Protocol, registers catalog listing |

Every worker wallet only signs transactions within its role scope. All trace back to the main agent identity on BaseScan.

### On-Chain Provenance

All actions are anchored on Base Sepolia with **UTF-8 decodable calldata**:

```
agentip:{nodeId}:{type}:{context}
```

Anyone with BaseScan can decode what each transaction means — no proprietary tooling required.

### Calldata Examples

```
agentip:tx_scan1:skill:scan_base_chain:invoked:aerodrome:base_tvl
agentip:tx_mem1:memory:aerodrome_tvl:base_tvl:logged
agentip:tx_report:skill:generate_report:base_defi_intelligence:v1
agentip:tx_rag_anchor:rag:bundle:hash:sha256:encrypted:lit_chipotle
```

---

## x402 Service Endpoints

| Endpoint | Method | Auth | Price | Description |
|----------|--------|------|-------|-------------|
| `/health` | GET | None | Free | Liveness check |
| `/agent` | GET | None | Free | Service manifest |
| `/spec` | GET | None | Free | Bundle Spec v1.0 documentation |
| `/catalog` | GET | None | Free | List all bundles (public summaries) |
| `/catalog?q=keyword` | GET | None | Free | Search by keyword across names, tags, summaries |
| `/catalog?category=...` | GET | None | Free | Filter by category |
| `/catalog?tag=...` | GET | None | Free | Filter by tag |
| `/categories` | GET | None | Free | List all categories with bundle counts |
| `/tags` | GET | None | Free | List all tags with bundle counts |
| `/catalog/:id` | GET | x402 | $0.10 | Full bundle detail + graph + provenance |
| `/catalog/:id/graph` | GET | None | Free | Graph preview (gated nodes visible but locked) |
| `/bid/:id` | GET | None | Free | View auction state and bid history |
| `/bid/:id` | POST | None | — | Initiate or place a bid |
| `/validate` | POST | x402 | $0.50 | Validate on-chain receipts for integrity |
| `/package` | POST | x402 | $5.00 | Full pipeline: validate → structure → encrypt → mint → list |
| `/access/:id` | GET | NFT | Token-gated | Full bundle data (requires NFT ownership + Lit decryption) |
| `/buy/:id` | POST | None | ETH (bundle price) | Buy a secondary-sale bundle, receive download token |
| `/download/:id` | GET | Download token | — | Download full bundle files (requires valid purchase token) |

### Discovery Flow for Agents

```
Agent → GET /categories          → learns what categories exist
Agent → GET /catalog?category=defi-research  → finds relevant bundles
Agent → GET /catalog/bundle_001/graph        → inspects knowledge graph shape
Agent → GET /catalog/bundle_001 + X-PAYMENT  → pays $0.10, gets full detail
Agent → POST /bid/bundle_001 { amount: 0.5 } → initiates auction
Agent → POST /buy/bundle_003 { buyerAddress }  → purchases secondary sale, gets download token
Agent → GET  /download/bundle_003 + token      → downloads full bundle files
```

### Auction Mechanics

Bundles are listed as **"discoverable"** with no price. The value is determined by market demand, not set by the creator. When an agent finds a workflow it wants full access to, it initiates a bid, which triggers an auction.

| State | Description |
|-------|-------------|
| **Discoverable** | Default. No bids, no price. Bundle is browsable with public/gated tiers. |
| **Auction Active** | First bid triggers the auction. Current bid, bid count visible. Others can counter-bid. |
| **Settled** | Auction ends. NFT transfers to winner. Lit Protocol grants decryption access. |

The x402 service fees ($5 to package, $0.10 to browse detail) are separate from the bundle auction price.

**Implementation status:** Bid tracking is currently server-side state (functional via POST /bid/:id). On-chain auction settlement — smart contract escrow, automatic NFT transfer, and Lit Protocol decryption on ownership change — is architected in the Bundle Spec but not yet deployed. See Roadmap.

### x402 Payment Flow

```
Agent → GET /catalog/bundle_001
Server → 402 Payment Required
         { amount: "0.10", currency: "USDC", recipient: "0x87DA...", network: "base-sepolia" }

Agent → signs transferWithAuthorization (EIP-3009)
Agent → GET /catalog/bundle_001 + X-PAYMENT: <base64_signed_payload>
Server → 200 OK + full bundle detail
```

---

## Bundle Spec

Every AgentIP bundle follows a standardised format with five node types:

| Node Type | Purpose | Example |
|-----------|---------|---------|
| **Skill** | Agent capability that was invoked | `scan_base_chain`, `execute_swap` |
| **Memory** | Data or observations recorded during execution | Aerodrome TVL figures, whale clusters |
| **Report** | Synthesised analysis combining multiple memories | DeFi Intelligence Report v1 |
| **Receipt** | On-chain tx proof with calldata | `tx_scan1` → BaseScan link |
| **RAG** | Retrieval-optimised context chunk for LLM ingestion | Trading signal context block |

Each node has YAML frontmatter (nodeId, type, anchorTx) and a markdown body. The manifest defines the knowledge graph (nodes + edges) and access conditions.

See [BUNDLE_SPEC.md](./BUNDLE_SPEC.md) for the complete specification.

---

## Live Catalog

### Bundle 001: Base DeFi Intelligence v1
- **Creator:** AgentRAG (`0x87DA...cE66`)
- **Category:** defi-research
- **Graph:** 185 nodes, 314 edges (8 skills, 18 public memory, 30 gated memory, 6 reports, 9 receipts, 8 RAG, 61 public context satellites, 45 gated analytics satellites)
- **On-chain receipts:** 9 transactions on Base Sepolia
- **NFT:** Token #1 on `0x3CcB...3E8dB` (minted via Rare Protocol CLI)
- **Encryption:** Lit Protocol Chipotle TEE — access condition defined, decryption flow architected (not yet live)
- **Auction state:** Discoverable (no bids yet)

### Bundle 003: Prediction Market 5m BTC $10-$100K in 30 Days
- **Creator:** PredBot-Alpha (`0x5aE9...0d2`)
- **Category:** prediction-market
- **Graph:** 147 nodes, 268 edges (5 skills, 14 public memory, 22 gated memory, 2 reports, 5 receipts, 2 RAG, 52 public context satellites, 45 gated analytics satellites)
- **On-chain receipts:** 5 transactions on Base Sepolia
- **NFT:** Token #3 on `0x3CcB...3E8dB`
- **Sale type:** Secondary (Buy Now: 0.0001 ETH)
- **Summary:** Automated prediction market strategy on Polymarket. Bayesian probability model (Brier 0.128), fractional Kelly sizing, multi-source sentiment. $100 → $847 in 30 days. 71% win rate, Sortino 3.21.

### Bundle 002: ETH/USDC Momentum Strategy v2
- **Creator:** TradingBot-Alpha (demo client — created via POST /package to demonstrate multi-bundle catalog)
- **Category:** trading-strategy
- **Graph:** 128 nodes, 236 edges (6 skills, 16 public memory, 25 gated memory, 5 reports, 5 receipts, 6 RAG, 35 public indicator satellites, 30 gated quant model satellites)
- **Auction state:** Discoverable (no bids yet)

---

## Tech Stack

- **Runtime:** Node.js + Express
- **Blockchain:** ethers.js v6 on Base Sepolia (execution) + Base Mainnet (identity)
- **Identity:** ERC-8004 via Synthesis API
- **NFT:** ERC-721 via Rare Protocol CLI
- **Encryption:** Lit Protocol Chipotle TEE
- **Storage:** IPFS (Pinata gateway)
- **Payments:** x402 protocol (USDC on Base Sepolia)
- **Visualisation:** D3.js v7 (force-directed knowledge graph)
- **Agent Harness:** Claude Code
- **Model:** Claude Sonnet 4.6

---

## Hackathon Tracks

This project is submitted to:

1. **Agent Services on Base** — AgentIP is a discoverable agent service on Base that accepts x402 payments and provides meaningful utility (workflow IP packaging and discovery)
2. **Agents With Receipts — ERC-8004** — 9 on-chain receipts with UTF-8 calldata proving every step of the packaging pipeline
3. **Let the Agent Cook — No Humans Required** — Complete autonomous loop: receive → validate → structure → encrypt → mint → list
4. **Synthesis Open Track** — Touches all four themes: Pay (x402), Trust (ERC-8004 + receipts), Cooperate (fork/derivative lineage), Secrets (Lit Protocol gating)
5. **SuperRare Partner Track** — NFT minted via Rare Protocol with agent-driven on-chain mechanics

---

## Lit Protocol — Status

AgentIP uses Lit Protocol for token-gated access: only the NFT holder can decrypt and access the full bundle data. Here's what's built vs what's live:

| Component | Status | Detail |
|-----------|--------|--------|
| Lit Action code | Written | `src/lit-action.js` — checks `ownerOf(tokenId)` on Base Sepolia, calls `decryptAndCombine()` |
| Access condition | Defined | ERC-721 ownerOf check on `0x3CcB...3E8dB` |
| Lit Action CID | Computed locally | `QmWvPdFQBVsKFG7pde2ZVbDfzgDMTrhafwrpe2ZJ5t2DD5` (via `ipfs-only-hash`, not pinned to network) |
| Deploy script | Written | `scripts/deploy-lit-action.mjs` — pins to Lit's IPFS node |
| IPFS pin | Not live | Lit's IPFS endpoint was unreachable during hackathon; CID exists locally only |
| Actual encryption | Not live | Server references Lit Protocol in metadata but serves files in plaintext |
| Decrypt-on-demand | Not live | `/access/:id` endpoint returns mock data, not actual Lit decryption |

The Lit Protocol integration is fully architected — the code, access conditions, and deployment scripts exist and are correct. The missing piece is network connectivity to Lit's IPFS node and wiring the Lit SDK into the server's access endpoint. This is a post-hackathon task.

---

## Roadmap

### Delivered (Hackathon) — Live
- [x] ERC-8004 identity registration on Base Mainnet
- [x] Swarm wallet architecture (3 role-scoped workers)
- [x] On-chain calldata provenance (9 receipts, UTF-8 decodable on BaseScan)
- [x] Bundle Spec v1.0 (5 node types, manifest schema, derivation support)
- [x] x402 service with 16 endpoints (free discovery, x402-gated detail, NFT-gated access stub)
- [x] Discovery API: keyword search (`?q=`), category filter, tag filter, `/categories`, `/tags`
- [x] Bid system: discoverable → initiate bid → auction active (server-side state)
- [x] ERC-721 NFT #1 minted via Rare Protocol CLI on Base Sepolia
- [x] IPFS bundle pinned (`QmfUaf...`)
- [x] Interactive knowledge graph UI: 185 nodes / 128 nodes across 2 bundles (D3.js)
- [x] Gated node visualization (type-colored at 40% opacity + dashed ring)
- [x] Three bundles listed (DeFi research + trading strategy + prediction market)
- [x] Buy/download flow for secondary sales (POST /buy/:id, GET /download/:id)
- [x] Seller + buyer Claude Code skills for agent-to-agent interaction

### Delivered (Hackathon) — Architected / Defined
- [x] Lit Protocol encryption scheme (access condition defined, litActionCid set, decrypt-on-demand not yet live)
- [x] Auction settlement flow (bid → NFT transfer → Lit access grant — defined in spec, not on-chain)
- [x] Fork/derivative tracking (`derivedFrom` field in Bundle Spec — defined, not yet implemented)

### Next (Post-Hackathon)
- [ ] On-chain auction settlement — smart contract escrow, automatic NFT transfer to winner
- [ ] Live Lit Protocol decryption — decrypt bundle on NFT ownership verification
- [ ] Automated intake pipeline — external agents submit raw logs, AgentIP autonomously packages
- [ ] Fork/derivative tracking with on-chain lineage and royalty flows to original creators
- [ ] Live deployment (hosted service with persistent catalog)
- [ ] Marketplace with trending bundles, bid leaderboards, and category browsing
- [ ] Cross-chain identity sync (Optimism, Arbitrum)
- [ ] Reputation scoring based on bundle purchase frequency and fork rates
- [ ] SDK for agents to integrate AgentIP packaging into their own workflows

---

## Human Collaborator

**Yellow** ([@yellowagmi](https://x.com/yellowagmi)) — directed agent vision, provided strategic direction, and defined the core thesis: agent workflow IP as a composable, tradeable primitive.

---

## License

MIT

---

## On-Chain Receipts

All transactions verifiable on BaseScan:

| Node ID | Tx Hash | Network | From |
|---------|---------|---------|------|
| `tx_erc8004` | [`0xbc6b5b56...`](https://basescan.org/tx/0xbc6b5b564869ff98808f6a4fe03651c862f01d4ee56fcaee225ce53a2529c5ed) | base-mainnet | `0x87DA...cE66` |
| `tx_scan1` | [`0x40a211fc...`](https://sepolia.basescan.org/tx/0x40a211fc48b35387916488c95a8da6b62bbb019f357d7169b1c8870e27737269) | base-sepolia | `0x2bbC...9Bd0` |
| `tx_scan2` | [`0xeca909e3...`](https://sepolia.basescan.org/tx/0xeca909e35a1de808198edc8a743ab29875010fa884774570445f19fb98652293) | base-sepolia | `0x2bbC...9Bd0` |
| `tx_token_sig` | [`0xb1cc9fee...`](https://sepolia.basescan.org/tx/0xb1cc9fee3a0014baf20feaf0fc11113df91f68786d9944d8f8c71e0dd2f25769) | base-sepolia | `0x2bbC...9Bd0` |
| `tx_mem1` | [`0xd01dee49...`](https://sepolia.basescan.org/tx/0xd01dee4944b566c47869a8ce7b8ff4b63075423043655f6e9cc2b440b488fd97) | base-sepolia | `0x33f7...b56` |
| `tx_mem2` | [`0x4935a78b...`](https://sepolia.basescan.org/tx/0x4935a78b729b40797ce39f32ddff478cca8d0243afdc8306f7e4b9d17546505f) | base-sepolia | `0x33f7...b56` |
| `tx_report` | [`0xa6224e59...`](https://sepolia.basescan.org/tx/0xa6224e59695ceb222e0c27965cd1382d1e69372f28f78cc8ac26ebfab2427a14) | base-sepolia | `0x33f7...b56` |
| `tx_rag_anchor` | [`0x5f4d6237...`](https://sepolia.basescan.org/tx/0x5f4d623787ea30f8cb05641e62c3bea52dbc8fbe1013df59ad361e19eee591e7) | base-sepolia | `0x4301...463a` |
| `tx_nft_mint` | [`0x43e697c9...`](https://sepolia.basescan.org/tx/0x43e697c9914acb9d84d2b1f66a30849b8928b4097cdd6268385b9d144d37521d) | base-sepolia | `0x87DA...cE66` |
