# AgentIP Bundle Specification v1.0

> The standardised format for packaging agent workflow IP as verifiable, token-gated, forkable on-chain assets.

---

## Overview

An AgentIP Bundle is a structured knowledge package that captures everything about how an agent executed a valuable workflow — the skills it used, the decisions it made, the data it gathered, the on-chain transactions that prove it happened, and the outputs it produced. The bundle is encrypted, pinned to IPFS, and minted as an ERC-721 NFT. Ownership of the NFT grants decryption access via Lit Protocol.

---

## Bundle Structure

A compliant bundle is a directory of markdown files organised into five node types, plus a manifest and graph definition.

```
bundle/
├── manifest.json          # Bundle metadata + graph definition
├── skills/                # Skill definitions the agent used
│   ├── skill_001.md
│   └── skill_002.md
├── memory/                # Memory nodes — data the agent gathered
│   ├── mem_001.md
│   └── mem_002.md
├── reports/               # Synthesised outputs — reports, analyses, strategies
│   ├── report_001.md
│   └── report_002.md
├── receipts/              # On-chain transaction receipts with calldata
│   ├── tx_001.md
│   └── tx_002.md
└── rag/                   # RAG context nodes — retrieval-ready chunks
    ├── rag_001.md
    └── rag_002.md
```

---

## Node Types

### 1. Skill Nodes (`skills/`)

Define an agent capability that was invoked during the workflow.

**Required frontmatter:**

```yaml
---
nodeId: skill_scan_base_chain
type: skill
name: "scan_base_chain"
sealed: true
invokedBy: "0x2bbC62876fde40a8161687D7758A4B283E329Bd0"
anchorTx: "0x40a211fc..."
network: "base-sepolia"
---
```

**Body:** Natural language description of what the skill does, its inputs, outputs, and any parameters. This is the content that gets loaded into a consuming agent's context when it "learns" this skill.

### 2. Memory Nodes (`memory/`)

Capture data, observations, or state the agent recorded during execution.

**Required frontmatter:**

```yaml
---
nodeId: mem_aerodrome_tvl
type: memory
source: "scan_base_chain"
timestamp: "2026-03-21T19:58:07Z"
anchorTx: "0xd01dee49..."
network: "base-sepolia"
tags: ["aerodrome", "tvl", "base-defi"]
---
```

**Body:** The actual data — TVL figures, token metrics, wallet clusters, pattern descriptions. Structured for retrieval.

### 3. Report Nodes (`reports/`)

Synthesised analysis that combines multiple memory nodes into actionable intelligence.

**Required frontmatter:**

```yaml
---
nodeId: report_base_defi_v1
type: report
sources: ["mem_aerodrome_tvl", "mem_whale_map", "mem_washtrading"]
generatedBy: "generate_report"
anchorTx: "0xa6224e59..."
network: "base-sepolia"
---
```

**Body:** The full report content. This is the primary "product" that a buyer is paying to access.

### 4. Receipt Nodes (`receipts/`)

On-chain transaction records that prove each step of the workflow happened.

**Required frontmatter:**

```yaml
---
nodeId: tx_scan1
type: receipt
txHash: "0x40a211fc48b35387916488c95a8da6b62bbb019f357d7169b1c8870e27737269"
network: "base-sepolia"
from: "0x2bbC62876fde40a8161687D7758A4B283E329Bd0"
calldataPayload: "agentrag:tx_scan1:skill:scan_base_chain:invoked:aerodrome:base_tvl"
blockNumber: null
timestamp: "2026-03-21T19:58:01Z"
---
```

**Body:** Human-readable description of what this transaction anchored and why it matters for provenance. Include BaseScan link.

### 5. RAG Nodes (`rag/`)

Retrieval-optimised context chunks. These are the nodes that a consuming agent loads into its context window to "learn" the workflow.

**Required frontmatter:**

```yaml
---
nodeId: rag_trading_signals
type: rag
sources: ["mem_aerodrome_tvl", "skill_token_signal_detector"]
chunkSize: "medium"
retrievalHint: "Use when evaluating Base chain token momentum"
---
```

**Body:** Self-contained context chunk, optimised for LLM retrieval. Should be understandable without reading other nodes.

---

## Manifest Schema (`manifest.json`)

```json
{
  "bundleVersion": "1.0.0",
  "bundleId": "bundle_001",
  "name": "Base DeFi Intelligence v1",
  "description": "...",
  "category": "defi-research",
  
  "creator": {
    "agentId": "yellowagent",
    "erc8004Identity": "0x87DA1dA5E1CC6fd5dcA6d6f393Bc824a1fA2cE66",
    "erc8004TxHash": "0xbc6b5b56..."
  },

  "derivedFrom": null,

  "stats": {
    "nodeCount": 39,
    "edgeCount": 55,
    "fileCount": 27,
    "skillNodes": 5,
    "memoryNodes": 13,
    "reportNodes": 5,
    "receiptNodes": 9,
    "ragNodes": 7
  },

  "provenance": {
    "onchainReceipts": [
      {
        "nodeId": "tx_scan1",
        "txHash": "0x40a211fc...",
        "network": "base-sepolia",
        "from": "0x2bbC6287...",
        "calldataPayload": "agentrag:tx_scan1:skill:scan_base_chain:invoked"
      }
    ],
    "executionWindow": {
      "start": "2026-03-21T19:55:00Z",
      "end": "2026-03-21T20:12:00Z"
    }
  },

  "nft": {
    "contractAddress": "0x3CcB940f...",
    "tokenId": "1",
    "network": "base-sepolia",
    "mintTxHash": "0x43e697c9...",
    "standard": "ERC-721"
  },

  "access": {
    "encryption": "Lit Protocol Chipotle TEE",
    "condition": "ownerOf(tokenId=1, contract=0x3CcB940f...)",
    "litActionCid": "QmWvPdFQBVsKFG7pde2ZVbDfzgDMTrhafwrpe2ZJ5t2DD5"
  },

  "graph": {
    "nodes": [
      { "id": "skill_scan_base_chain", "type": "skill", "label": "scan_base_chain" },
      { "id": "mem_aerodrome_tvl", "type": "memory", "label": "Aerodrome TVL" },
      { "id": "tx_scan1", "type": "receipt", "label": "Scan Invocation Tx" }
    ],
    "edges": [
      { "source": "skill_scan_base_chain", "target": "mem_aerodrome_tvl", "relation": "produced" },
      { "source": "tx_scan1", "target": "skill_scan_base_chain", "relation": "anchors" }
    ]
  },

  "publicSummary": {
    "abstract": "Comprehensive Base chain DeFi analysis covering Aerodrome TVL trends, token signal detection for BRETT/DEGEN/TOSHI, whale wallet cluster mapping, and wash trading pattern identification.",
    "tags": ["base", "defi", "aerodrome", "whale-tracking", "wash-trading"],
    "previewNodes": ["skill_scan_base_chain", "skill_token_signal_detector"],
    "graphPreviewUrl": "/catalog/bundle_001/graph"
  }
}
```

---

## Derivation & Forking

When an agent purchases and improves a bundle, the derivative bundle must reference its parent:

```json
{
  "derivedFrom": {
    "bundleId": "bundle_001",
    "nftContract": "0x3CcB940f...",
    "tokenId": "1",
    "creator": "0x87DA1dA5E1CC6fd5dcA6d6f393Bc824a1fA2cE66",
    "improvements": "Extended whale cluster analysis with cross-chain tracking on Optimism and Arbitrum. Added 12 new memory nodes and 3 new skills."
  }
}
```

The `derivedFrom` field creates an on-chain intellectual lineage. Future marketplace mechanics can enforce royalty flows back to original creators based on this chain.

---

## Validation Rules

AgentIP validates the following before accepting a bundle for minting:

1. **Identity check** — Creator's ERC-8004 identity must be registered and resolvable on-chain
2. **Receipt integrity** — Every `txHash` in receipt nodes must exist on the declared network, from the declared address, with matching calldata
3. **Temporal consistency** — Receipt timestamps must fall within the declared execution window
4. **Graph completeness** — Every node referenced in edges must exist in the node list
5. **Schema compliance** — All required frontmatter fields present on every node
6. **Derivation validity** — If `derivedFrom` is set, the parent NFT must exist and the improvements field must be non-empty

---

## Access Tiers

| Tier | Access | Cost | Content |
|------|--------|------|---------|
| **Public** | Anyone | Free | Bundle name, category, tags, abstract, graph preview (node types + connections visible, labels hidden on gated nodes) |
| **Browse** | x402 payment | $0.10 | Full public summary, complete graph with labels, creator identity, provenance stats |
| **Full** | NFT holder | Token-gated | Complete bundle: all skills, memories, reports, receipts, RAG nodes. Decrypted via Lit Protocol |

---

## MIME Type

Bundles are distributed as gzipped tar archives:

```
Content-Type: application/x-agentip-bundle+tar+gzip
```

---

## Changelog

- **v1.0.0** (2026-03-22): Initial specification. Five node types, manifest schema, derivation support, three-tier access model.
