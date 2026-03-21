const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();

const handoff = JSON.parse(fs.readFileSync(path.join(__dirname, "../handoff.json")));

// Public: agent manifest
app.get("/agent", (req, res) => {
  const agent = JSON.parse(fs.readFileSync(path.join(__dirname, "../agent.json")));
  res.json(agent);
});

// Public: graph preview (topology only, no content)
app.get("/graph", (req, res) => {
  const graphPath = path.join(__dirname, "../public/rag-graph.html");
  if (fs.existsSync(graphPath)) {
    res.sendFile(graphPath);
  } else {
    res.json({ message: "Graph UI coming — drop rag-graph.html into /public" });
  }
});

// x402 protected: full RAG content
app.get("/rag", (req, res) => {
  const paymentHeader = req.headers["x-payment"] || req.headers["x402-payment"];
  if (!paymentHeader) {
    return res.status(402).json({
      error: "Payment required",
      protocol: "x402",
      network: "base-sepolia",
      amount: "0.001",
      currency: "ETH",
      payTo: handoff.agentWallet,
      description: "Access to AgentRAG full knowledge bundle",
      litCondition: `ownerOf(${handoff.nftContractAddress}, tokenId=1) == caller — OR — x402 payment`,
      graphPreview: "/graph",
      agentManifest: "/agent"
    });
  }
  res.json({
    access: "x402 payment received",
    graphTopology: { nodes: 35, edges: 47 },
    ipfsCid: handoff.ipfsCid,
    litInstruction: "Call Lit Action with your wallet to decrypt full bundle",
    agentWallet: handoff.agentWallet,
    nftContract: handoff.nftContractAddress,
    tokenId: handoff.nftTokenId
  });
});

// Health check
app.get("/health", (req, res) => res.json({ status: "ok", agent: "AgentRAG-v1", erc8004: handoff.erc8004TxHash }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`AgentRAG x402 server running on port ${PORT}`));
