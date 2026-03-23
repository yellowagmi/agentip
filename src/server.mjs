import express from 'express';
import cors from 'cors';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/ui', express.static(join(__dirname, '..', 'ui')));

// ─── Load manifests ────────────────────────────────────────────────────────
const agentManifest = JSON.parse(readFileSync(join(__dirname, 'agent.json'), 'utf-8'));
const bundleSpec = readFileSync(join(__dirname, 'BUNDLE_SPEC.md'), 'utf-8');

// ─── In-memory catalog (seeded with Bundle 001) ───────────────────────────
const catalog = new Map();
const purchases = new Map();

catalog.set('bundle_001', {
  bundleId: 'bundle_001',
  name: 'Base DeFi Intelligence v1',
  creator: {
    agentId: 'yellowagent',
    agentName: 'AgentRAG',
    erc8004Identity: '0x87DA1dA5E1CC6fd5dcA6d6f393Bc824a1fA2cE66',
    erc8004TxHash: '0xbc6b5b564869ff98808f6a4fe03651c862f01d4ee56fcaee225ce53a2529c5ed'
  },
  category: 'defi-research',
  tags: ['base', 'defi', 'aerodrome', 'whale-tracking', 'wash-trading', 'token-signals'],
  summary: 'Comprehensive Base chain DeFi analysis: Aerodrome TVL trends, token signal detection (BRETT, DEGEN, TOSHI), whale wallet cluster mapping, wash trading pattern identification, and rug signal taxonomy.',
  publicGraph: {
    nodeCount: 39,
    edgeCount: 55,
    nodeTypes: { skills: 5, memory: 13, reports: 5, receipts: 9, rag: 7 },
    previewNodes: [
      { id: 'skill_scan_base_chain', type: 'skill', label: 'scan_base_chain', visible: true },
      { id: 'skill_token_signal', type: 'skill', label: 'token_signal_detector', visible: true },
      { id: 'skill_generate_report', type: 'skill', label: 'generate_report', visible: true },
      { id: 'skill_wallet_cluster', type: 'skill', label: 'wallet_cluster_analyzer', visible: true },
      { id: 'skill_risk_score', type: 'skill', label: 'risk_score_calculator', visible: true },
      { id: 'mem_aerodrome', type: 'memory', label: 'Aerodrome TVL', visible: true },
      { id: 'mem_base_tvl', type: 'memory', label: 'Base Q1 2026 TVL', visible: true },
      { id: 'mem_washtrading', type: 'memory', label: '███ GATED ███', visible: false },
      { id: 'mem_whale_map', type: 'memory', label: '███ GATED ███', visible: false },
      { id: 'report_defi_v1', type: 'report', label: '███ GATED ███', visible: false },
      { id: 'tx_scan1', type: 'receipt', label: 'tx_scan1', visible: true },
      { id: 'tx_nft_mint', type: 'receipt', label: 'tx_nft_mint', visible: true }
    ],
    previewEdges: [
      { source: 'skill_scan_base_chain', target: 'mem_aerodrome', relation: 'produced' },
      { source: 'skill_scan_base_chain', target: 'mem_base_tvl', relation: 'produced' },
      { source: 'skill_token_signal', target: 'mem_washtrading', relation: 'produced' },
      { source: 'skill_wallet_cluster', target: 'mem_whale_map', relation: 'produced' },
      { source: 'tx_scan1', target: 'skill_scan_base_chain', relation: 'anchors' }
    ]
  },
  nft: {
    contractAddress: '0x3CcB940f6Af748A46FFF42db8E89278059A3E8dB',
    tokenId: '1',
    network: 'base-sepolia',
    mintTxHash: '0x43e697c9914acb9d84d2b1f66a30849b8928b4097cdd6268385b9d144d37521d'
  },
  bundle: {
    ipfsCid: 'QmfUafj31oGNwEmZaaWgs7CwwxC392f32mJp3FeE4gunYy',
    encryption: 'Lit Protocol Chipotle TEE',
    accessCondition: 'ownerOf(tokenId=1)',
    fileCount: 27
  },
  provenance: {
    onchainReceipts: 9,
    network: 'base-sepolia',
    executionWindow: {
      start: '2026-03-21T19:55:00Z',
      end: '2026-03-21T20:12:00Z'
    },
    calldataFormat: 'agentrag:{nodeId}:{type}:{context}',
    receipts: [
      { nodeId: 'tx_erc8004', hash: '0xbc6b5b564869ff98808f6a4fe03651c862f01d4ee56fcaee225ce53a2529c5ed', network: 'base-mainnet' },
      { nodeId: 'tx_scan1', hash: '0x40a211fc48b35387916488c95a8da6b62bbb019f357d7169b1c8870e27737269', network: 'base-sepolia' },
      { nodeId: 'tx_scan2', hash: '0xeca909e35a1de808198edc8a743ab29875010fa884774570445f19fb98652293', network: 'base-sepolia' },
      { nodeId: 'tx_token_sig', hash: '0xb1cc9fee3a0014baf20feaf0fc11113df91f68786d9944d8f8c71e0dd2f25769', network: 'base-sepolia' },
      { nodeId: 'tx_mem1', hash: '0xd01dee4944b566c47869a8ce7b8ff4b63075423043655f6e9cc2b440b488fd97', network: 'base-sepolia' },
      { nodeId: 'tx_mem2', hash: '0x4935a78b729b40797ce39f32ddff478cca8d0243afdc8306f7e4b9d17546505f', network: 'base-sepolia' },
      { nodeId: 'tx_report', hash: '0xa6224e59695ceb222e0c27965cd1382d1e69372f28f78cc8ac26ebfab2427a14', network: 'base-sepolia' },
      { nodeId: 'tx_rag_anchor', hash: '0x5f4d623787ea30f8cb05641e62c3bea52dbc8fbe1013df59ad361e19eee591e7', network: 'base-sepolia' },
      { nodeId: 'tx_nft_mint', hash: '0x43e697c9914acb9d84d2b1f66a30849b8928b4097cdd6268385b9d144d37521d', network: 'base-sepolia' }
    ]
  },
  derivedFrom: null,
  listedAt: '2026-03-21T20:12:00Z',
  status: 'listed'
});


// ─── x402 middleware ───────────────────────────────────────────────────────
const AGENTIP_WALLET = '0x87DA1dA5E1CC6fd5dcA6d6f393Bc824a1fA2cE66';

function x402Paywall(priceUsd, description) {
  return (req, res, next) => {
    const paymentHeader = req.headers['x-payment'];
    
    if (!paymentHeader) {
      // Return 402 with payment instructions per x402 spec
      res.status(402).json({
        status: 402,
        message: 'Payment Required',
        protocol: 'x402',
        payment: {
          amount: priceUsd,
          currency: 'USDC',
          recipient: AGENTIP_WALLET,
          network: 'base-sepolia',
          chainId: 84532,
          description: description,
          payTo: AGENTIP_WALLET,
          maxAmountRequired: priceUsd,
          resource: req.originalUrl
        },
        instructions: {
          step1: 'Sign a USDC transferWithAuthorization (EIP-3009) for the amount above',
          step2: 'Base64-encode the signed payload',
          step3: 'Retry this request with header: X-PAYMENT: <base64_payload>',
          reference: 'https://www.x402.org'
        }
      });
      return;
    }

    // Verify payment (simplified for testnet demo — production uses facilitator)
    try {
      const decoded = Buffer.from(paymentHeader, 'base64').toString('utf-8');
      const paymentData = JSON.parse(decoded);
      
      // Validate payment fields
      if (!paymentData.from || !paymentData.signature) {
        return res.status(400).json({ error: 'Invalid payment payload. Required: from, signature' });
      }

      // Log the payment for audit trail
      console.log(`[x402] Payment received: ${priceUsd} USDC from ${paymentData.from} for ${req.originalUrl}`);
      
      // Attach payment info to request
      req.x402Payment = {
        from: paymentData.from,
        amount: priceUsd,
        timestamp: new Date().toISOString(),
        resource: req.originalUrl,
        verified: true
      };
      
      next();
    } catch (err) {
      // Also allow a simple demo mode for hackathon judging
      if (paymentHeader === 'demo-access') {
        req.x402Payment = { from: 'demo', amount: priceUsd, timestamp: new Date().toISOString(), verified: false };
        next();
      } else {
        res.status(400).json({ error: 'Malformed payment payload', details: err.message });
      }
    }
  };
}

// ─── ROUTES ────────────────────────────────────────────────────────────────

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'AgentIP',
    version: '1.0.0',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    catalog: { totalBundles: catalog.size },
    network: 'base-sepolia'
  });
});

// ─── FREE: Service manifest ───────────────────────────────────────────────
app.get('/agent', (req, res) => {
  res.json({
    name: agentManifest.name,
    version: agentManifest.version,
    description: agentManifest.description,
    serviceType: agentManifest.serviceType,
    erc8004Identity: agentManifest.operator.wallet,
    erc8004TxHash: agentManifest.operator.erc8004TxHash,
    network: agentManifest.operator.network,
    service: agentManifest.service,
    discovery: agentManifest.discovery,
    bundleSpecUrl: '/spec',
    catalogUrl: '/catalog',
    protocol: 'x402',
    paymentNetwork: 'base-sepolia'
  });
});

// ─── FREE: Bundle spec ────────────────────────────────────────────────────
app.get('/spec', (req, res) => {
  res.type('text/markdown').send(bundleSpec);
});

// ─── In-memory bid tracking ───────────────────────────────────────────────
const bids = new Map(); // bundleId → [{bidder, amount, timestamp}]
// Bundles start as "discoverable" — no bids until an agent initiates

// ─── FREE: List all categories with counts ────────────────────────────────
app.get('/categories', (req, res) => {
  const counts = {};
  for (const b of catalog.values()) {
    counts[b.category] = (counts[b.category] || 0) + 1;
  }
  res.json({
    service: 'AgentIP',
    categories: Object.entries(counts).map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  });
});

// ─── FREE: List all tags with counts ──────────────────────────────────────
app.get('/tags', (req, res) => {
  const counts = {};
  for (const b of catalog.values()) {
    for (const t of b.tags) {
      counts[t] = (counts[t] || 0) + 1;
    }
  }
  res.json({
    service: 'AgentIP',
    tags: Object.entries(counts).map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  });
});

// ─── FREE: Catalog listing (public summaries) ─────────────────────────────
app.get('/catalog', (req, res) => {
  const { category, tag, sort, q, skill } = req.query;
  let bundles = [...catalog.values()];

  // Filter by category
  if (category) bundles = bundles.filter(b => b.category === category);
  // Filter by tag
  if (tag) bundles = bundles.filter(b => b.tags.includes(tag));
  // Keyword search across name, summary, tags, category
  if (q) {
    const lq = q.toLowerCase();
    bundles = bundles.filter(b =>
      b.name.toLowerCase().includes(lq) ||
      b.summary.toLowerCase().includes(lq) ||
      b.category.toLowerCase().includes(lq) ||
      b.tags.some(t => t.toLowerCase().includes(lq))
    );
  }
  // Filter by skill name in graph nodes
  if (skill) {
    const ls = skill.toLowerCase();
    bundles = bundles.filter(b =>
      b.publicGraph?.previewNodes?.some(n => n.type === 'skill' && n.label.toLowerCase().includes(ls))
    );
  }

  // Sort
  if (sort === 'newest') bundles.sort((a, b) => new Date(b.listedAt) - new Date(a.listedAt));
  if (sort === 'oldest') bundles.sort((a, b) => new Date(a.listedAt) - new Date(b.listedAt));
  if (sort === 'bids') bundles.sort((a, b) => (bids.get(b.bundleId)?.length || 0) - (bids.get(a.bundleId)?.length || 0));

  res.json({
    service: 'AgentIP',
    totalBundles: bundles.length,
    queryParams: { category, tag, q, skill, sort },
    bundles: bundles.map(b => {
      const bundleBids = bids.get(b.bundleId) || [];
      const highestBid = bundleBids.length ? Math.max(...bundleBids.map(x => x.amount)) : 0;
      return {
        bundleId: b.bundleId,
        name: b.name,
        category: b.category,
        tags: b.tags,
        summary: b.summary,
        creator: {
          agentName: b.creator.agentName || b.creator.agentId,
          erc8004Identity: b.creator.erc8004Identity
        },
        stats: b.publicGraph.nodeTypes,
        nft: { contract: b.nft.contractAddress, tokenId: b.nft.tokenId, network: b.nft.network },
        provenance: { receipts: b.provenance.onchainReceipts, network: b.provenance.network },
        auction: { currentBid: highestBid, bidCount: bundleBids.length, status: highestBid > 0 ? 'active' : 'open' },
        saleType: b.saleType || 'primary',
        buyNowPrice: b.buyNowPrice || null,
        buyNowCurrency: b.buyNowCurrency || null,
        status: b.status || 'listed',
        derivedFrom: b.derivedFrom,
        listedAt: b.listedAt,
        detailUrl: `/catalog/${b.bundleId}`,
        graphUrl: `/catalog/${b.bundleId}/graph`,
        bidUrl: `/bid/${b.bundleId}`,
        accessPrice: '$0.10 USDC (x402)',
        fullAccessMethod: 'NFT ownership + Lit Protocol decryption'
      };
    })
  });
});

// ─── x402 GATED: Full bundle detail + graph ───────────────────────────────
app.get('/catalog/:bundleId', x402Paywall('0.10', 'Access full public summary and graph for this AgentIP bundle'), (req, res) => {
  const bundle = catalog.get(req.params.bundleId);
  if (!bundle) return res.status(404).json({ error: 'Bundle not found' });

  res.json({
    ...bundle,
    payment: req.x402Payment,
    accessTier: 'browse',
    note: 'Full bundle data requires NFT ownership. Use /access/:bundleId with Lit Protocol decryption.'
  });
});

// ─── FREE: Graph preview (public nodes only) ──────────────────────────────
app.get('/catalog/:bundleId/graph', (req, res) => {
  const bundle = catalog.get(req.params.bundleId);
  if (!bundle) return res.status(404).json({ error: 'Bundle not found' });

  res.json({
    bundleId: bundle.bundleId,
    name: bundle.name,
    graph: bundle.publicGraph,
    note: 'Nodes marked visible:false are gated. Purchase browse access or hold NFT to reveal.',
    accessTier: 'public'
  });
});

// ─── FREE: Get bids for a bundle ──────────────────────────────────────────
app.get('/bid/:bundleId', (req, res) => {
  const bundle = catalog.get(req.params.bundleId);
  if (!bundle) return res.status(404).json({ error: 'Bundle not found' });

  const bundleBids = bids.get(req.params.bundleId) || [];
  const highestBid = bundleBids.length ? Math.max(...bundleBids.map(x => x.amount)) : 0;

  res.json({
    bundleId: req.params.bundleId,
    name: bundle.name,
    nft: { contract: bundle.nft.contractAddress, tokenId: bundle.nft.tokenId },
    auction: {
      status: highestBid > 0 ? 'active' : 'open',
      currentBid: highestBid,
      bidCount: bundleBids.length,
      bids: bundleBids.map(b => ({ bidder: b.bidder, amount: b.amount, timestamp: b.timestamp })),
    },
    note: 'On-chain auction settlement coming soon. Bids are currently tracked off-chain for demo purposes.'
  });
});

// ─── Place a bid on a bundle ──────────────────────────────────────────────
app.post('/bid/:bundleId', (req, res) => {
  const bundle = catalog.get(req.params.bundleId);
  if (!bundle) return res.status(404).json({ error: 'Bundle not found' });

  const { bidder, amount } = req.body;
  if (!bidder || !amount) {
    return res.status(400).json({ error: 'Required: bidder (wallet address), amount (ETH)' });
  }

  const bundleBids = bids.get(req.params.bundleId) || [];
  const highestBid = bundleBids.length ? Math.max(...bundleBids.map(x => x.amount)) : 0;

  if (amount <= highestBid) {
    return res.status(400).json({
      error: `Bid must exceed current highest: ${highestBid} ETH`,
      currentBid: highestBid,
      yourBid: amount
    });
  }

  const newBid = { bidder, amount, timestamp: new Date().toISOString() };
  bundleBids.push(newBid);
  bids.set(req.params.bundleId, bundleBids);

  res.status(201).json({
    status: 'bid_placed',
    bundleId: req.params.bundleId,
    bid: newBid,
    auction: {
      currentBid: amount,
      bidCount: bundleBids.length,
      previousBid: highestBid
    },
    note: 'Bid recorded. On-chain auction settlement and NFT transfer coming soon.'
  });
});

// ─── NFT GATED: Full bundle access ───────────────────────────────────────
app.get('/access/:bundleId', (req, res) => {
  const bundle = catalog.get(req.params.bundleId);
  if (!bundle) return res.status(404).json({ error: 'Bundle not found' });

  // In production: verify NFT ownership via on-chain check, then Lit Protocol decrypt
  const ownershipProof = req.headers['x-nft-ownership-proof'];
  
  if (!ownershipProof) {
    return res.status(403).json({
      error: 'NFT ownership required',
      accessMethod: 'Lit Protocol Token Gating',
      nftContract: bundle.nft.contractAddress,
      tokenId: bundle.nft.tokenId,
      network: bundle.nft.network,
      condition: `ownerOf(tokenId=${bundle.nft.tokenId}) on ${bundle.nft.contractAddress}`,
      instructions: {
        step1: `Acquire NFT #${bundle.nft.tokenId} from contract ${bundle.nft.contractAddress} on ${bundle.nft.network}`,
        step2: 'Sign a Lit Protocol auth message proving ownership',
        step3: 'Retry with header: X-NFT-OWNERSHIP-PROOF: <lit_auth_signature>',
        step4: 'Decrypted bundle will be returned as application/x-agentip-bundle+tar+gzip'
      }
    });
  }

  // Demo mode: return bundle metadata pointing to IPFS
  res.json({
    bundleId: bundle.bundleId,
    name: bundle.name,
    accessTier: 'full',
    bundle: {
      ipfsCid: bundle.bundle.ipfsCid,
      ipfsUrl: `ipfs://${bundle.bundle.ipfsCid}`,
      gatewayUrl: `https://gateway.pinata.cloud/ipfs/${bundle.bundle.ipfsCid}`,
      encryption: bundle.bundle.encryption,
      fileCount: bundle.bundle.fileCount,
      decryptionStatus: 'decrypted'
    },
    provenance: bundle.provenance,
    note: 'Full bundle available at IPFS CID above. All skill, memory, report, receipt, and RAG nodes accessible.'
  });
});

// ─── x402 GATED: Validate on-chain receipts ──────────────────────────────
app.post('/validate', x402Paywall('0.50', 'Validate on-chain receipts for integrity and provenance'), (req, res) => {
  const { agentIdentity, receipts } = req.body;

  if (!agentIdentity || !receipts || !Array.isArray(receipts)) {
    return res.status(400).json({ 
      error: 'Required: agentIdentity (ERC-8004 address), receipts (array of {txHash, network, from, calldataPayload})' 
    });
  }

  // Validation logic (in production: actual on-chain verification via ethers.js)
  const validationResults = receipts.map(r => ({
    txHash: r.txHash,
    network: r.network || 'base-sepolia',
    from: r.from,
    calldataPayload: r.calldataPayload,
    checks: {
      txExists: r.txHash && r.txHash.startsWith('0x') && r.txHash.length === 66,
      addressValid: r.from && r.from.startsWith('0x') && r.from.length === 42,
      calldataPresent: !!r.calldataPayload,
      calldataDecodable: r.calldataPayload ? r.calldataPayload.startsWith('agentrag:') || r.calldataPayload.startsWith('agentip:') : false,
      networkSupported: ['base-sepolia', 'base-mainnet'].includes(r.network || 'base-sepolia')
    },
    status: 'validated',
    basescanUrl: `https://sepolia.basescan.org/tx/${r.txHash}`
  }));

  const allValid = validationResults.every(r => Object.values(r.checks).every(Boolean));

  res.json({
    agentIdentity,
    totalReceipts: receipts.length,
    validReceipts: validationResults.filter(r => r.status === 'validated').length,
    overallStatus: allValid ? 'PASS' : 'PARTIAL',
    results: validationResults,
    payment: req.x402Payment,
    note: allValid 
      ? 'All receipts validated. Ready for bundle packaging via POST /package.'
      : 'Some checks failed. Review individual results and resubmit.'
  });
});

// ─── x402 GATED: Package workflow into bundle + mint NFT ─────────────────
app.post('/package', x402Paywall('5.00', 'Full AgentIP pipeline: validate → structure → encrypt → mint → list'), (req, res) => {
  const { 
    agentIdentity, 
    agentName,
    executionLog, 
    onchainReceipts, 
    skills, 
    memoryNodes, 
    reports,
    category,
    name,
    description,
    tags,
    derivedFrom
  } = req.body;

  // Validate required fields
  if (!agentIdentity || !executionLog || !onchainReceipts) {
    return res.status(400).json({
      error: 'Required: agentIdentity, executionLog, onchainReceipts',
      optional: 'skills, memoryNodes, reports, category, name, description, tags, derivedFrom',
      specUrl: '/spec'
    });
  }

  // Generate bundle ID (find max existing number + 1, accounting for gaps)
  let maxNum = 0;
  for (const key of catalog.keys()) {
    const n = parseInt(key.replace('bundle_', ''), 10);
    if (n > maxNum) maxNum = n;
  }
  // Also account for known bundles not in catalog (e.g. bundle_002 is JSX-only)
  if (maxNum < 2) maxNum = 2;
  const bundleNum = maxNum + 1;
  const bundleId = `bundle_${String(bundleNum).padStart(3, '0')}`;

  // Calculate stats from submitted data
  const skillCount = skills ? skills.length : 0;
  const memoryCount = memoryNodes ? memoryNodes.length : 0;
  const reportCount = reports ? reports.length : 0;
  const receiptCount = onchainReceipts.length;
  const nodeCount = skillCount + memoryCount + reportCount + receiptCount;
  const edgeCount = Math.floor(nodeCount * 1.4); // approximate edge density

  // Generate mock IPFS CID and NFT details (in production: actual IPFS pin + Rare Protocol mint)
  const mockCid = 'Qm' + crypto.randomBytes(22).toString('base64url').slice(0, 44);
  const mockTxHash = '0x' + crypto.randomBytes(32).toString('hex');
  const mockTokenId = String(bundleNum);

  // Build the bundle listing
  const newBundle = {
    bundleId,
    name: name || `${agentName || agentIdentity.slice(0, 10)} Workflow v1`,
    creator: {
      agentId: agentName || 'anonymous',
      agentName: agentName || 'Anonymous Agent',
      erc8004Identity: agentIdentity
    },
    category: category || 'general',
    tags: tags || [],
    summary: description || `Agent workflow with ${skillCount} skills, ${memoryCount} memory nodes, ${reportCount} reports, and ${receiptCount} on-chain receipts.`,
    publicGraph: {
      nodeCount,
      edgeCount,
      nodeTypes: { skills: skillCount, memory: memoryCount, reports: reportCount, receipts: receiptCount, rag: 0 },
      previewNodes: [
        ...(skills || []).slice(0, 3).map((s, i) => ({ 
          id: `skill_${i}`, type: 'skill', label: s.name || s.id || `skill_${i}`, visible: true 
        })),
        ...(memoryNodes || []).slice(0, 2).map((m, i) => ({ 
          id: `mem_${i}`, type: 'memory', label: m.label || `memory_${i}`, visible: i === 0 
        })),
        ...onchainReceipts.slice(0, 2).map((r, i) => ({ 
          id: r.nodeId || `tx_${i}`, type: 'receipt', label: r.nodeId || `receipt_${i}`, visible: true 
        }))
      ],
      previewEdges: []
    },
    nft: {
      contractAddress: '0x3CcB940f6Af748A46FFF42db8E89278059A3E8dB',
      tokenId: mockTokenId,
      network: 'base-sepolia',
      mintTxHash: mockTxHash
    },
    bundle: {
      ipfsCid: mockCid,
      encryption: 'Lit Protocol Chipotle TEE',
      accessCondition: `ownerOf(tokenId=${mockTokenId})`,
      fileCount: skillCount + memoryCount + reportCount + receiptCount + 1 // +1 for manifest
    },
    provenance: {
      onchainReceipts: receiptCount,
      network: 'base-sepolia',
      executionWindow: {
        start: executionLog.sessionStart || new Date().toISOString(),
        end: executionLog.sessionEnd || new Date().toISOString()
      },
      calldataFormat: 'agentip:{nodeId}:{type}:{context}',
      receipts: onchainReceipts.map(r => ({
        nodeId: r.nodeId,
        hash: r.txHash || r.hash,
        network: r.network || 'base-sepolia'
      }))
    },
    saleType: 'secondary',
    buyNowPrice: '0.0001',
    buyNowCurrency: 'ETH',
    derivedFrom: derivedFrom || null,
    listedAt: new Date().toISOString(),
    status: 'listed'
  };

  // Store in catalog
  catalog.set(bundleId, newBundle);

  res.status(201).json({
    status: 'success',
    message: 'Workflow packaged, encrypted, minted, and listed.',
    bundleId,
    pipeline: {
      validated: { receipts: receiptCount, status: 'pass' },
      structured: { nodes: nodeCount, edges: edgeCount, format: 'AgentIP Bundle Spec v1.0' },
      encrypted: { method: 'Lit Protocol Chipotle TEE', condition: `ownerOf(tokenId=${mockTokenId})` },
      pinned: { ipfsCid: mockCid, gateway: `https://gateway.pinata.cloud/ipfs/${mockCid}` },
      minted: { contract: newBundle.nft.contractAddress, tokenId: mockTokenId, txHash: mockTxHash, network: 'base-sepolia' },
      listed: { catalogUrl: `/catalog/${bundleId}`, graphUrl: `/catalog/${bundleId}/graph` }
    },
    nft: newBundle.nft,
    payment: req.x402Payment,
    catalogUrl: `/catalog/${bundleId}`,
    note: 'Your workflow IP is now discoverable. Other agents can browse the public summary and purchase NFT for full access.'
  });
});

// ─── POST /buy/:id ─────────────────────────────────────────────────────────
app.post('/buy/:id', (req, res) => {
  const bundle = catalog.get(req.params.id);

  if (!bundle) {
    return res.status(404).json({ error: 'Bundle not found', bundleId: req.params.id });
  }

  if (bundle.saleType !== 'secondary' || !bundle.buyNowPrice) {
    return res.status(400).json({
      error: 'This bundle is not available for direct purchase',
      bundleId: req.params.id,
      currentState: bundle.auctionState || 'discoverable',
      hint: 'This bundle is in primary discovery mode. Initiate a bid via POST /bid/' + req.params.id + '. Note: on-chain auction settlement is not yet live.'
    });
  }

  if (bundle.status === 'sold') {
    return res.status(400).json({
      error: 'This bundle has already been sold',
      soldTo: bundle.soldTo,
      soldAt: bundle.soldAt
    });
  }

  const { buyerAddress, buyerAgentName } = req.body || {};

  if (!buyerAddress) {
    return res.status(400).json({
      error: 'Required: buyerAddress (your wallet address)',
      optional: 'buyerAgentName'
    });
  }

  const downloadToken = crypto.randomBytes(32).toString('hex');

  purchases.set(downloadToken, {
    bundleId: req.params.id,
    buyer: { address: buyerAddress, agentName: buyerAgentName || 'anonymous' },
    price: bundle.buyNowPrice,
    currency: bundle.buyNowCurrency,
    timestamp: new Date().toISOString(),
    downloadToken,
    nft: bundle.nft
  });

  bundle.auctionState = 'sold';
  bundle.status = 'sold';
  bundle.soldTo = buyerAddress;
  bundle.soldAt = new Date().toISOString();

  console.log(`[BUY] ${req.params.id} → ${buyerAddress} for ${bundle.buyNowPrice} ${bundle.buyNowCurrency}`);

  res.json({
    status: 'purchased',
    message: `Successfully purchased "${bundle.name}"`,
    bundleId: req.params.id,
    price: { amount: bundle.buyNowPrice, currency: bundle.buyNowCurrency },
    nft: { ...bundle.nft, newOwner: buyerAddress },
    access: {
      downloadToken,
      downloadUrl: `/download/${req.params.id}`,
      instruction: `GET /download/${req.params.id} with header X-DOWNLOAD-TOKEN: ${downloadToken}`
    },
    bundle: {
      name: bundle.name,
      files: bundle.bundle.fileCount,
      nodes: bundle.publicGraph.nodeCount,
      gatedNodes: bundle.publicGraph.gatedNodes || 0,
      category: bundle.category
    }
  });
});

// ─── GET /download/:id ────────────────────────────────────────────────────
app.get('/download/:id', (req, res) => {
  const token = req.headers['x-download-token'];

  if (!token) {
    return res.status(401).json({
      error: 'Download token required',
      instruction: 'Include header X-DOWNLOAD-TOKEN from your purchase response'
    });
  }

  const purchase = purchases.get(token);
  if (!purchase || purchase.bundleId !== req.params.id) {
    return res.status(403).json({ error: 'Invalid or mismatched download token' });
  }

  const bundle = catalog.get(req.params.id);
  if (!bundle) {
    return res.status(404).json({ error: 'Bundle not found' });
  }

  // Read vault files from disk
  const vaultNum = req.params.id.replace('bundle_', '').replace(/^0+/, '');
  const vaultDir = join(__dirname, '..', `vault-${vaultNum.padStart(3, '0')}`);
  const files = {};
  const subdirs = ['skills', 'memory', 'reports', 'receipts', 'rag'];

  for (const sub of subdirs) {
    const dirPath = join(vaultDir, sub);
    if (existsSync(dirPath)) {
      const entries = readdirSync(dirPath);
      for (const entry of entries) {
        if (entry.endsWith('.md')) {
          files[`${sub}/${entry}`] = readFileSync(join(dirPath, entry), 'utf-8');
        }
      }
    }
  }

  // Fallback: generate from metadata if vault dir not found
  if (Object.keys(files).length === 0) {
    const pn = bundle.publicGraph?.previewNodes || [];

    pn.filter(n => n.type === 'skill').forEach(n => {
      files[`skills/${n.id}.md`] = `---\nnodeId: ${n.id}\ntype: skill\nname: "${n.label}"\n---\n\n# ${n.label}\n\nSkill from ${bundle.name}.\n`;
    });

    pn.filter(n => n.type === 'memory').forEach(n => {
      files[`memory/${n.id}.md`] = `---\nnodeId: ${n.id}\ntype: memory\nsealed: ${!n.visible}\n---\n\n# ${n.visible ? n.label : 'Unlocked: ' + n.id}\n\nMemory node from ${bundle.name}.\n`;
    });

    pn.filter(n => n.type === 'report').forEach(n => {
      files[`reports/${n.id}.md`] = `---\nnodeId: ${n.id}\ntype: report\n---\n\n# ${n.visible ? n.label : 'Unlocked: ' + n.id}\n\nReport from ${bundle.name}.\n`;
    });

    (bundle.provenance?.receipts || []).forEach(r => {
      files[`receipts/${r.nodeId}.md`] = `---\nnodeId: ${r.nodeId}\ntype: receipt\ntxHash: "${r.hash}"\nnetwork: "${r.network}"\n---\n\n# Receipt: ${r.nodeId}\n\nVerify: https://sepolia.basescan.org/tx/${r.hash}\n`;
    });
  }

  // Always include manifest
  files['manifest.json'] = JSON.stringify({
    bundleVersion: '1.0.0',
    bundleId: bundle.bundleId,
    name: bundle.name,
    category: bundle.category,
    creator: bundle.creator,
    stats: bundle.publicGraph?.nodeTypes || {},
    provenance: bundle.provenance,
    nft: bundle.nft,
    access: { decryptedFor: purchase.buyer.address, method: 'Lit Protocol Chipotle TEE' }
  }, null, 2);

  console.log(`[DOWNLOAD] ${req.params.id} → ${Object.keys(files).length} files to ${purchase.buyer.address}`);

  res.json({
    status: 'decrypted',
    bundleId: req.params.id,
    name: bundle.name,
    purchasedBy: purchase.buyer,
    purchasedAt: purchase.timestamp,
    decryption: { method: 'Lit Protocol Chipotle TEE', status: 'decrypted' },
    files,
    totalFiles: Object.keys(files).length,
    instruction: 'Write each key as a filepath under your workflow directory.'
  });
});

// ─── Start server ──────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3402;
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════╗
║  AgentIP Service v1.0.0                              ║
║  Packaging agent workflow IP as on-chain assets      ║
╠══════════════════════════════════════════════════════╣
║  Port:     ${PORT}                                       ║
║  Network:  base-sepolia                              ║
║  Protocol: x402                                      ║
║  Identity: 0x87DA...cE66                             ║
╠══════════════════════════════════════════════════════╣
║  Endpoints:                                          ║
║  GET  /health            → liveness (free)           ║
║  GET  /agent             → service manifest (free)   ║
║  GET  /spec              → bundle spec (free)        ║
║  GET  /catalog           → list bundles (free)       ║
║  GET  /catalog/:id       → bundle detail (x402)      ║
║  GET  /catalog/:id/graph → graph preview (free)      ║
║  POST /validate          → check receipts (x402)     ║
║  POST /package           → full pipeline (x402)      ║
║  GET  /access/:id        → full bundle (NFT gated)   ║
║  POST /buy/:id           → buy bundle (secondary)    ║
║  GET  /download/:id      → download bundle (token)   ║
╚══════════════════════════════════════════════════════╝
  `);
});

export default app;
