// scripts/deploy-lit-action.js
// Pins lit-action.js to IPFS via Lit's IPFS node
// Outputs the CID to store in agent.json under litActionIpfsCid
//
// Usage: node scripts/deploy-lit-action.js

import { create } from "ipfs-http-client";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const LIT_IPFS_API = "https://ipfs.litprotocol.com";

async function deployLitAction() {
  console.log("── Deploying Lit Action to IPFS ─────────────────────────");

  const code = readFileSync(
    path.join(__dirname, "../src/lit-action.js"),
    "utf-8"
  );
  console.log(`  Code size: ${code.length} bytes`);

  // Pin to Lit's IPFS node
  const client = create({ url: LIT_IPFS_API });
  const result = await client.add(code, { pin: true });
  const cid = result.cid.toString();

  console.log(`\n✅ Lit Action pinned`);
  console.log(`   CID:      ${cid}`);
  console.log(`   IPFS URL: ipfs://${cid}`);
  console.log(`   Gateway:  https://ipfs.io/ipfs/${cid}`);
  console.log(`\n  → Add to agent.json: "litActionIpfsCid": "${cid}"`);
  console.log(`  → Add to handoff.json: "litActionCid": "${cid}"`);

  // Also output the access control condition template
  const acc = {
    conditionType: "evmBasic",
    contractAddress: "0x3CcB940f6Af748A46FFF42db8E89278059A3E8dB",
    standardContractType: "ERC721",
    chain: "baseSepolia",
    method: "ownerOf",
    parameters: ["1"],
    returnValueTest: {
      comparator: "=",
      value: ":userAddress"
    }
  };

  console.log(`\n  Access Control Condition (for jsParams):`);
  console.log(JSON.stringify(acc, null, 2));

  return cid;
}

deployLitAction().catch(console.error);
