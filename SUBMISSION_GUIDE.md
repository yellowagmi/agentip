# AgentIP — Submission Guide

> Reference document for The Synthesis hackathon submission
> Building ends: March 22, 11:59 PM PST (March 23, 3:59 PM SGT)
> Submission API: https://synthesis.devfolio.co
> Submission skill: https://synthesis.md/submission/skill.md

---

## Submission Schema (Required Fields)

| Field | Required? | Our Status | Notes |
|-------|-----------|-----------|-------|
| `name` | ✅ Required | ✅ Ready | "AgentIP" |
| `description` | ✅ Required | ✅ Ready | Elevator pitch — what it does, why it matters. From README opening. |
| `problemStatement` | ✅ Required | ✅ Ready | Separate from description. Specific problem, who's affected, what changes. From README "The Problem" section. |
| `repoURL` | ✅ Required | ❌ TODO | Must be PUBLIC GitHub repo by deadline. Push via Claude Code. |
| `trackUUIDs` | ✅ Required (1–10) | ❌ TODO | Look up via `GET /catalog`. See Track UUIDs section below. |
| `conversationLog` | ✅ Required | ❌ TODO | **Judges READ this.** Brainstorms, pivots, breakthroughs. Combine Claude Code sessions + this claude.ai strategy session. |
| `submissionMetadata` | ✅ Required | ❌ TODO | Full build stack object. See next section. |
| `deployedURL` | Optional | ⚠️ Skip | No live URL — server runs locally. Can omit or note "local demo". |
| `videoURL` | Optional | ⚠️ Skip if tight on time | Demo video helps but not required. |
| `pictures` | Optional | ❌ TODO | Screenshot the React graph component (185-node galaxy). Upload to imgur. |
| `coverImageURL` | Optional | ❌ TODO | Same graph screenshot works as cover. |

### Field Guidance

**`description`** — What your project does, what it is, why it matters. Elevator pitch. Judges see this first.

Draft:
> AgentIP is a service agent on Base that packages other agents' proven workflows — trading strategies, research pipelines, prediction models — into discoverable, biddable NFTs. Agents submit their execution logs, skills, memory nodes, and on-chain receipts. AgentIP validates provenance on-chain, structures data into a standardised Bundle Spec, encrypts via Lit Protocol, mints an ERC-721 NFT, and lists it for discovery via x402-gated API. The public knowledge graph is free to browse. The detailed workflow IP is gated to NFT holders. Every step is anchored on Base Sepolia with human-readable calldata receipts decodable on BaseScan.

**`problemStatement`** — The specific real-world problem. Must be grounded, not vague.

Draft:
> AI agents produce valuable work every day — profitable DeFi strategies, research that surfaces alpha, prediction models that beat markets. But the process behind that work — the skills, decision logic, memory context, and execution traces — is trapped in ephemeral chat logs and context windows that disappear after each session. There's no way for an agent to prove it did what it claims without trusting a centralized platform, no way to package its workflow as a structured reusable asset, no way to sell access to other agents, and no way to maintain provenance when others fork and improve it. The intelligence dies with the session.

**`conversationLog`** — Judges want to see the actual human-agent collaboration process. This should include:
- The original AgentRAG build (Claude Code sessions)
- The strategic evaluation session (this claude.ai session) where we identified the vertical demo gap
- The pivot decision from AgentRAG → AgentIP
- Key design decisions (gated node style, bid mechanics, discovery API)
- The `session_log_20260322.json` is a structured version but the raw conversation is more compelling

---

## submissionMetadata (Required Object)

```json
{
  "agentFramework": "other",
  "agentFrameworkOther": "Custom x402 service agent with Express + ethers.js + D3.js",
  "agentHarness": "claude-code",
  "model": "claude-sonnet-4-6",
  "skills": [
    "web-search",
    "frontend-design"
  ],
  "tools": [
    "ethers.js",
    "Express",
    "D3.js",
    "Rare Protocol CLI",
    "Lit Protocol SDK",
    "IPFS",
    "Synthesis API",
    "x402"
  ],
  "helpfulResources": [
    "https://synthesis.md/skill.md",
    "https://synthesis.md/submission/skill.md",
    "https://github.com/sodofi/synthesis-hackathon",
    "https://synthesis.devfolio.co/catalog/prizes.md",
    "https://www.x402.org"
  ],
  "helpfulSkills": [
    {
      "name": "frontend-design",
      "reason": "Generated the dense D3 force-directed graph UI with 185 glowing nodes, dashed-ring gated node visualization, and hover-only labels — matched our Obsidian-style design target on the first full iteration"
    },
    {
      "name": "web-search",
      "reason": "Fetched the full hackathon prize catalog (132 prizes across 3 pages), track descriptions, and submission schema — this drove the AgentRAG → AgentIP pivot when we realized the vertical demo didn't match the Agent Services on Base track"
    }
  ],
  "intention": "continuing",
  "intentionNotes": "Building on-chain auction settlement (smart contract escrow), live Lit Protocol decryption, automated intake pipeline for external agents, and fork/derivative tracking with royalty flows post-hackathon",
  "moltbookPostURL": ""
}
```

### Field-by-Field Guidance

**`skills`** — Agent skill identifiers that were ACTUALLY LOADED during development. Not human skills. Judges cross-reference with conversation log and repo.
- `web-search` — YES, used to fetch hackathon details, track descriptions, prize catalog, x402 documentation
- `frontend-design` — YES, used to generate the React + D3 graph UI with design guidelines
- Do NOT list skills we didn't use. Empty list is better than inflated.

**`tools`** — Concrete tools, libraries, platforms we installed, deployed to, or called APIs of.
- ethers.js — wallet generation, tx signing, on-chain receipt validation
- Express — x402 service server (16 endpoints)
- D3.js — force-directed knowledge graph visualization
- Rare Protocol CLI — ERC-721 NFT minting
- Lit Protocol SDK — encryption scheme definition (access conditions, litActionCid)
- IPFS — bundle pinning via Pinata
- Synthesis API — ERC-8004 identity registration
- x402 — payment protocol for gated endpoints

**`helpfulResources`** — Specific URLs we ACTUALLY OPENED and consulted. Not generic homepages.

**`intention`** — Not judged positively or negatively. "one-time" is valid. We're honestly "continuing".

**`moltbookPostURL`** — Fill after posting on Moltbook. Read skill at https://www.moltbook.com/skill.md

---

## Track-Specific Judging Criteria

### 1. Agent Services on Base — $5,000 pool (3 × $1,667, no ranking)

**Description:** "Build an agent service (an agent that provides services to other agents or humans) which can be easily discovered on Base and accepts payments via x402 for its services. We're looking for agent services that provide meaningful utility and that illustrates other agents' and humans' willingness to pay for their services. They should leverage agent coordination infrastructure to ensure the agent is discoverable."

**What judges check:**
| Criteria | Our Evidence |
|----------|-------------|
| Agent provides service to other agents/humans | ✅ AgentIP packages workflows for client agents |
| Discoverable on Base | ✅ ERC-8004 identity on Base Mainnet + GET /agent manifest + GET /categories + GET /tags |
| Accepts x402 payments | ✅ GET /catalog/:id returns 402 → payment → 200. POST /package and POST /validate are x402 gated |
| Meaningful utility | ✅ Novel — no other agent IP packaging service exists. Workflow monetization is a new primitive. |
| Agent coordination infrastructure | ✅ Discovery API (search, filter, categories, tags), x402 protocol, ERC-8004 identity |

**Our primary track. Strongest fit.**

---

### 2. 🤖 Let the Agent Cook — No Humans Required — $2,000 1st / $1,500 2nd / $500 3rd

**Description:** "Awarded to the most autonomous, fully end-to-end agent demonstrating the complete decision loop (discover → plan → execute → verify → submit), multi-tool orchestration, robust safety guardrails, ERC-8004 identity, and meaningful real-world impact."

**What judges check:**
| Criteria | Our Evidence |
|----------|-------------|
| Complete decision loop | ✅ receive → validate → structure → encrypt → mint → list (agent_log.json steps 5–14) |
| Multi-tool orchestration | ✅ ethers.js + Rare Protocol + Lit Protocol + IPFS + x402 + D3.js |
| Safety guardrails | ✅ 6 guards in agent.json (validates tx params, confirms API outputs, aborts unsafe ops, compute budget, worker pre-auth) |
| ERC-8004 identity | ✅ Registered on Base Mainnet: tx 0xbc6b5b56... |
| Meaningful real-world impact | ✅ Agent IP marketplace — enables workflow monetization |

**Note:** "Shared track: Synthesis Hackathon × PL_Genesis" — Protocol Labs co-judges this.

---

### 3. Agents With Receipts — ERC-8004 — $2,000 1st / $1,500 2nd / $500 3rd

**Description:** "Awarded to the top project that best demonstrates trusted agent systems using ERC-8004, with the strongest onchain verifiability, autonomous agent architecture, and DevSpot compatibility."

**What judges check:**
| Criteria | Our Evidence |
|----------|-------------|
| ERC-8004 usage | ✅ Identity registered, participantId, on-chain tx |
| Strongest on-chain verifiability | ✅ 9 receipts with UTF-8 calldata decodable on BaseScan. Every step anchored. |
| Autonomous agent architecture | ✅ 3 role-scoped worker wallets, service loop, x402 discovery |
| DevSpot compatibility | ⚠️ UNKNOWN — may refer to Protocol Labs' DevSpot. Need to check if specific integration required. |

**Note:** Also "Shared track: Synthesis Hackathon × PL_Genesis"

**⚠️ Gap: "DevSpot compatibility"** — This is mentioned in the description but not explained. It may refer to a Protocol Labs developer platform. If it requires a specific integration we haven't done, this could weaken our placement. Worth asking in the Telegram group or checking Protocol Labs docs.

---

### 4. Synthesis Open Track — $28,134 (community-funded pool)

**Description:** "The Synthesis Open Track is a shared, open prize across the whole event. It's the synthesis of all the values across all the agent judges, with a direct focus on projects that align with the tracks."

**What judges check:**
| Theme | Our Alignment |
|-------|--------------|
| Agents that Pay | ✅ x402 gated endpoints, USDC payments for service |
| Agents that Trust | ✅ ERC-8004 identity, on-chain receipts as trust layer, verifiable calldata |
| Agents that Cooperate | ✅ Fork/derivative lineage (derivedFrom field), Bundle Spec as shared standard |
| Agents that Keep Secrets | ✅ Lit Protocol encryption, NFT-gated access, public summary / private details split |

**Judged by AI agent judges + humans.** Alignment across all 4 themes matters more than depth in one.

---

### 5. SuperRare Partner Track — $1,200 1st / $800 2nd / $500 3rd

**Description:** "Best autonomous agent artwork built on Rare Protocol — awarded to the most compelling synthesis of agent behavior, on-chain mechanics, and artistic expression."

**What judges check:**
| Criteria | Our Evidence |
|----------|-------------|
| Built on Rare Protocol | ✅ NFT minted via Rare Protocol CLI |
| Agent behavior | ✅ Autonomous packaging pipeline |
| On-chain mechanics | ✅ 9 receipts, NFT minting, IPFS anchoring |
| Artistic expression | ⚠️ WEAK — our NFT is a knowledge bundle, not artwork. The graph visualization could be framed as the artistic artifact, but this track is a stretch. |

**Weakest track for us. Consider dropping if submission allows limited tracks to strengthen focus.**

---

### 6. BONUS: Dark Knowledge Skills — Lit Chipotle — $250

**Description:** "Awarded to the best working AI skill built on Lit Protocol's Chipotle TEE-secured runtime that demonstrates a compelling Knowledge Moat, strong privacy architecture, and a convincing end-to-end proof of concept. The winning skill must seal proprietary data or logic inside a Lit Action and deliver results genuinely inaccessible to foundation models."

**Our fit:** Conceptually aligned (gated knowledge behind Lit, knowledge moat thesis). But our Lit integration is **architected, not live** — decrypt-on-demand is not functional. We'd be weak here. **Skip unless Lit flow can be made live.**

---

## Track UUIDs (For Submission)

| Track | UUID | Source |
|-------|------|--------|
| Agents With Receipts — ERC-8004 | `2aa04e34ca7842d6bfba26235d550293` | Prize catalog page 1 |
| Let the Agent Cook | `78f1416489d34fc1b80d87081d6d809c` | Prize catalog page 1 |
| Synthesis Open Track | `bd442ad05f344c6d8b117e6761fa72ce` | Prize catalog page 1 |
| SuperRare Partner Track | `a7f6a6ea5f884561bce8dd9f08379ff8` | Prize catalog page 1 |
| Agent Services on Base | ❌ TODO — look up via `GET /catalog?company=Base` | Need to query |

**Note:** The Synthesis Open Track is auto-included and does not count toward the 10-track limit.

---

## Hackathon Rules (from skill.md)

| Rule | Requirement | Our Status |
|------|-------------|-----------|
| 1 | **Ship something that works.** Demos, prototypes, deployed contracts. Ideas alone don't win. | ✅ Server runs, 16 endpoints tested, graph renders, NFT minted, receipts on-chain |
| 2 | **Your agent must be a real participant.** Not a wrapper. Show meaningful contribution to design, code, or coordination. | ✅ Agent registered via ERC-8004, meaningful contribution to architecture + code generation + strategic pivots |
| 3 | **Everything on-chain counts.** Contracts, ERC-8004 registrations, attestations. More on-chain artifacts = stronger submission. | ✅ 9 on-chain receipts + 1 ERC-8004 identity + 1 NFT mint = 11 on-chain artifacts, all with decodable calldata |
| 4 | **Open source required.** All code must be public by deadline. | ❌ TODO — push to public GitHub as "agentip" |
| 5 | **Document your process.** Use the `conversationLog` field to capture human-agent collaboration. Brainstorms, pivots, breakthroughs. This is history. | ❌ TODO — compile from Claude Code sessions + this claude.ai session |

---

## What's Missing — Action Items

### Critical (Blocking Submission)

| # | Action | Why It's Blocking | How |
|---|--------|------------------|-----|
| 1 | **Push to public GitHub repo** | `repoURL` is required. Rule 4 requires open source. | Claude Code: restructure ragagent dir → commit → push as "agentip" |
| 2 | **Self-custody transfer** | Cannot publish without it. All team members must complete. | `POST /participants/me/transfer/init` → `POST /participants/me/transfer/confirm` |
| 3 | **Compile conversationLog** | Required field. Judges read it. | Combine Claude Code session exports + session_log_20260322.json + key excerpts from this session |
| 4 | **Look up Agent Services on Base track UUID** | Need for `trackUUIDs` array | `GET /catalog?company=Base` via Claude Code |

### Important (Strengthens Submission)

| # | Action | Impact | How |
|---|--------|--------|-----|
| 5 | **Moltbook post** | Required for `submissionMetadata.moltbookPostURL` | Read https://www.moltbook.com/skill.md — post via agent |
| 6 | **Screenshot graph as cover image** | Judges see this in project listing before clicking through | Screenshot React component, upload to imgur, use as `coverImageURL` and `pictures` |
| 7 | **Tweet tagging @synthesis_md** | Visibility with judges, sponsors, community. Submission skill "strongly recommends" it. | Post after publishing. Include graph screenshot + repo link. |

### Optional (Nice to Have)

| # | Action | Impact | How |
|---|--------|--------|-----|
| 8 | **Demo video** | Judges value it but not required | Follow DEMO_STORYBOARD.md, upload YouTube unlisted |
| 9 | **Check DevSpot compatibility** | Matters for Agents With Receipts track | Ask in Telegram group or check Protocol Labs docs |
| 10 | **Decide on SuperRare track** | Weakest fit — "artistic expression" is a stretch | Consider dropping to focus on stronger 4 tracks |

---

## Submission Order of Operations

```
1. Push repo to GitHub (public)               ← enables repoURL
2. Self-custody transfer                       ← enables publishing
3. Moltbook post                               ← enables moltbookPostURL
4. Screenshot graph                            ← enables pictures + coverImageURL
5. POST /projects (create draft)               ← all required fields
6. Review draft via GET /projects/:uuid
7. POST /projects/:uuid/publish                ← only team admin can publish
8. Tweet tagging @synthesis_md                 ← after publishing
```

---

## Submission API Call (Draft)

```bash
POST https://synthesis.devfolio.co/projects
Authorization: Bearer sk-synth-...
Content-Type: application/json

{
  "teamUUID": "<your-team-uuid>",
  "name": "AgentIP",
  "description": "AgentIP is a service agent on Base that packages other agents' proven workflows — trading strategies, research pipelines, prediction models — into discoverable, biddable NFTs. Agents submit their execution logs, skills, memory nodes, and on-chain receipts. AgentIP validates provenance on-chain, structures data into a standardised Bundle Spec, encrypts via Lit Protocol, mints an ERC-721 NFT, and lists it for discovery via x402-gated API. The public knowledge graph is free to browse. The detailed workflow IP is gated to NFT holders. Every step is anchored on Base Sepolia with human-readable calldata receipts decodable on BaseScan. This is a working local demo with real on-chain artifacts — 9 receipts, 1 NFT, 1 ERC-8004 identity — and a 16-endpoint x402 service with discovery API, bid mechanics, and interactive 185-node knowledge graph visualization.",
  "problemStatement": "AI agents produce valuable work every day — profitable DeFi strategies, research that surfaces alpha, prediction models that beat markets. But the process behind that work — the skills, decision logic, memory context, and execution traces — is trapped in ephemeral chat logs and context windows that disappear after each session. There is no way for an agent to prove it did what it claims without trusting a centralized platform, package its workflow as a structured reusable asset, sell access to other agents, or maintain provenance when others fork and improve it. The intelligence dies with the session.",
  "repoURL": "https://github.com/<USERNAME>/agentip",
  "trackUUIDs": [
    "<agent-services-on-base-uuid>",
    "2aa04e34ca7842d6bfba26235d550293",
    "78f1416489d34fc1b80d87081d6d809c",
    "a7f6a6ea5f884561bce8dd9f08379ff8"
  ],
  "conversationLog": "<compiled conversation log>",
  "submissionMetadata": {
    "agentFramework": "other",
    "agentFrameworkOther": "Custom x402 service agent with Express + ethers.js + D3.js",
    "agentHarness": "claude-code",
    "model": "claude-sonnet-4-6",
    "skills": ["web-search", "frontend-design"],
    "tools": ["ethers.js", "Express", "D3.js", "Rare Protocol CLI", "Lit Protocol SDK", "IPFS", "Synthesis API", "x402"],
    "helpfulResources": [
      "https://synthesis.md/skill.md",
      "https://synthesis.md/submission/skill.md",
      "https://github.com/sodofi/synthesis-hackathon",
      "https://synthesis.devfolio.co/catalog/prizes.md",
      "https://www.x402.org"
    ],
    "helpfulSkills": [
      { "name": "frontend-design", "reason": "Generated the dense D3 force-directed graph UI with 185 glowing nodes and dashed-ring gated node visualization matching our Obsidian-style design target" },
      { "name": "web-search", "reason": "Fetched the full hackathon prize catalog and track descriptions which drove the AgentRAG to AgentIP pivot" }
    ],
    "intention": "continuing",
    "intentionNotes": "Building on-chain auction settlement, live Lit Protocol decryption, automated intake pipeline, and fork/derivative tracking post-hackathon",
    "moltbookPostURL": "<fill after posting>"
  },
  "pictures": "<imgur link to graph screenshot>",
  "coverImageURL": "<imgur link to graph screenshot>"
}
```

**Note:** The Synthesis Open Track (`bd442ad05f344c6d8b117e6761fa72ce`) is auto-included and does not need to be in `trackUUIDs`.
