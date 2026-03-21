const { ethers } = require("ethers");
const fs = require("fs");
require("dotenv").config();

const RPC = "https://sepolia.base.org";
const provider = new ethers.JsonRpcProvider(RPC);

const WALLETS = {
  main:          new ethers.Wallet(process.env.MAIN_WALLET_PRIVATE_KEY, provider),
  skillAgent:    new ethers.Wallet(process.env.SKILL_AGENT_PRIVATE_KEY, provider),
  memoryAgent:   new ethers.Wallet(process.env.MEMORY_AGENT_PRIVATE_KEY, provider),
  packagerAgent: new ethers.Wallet(process.env.PACKAGER_AGENT_PRIVATE_KEY, provider),
};

function encodeData(str) {
  return ethers.hexlify(ethers.toUtf8Bytes(str));
}

// Per-wallet nonce tracker
const nonces = {};
async function getNonce(wallet) {
  if (nonces[wallet.address] === undefined) {
    nonces[wallet.address] = await provider.getTransactionCount(wallet.address);
  }
  return nonces[wallet.address]++;
}

async function fundWorkers() {
  const amount = ethers.parseEther("0.008");
  const workers = [WALLETS.skillAgent, WALLETS.memoryAgent, WALLETS.packagerAgent];
  for (const w of workers) {
    const bal = await provider.getBalance(w.address);
    if (bal >= ethers.parseEther("0.004")) {
      console.log("Already funded", w.address, "— skipping");
      continue;
    }
    const tx = await WALLETS.main.sendTransaction({ to: w.address, value: amount, nonce: await getNonce(WALLETS.main) });
    await tx.wait();
    console.log("Funded", w.address, "→", tx.hash);
  }
}

async function anchorHash(wallet, nodeId, content) {
  const data = encodeData(`agentrag:${nodeId}:${content}`);
  const tx = await wallet.sendTransaction({ to: wallet.address, value: 0n, data, nonce: await getNonce(wallet) });
  await tx.wait();
  console.log(`Anchored ${nodeId} → ${tx.hash}`);
  return { nodeId, hash: tx.hash, block: tx.blockNumber?.toString(), from: wallet.address };
}

async function main() {
  const handoff = JSON.parse(fs.readFileSync("handoff.json"));
  const agentLog = JSON.parse(fs.readFileSync("agent_log.json"));
  const log = [];

  console.log("Funding worker wallets...");
  await fundWorkers();

  // SkillAgent transactions
  log.push(await anchorHash(WALLETS.skillAgent, "tx_scan1",     "skill:scan_base_chain:invoked:aerodrome:base_tvl"));
  log.push(await anchorHash(WALLETS.skillAgent, "tx_scan2",     "skill:scan_base_chain:result:hash:sha256"));
  log.push(await anchorHash(WALLETS.skillAgent, "tx_token_sig", "skill:token_signal_detector:brett:degen:toshi"));

  // MemoryAgent transactions
  log.push(await anchorHash(WALLETS.memoryAgent, "tx_mem1",   "memory:aerodrome_tvl:base_tvl:logged"));
  log.push(await anchorHash(WALLETS.memoryAgent, "tx_mem2",   "memory:whale_map:wash_trading:rug_signals:logged"));
  log.push(await anchorHash(WALLETS.memoryAgent, "tx_report", "skill:generate_report:base_defi_intelligence:v1"));

  // PackagerAgent transaction
  log.push(await anchorHash(WALLETS.packagerAgent, "tx_rag_anchor", "rag:bundle:hash:sha256:encrypted:lit_chipotle"));

  // Update handoff.json
  handoff.transactions = log;
  handoff.lastCompletedStep = 3;
  handoff.completedSteps.push("swarm_transactions");
  fs.writeFileSync("handoff.json", JSON.stringify(handoff, null, 2));

  // Append to agent_log.json
  log.forEach((entry, i) => {
    agentLog.entries.push({
      step: 2 + i,
      phase: "execute",
      timestamp: new Date().toISOString(),
      action: `Anchored ${entry.nodeId} on Base Sepolia`,
      tool: "ethers.js + Base Sepolia",
      result: "success",
      txHash: entry.hash,
      from: entry.from,
      nodeId: entry.nodeId
    });
  });
  fs.writeFileSync("agent_log.json", JSON.stringify(agentLog, null, 2));

  console.log("\nAll swarm transactions complete.");
}

main().catch(console.error);
