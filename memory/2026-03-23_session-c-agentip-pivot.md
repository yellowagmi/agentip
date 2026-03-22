# Session Memory — AgentIP Pivot + Restructure
**Date:** 2026-03-23
**Session type:** Claude Code CLI (claude-sonnet-4-6)
**Status:** Step 7 complete — agentip files restructured into agentrag dir

---

## What happened this session

### Project pivot: AgentRAG → AgentIP
A web session (Session C) produced a full pivot to **AgentIP** — a service agent that packages other agents' proven workflows as discoverable, biddable NFTs. The existing AgentRAG work becomes "Bundle 001 / first client" of AgentIP.

Key insight from pivot: the vertical demo gap — AgentRAG was a researcher, but the Agent Services on Base track wants infrastructure other agents pay to use.

### New files generated in agentip/ (web session output)
| File | Purpose |
|------|---------|
| `agent_v2.json` | Updated AgentIP service manifest — 3 workers (validator/packager/minter), 16 discovery routes, catalog with bundle_001 |
| `src/server.mjs` | 16-endpoint x402 service — /catalog, /bid, /package, /validate, /access, /categories, /tags, /spec |
| `ui/agentip-discovery.jsx` | React + D3 graph UI — 185-node galaxy, dashed-ring gated nodes, hover-only labels, bid flow |
| `logs/agent_log_v2.json` | 15-step AgentIP execution log — Section A (infra) + Section B (first client pipeline) |
| `logs/session_log_20260322.json` | Session decision arc |
| `BUNDLE_SPEC.md` | Bundle Spec v1.0 — 5 node types, manifest schema, 3 access tiers, fork/derivation |
| `SUBMISSION_GUIDE.md` | Full hackathon submission guide — required fields, 5 track UUIDs, submission API call |
| `HANDOFF.md` | New session handoff — implementation status, graph stats, next steps |
| `demo/DEMO_STORYBOARD.md` | 7-scene video script (~4 min) |

### Versioned files (name conflicts → v1/v2)
- `agent_v1.json` — original AgentRAG manifest (was `agent.json`)
- `agent_v2.json` — new AgentIP manifest
- `logs/agent_log_v1.json` — original AgentRAG log (was `agent_log.json`)
- `logs/agent_log_v2.json` — new AgentIP 15-step log

---

## Current state (step 7 done)
- `handoff.json` `lastCompletedStep`: 7
- `completedSteps`: synthesis_registration, wallet_generation, swarm_transactions, nft_mint, x402_server, vault_files, agentip_restructure

---

## What's still needed for submission

### Critical (blocking)
1. **Push to public GitHub** — `repoURL` is required field. Open source rule.
2. **Self-custody transfer** — `POST /participants/me/transfer/init` + confirm. Unblocks publishing.
3. **Compile conversationLog** — required field, judges read it. Combine all session exports.
4. **Agent Services on Base track UUID** — missing from SUBMISSION_GUIDE.md. Query via `GET /catalog?company=Base`.

### Important
5. **Moltbook post** — fills `submissionMetadata.moltbookPostURL`. Read skill at moltbook.com/skill.md
6. **Screenshot graph** — use as `coverImageURL` + `pictures` in submission.
7. **Tweet** tagging @synthesis_md after publishing.

### Optional
8. **Demo video** — follow DEMO_STORYBOARD.md, upload YouTube unlisted.

---

## Track UUIDs (known)
| Track | UUID |
|-------|------|
| Agents With Receipts — ERC-8004 | `2aa04e34ca7842d6bfba26235d550293` |
| Let the Agent Cook | `78f1416489d34fc1b80d87081d6d809c` |
| Synthesis Open Track | `bd442ad05f344c6d8b117e6761fa72ce` (auto-included) |
| SuperRare Partner Track | `a7f6a6ea5f884561bce8dd9f08379ff8` |
| Agent Services on Base | ❌ TODO — look up via Synthesis API |

---

## Key decisions from web session
- No fixed bundle pricing — bundles start "discoverable", value set by bids
- Gated graph nodes: type color at 40% opacity + dashed ring (NOT grey)
- Labels: hover-only for clean graph
- Edges: #506088 at 0.8 opacity, 1.2px
- Keep agentrag/ directory, restructure don't rebuild

---

## Hackathon tracks entered (5)
1. Agent Services on Base — $5,000 pool (primary, strongest fit)
2. Agents With Receipts — ERC-8004 — $2,000/$1,500/$500
3. Let the Agent Cook — $2,000/$1,500/$500
4. Synthesis Open Track — $28,134 pool
5. SuperRare Partner Track — $1,200/$800/$500
