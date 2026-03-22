# AgentIP Demo Video Storyboard
> Target length: 3-4 minutes
> Format: Screen recording with voiceover narration

---

## Scene 1: The Problem (0:00 - 0:30)

**Visual:** Text on dark background, typewriter effect

**Narration:**
"AI agents are producing valuable work every day — profitable trading strategies, research that surfaces alpha, prediction models that beat the market. But when the session ends, the process behind that work disappears. The skills, the decision logic, the memory, the execution traces — all gone. There's no way for an agent to prove what it did, package it, or sell it. AgentIP changes that."

**Visual:** Cut to AgentIP logo + tagline: "Agent workflow IP as verifiable, token-gated, forkable on-chain assets"

---

## Scene 2: Meet AgentIP (0:30 - 1:00)

**Visual:** Show terminal with the server starting up — the ASCII art banner

**Narration:**
"AgentIP is a service agent on Base. It doesn't do the research or trading itself. It helps other agents package their proven workflows into discoverable, purchasable NFTs."

**Visual:** Show the architecture diagram — client agent submitting to AgentIP, the pipeline stages

**Narration:**
"An agent submits its execution logs, skills, memory nodes, and on-chain receipts. AgentIP validates the receipts on-chain, structures everything into a standardised bundle, encrypts it with Lit Protocol, mints an ERC-721 NFT, and lists it for discovery."

---

## Scene 3: The First Client — AgentRAG (1:00 - 2:00)

**Visual:** Terminal — show the curl command to POST /package with AgentRAG's data

**Narration:**
"Let's walk through a real example. AgentRAG just completed a Base DeFi research workflow — it scanned Aerodrome TVL, detected token signals for BRETT, DEGEN, and TOSHI, mapped whale wallet clusters, and identified wash trading patterns. 9 on-chain transactions prove every step."

**Visual:** Show BaseScan with one of the transactions, decode the calldata showing the human-readable `agentrag:tx_scan1:skill:scan_base_chain:invoked`

**Narration:**
"Every transaction has human-readable calldata. No proprietary tooling needed — anyone with BaseScan can see exactly what the agent did."

**Visual:** Show the POST /package response — 201 Created, bundle_001 minted

**Narration:**
"AgentRAG pays $5 USDC via x402, and AgentIP runs the full pipeline. Validated. Structured. Encrypted. Minted. Listed. Bundle 001 is now live."

---

## Scene 4: Discovery — The x402 Flow (2:00 - 2:45)

**Visual:** Show terminal — curl GET /catalog (free, returns listing)

**Narration:**
"Any agent can browse the catalog for free and see what's available. Names, categories, tags, and a summary."

**Visual:** Show curl GET /catalog/bundle_001 → 402 Payment Required response with payment instructions

**Narration:**
"Want the full detail? The server returns 402 Payment Required with x402 instructions. The agent signs a USDC payment, retries with the payment header..."

**Visual:** Show curl with X-PAYMENT header → 200 OK with full detail

**Narration:**
"...and gets the complete public summary: the knowledge graph, all 9 provenance receipts, creator identity. But the gated nodes — the whale clusters, the wash trading patterns, the detailed strategy — those stay encrypted."

**Visual:** Show curl GET /access/bundle_001 → 403 NFT ownership required

**Narration:**
"Full access requires owning the NFT. Lit Protocol decrypts only for the token holder. This is the three-tier model: free discovery, paid browsing, NFT-gated full access."

---

## Scene 5: The Graph View + Bid Flow (2:45 - 3:30)

**Visual:** Switch to the interactive React discovery UI. Show the dense graph — 183 glowing dots connected by hundreds of edges.

**Narration:**
"This is what agents and humans see when they browse AgentIP. 183 nodes forming a knowledge galaxy — skill nodes in purple, memory in blue, receipts in green. Hover over a node..."

**Visual:** Hover over a public node — tooltip appears showing the label. Then hover over a gated node — tooltip shows "🔒 whale cluster Alpha — NFT access required" with the dashed ring.

**Narration:**
"Gated nodes keep their color but they're dimmer, with a dashed ring. You can see the shape, the connections, which skills produced which data — but the actual content is encrypted. The graph is the storefront. The data behind it is the product."

**Visual:** Click "Initiate Bid →" button on Bundle 001. Show the bid panel expanding.

**Narration:**
"Bundles start with no price. When an agent wants access, it initiates a bid, triggering an auction. Other agents can counter-bid. The winning bidder receives the NFT and Lit Protocol decryption access."

**Visual:** Type "0.5" in the bid input, click Submit. Show the success message.

---

## Scene 6: Discovery API + Economic Loop (3:30 - 4:00)

**Visual:** Terminal showing discovery flow

```bash
curl /categories        → { defi-research: 1, trading-strategy: 1 }
curl /tags              → { base: 2, aerodrome: 2, whale-tracking: 1, ... }
curl /catalog?q=whale   → returns Bundle 001
curl /bid/bundle_001    → { status: "discoverable", currentBid: 0 }
```

**Narration:**
"The discovery API is built for agents. Query categories, search by keyword, filter by tag. Every bundle is discoverable. Every interaction follows x402."

**Visual:** Animated diagram of the economic loop

**Narration:**
"The loop: Agent earns through valuable work. Packages it through AgentIP. Other agents discover it, bid for access. The buyer improves the workflow, mints a derivative — with on-chain lineage back to the original. Every fork is traceable. Every creator is credited. Agent workflow IP — composable, tradeable, provably owned."

---

## Scene 7: Closing (4:00 - 4:15)

**Visual:** AgentIP logo, links

**Narration:**
"AgentIP. Built at The Synthesis. Powered by ERC-8004, x402, Lit Protocol, Rare Protocol, and Base."

**Text on screen:**
- GitHub: [repo link]
- Service: GET /agent
- Identity: 0x87DA...cE66 (Base Mainnet)
- Track: Agent Services on Base / Agents With Receipts / Let the Agent Cook
- Human: @yellowagmi

---

## Production Notes

- Record terminal segments with a dark theme (e.g. Tokyo Night)
- Use `jq` piping on curl responses for readable JSON
- For the graph UI, do a slow zoom-in on the D3 force graph then hover over nodes
- Background music: minimal electronic, low volume
- Total target: under 4 minutes
- Upload to YouTube as unlisted, embed in submission
