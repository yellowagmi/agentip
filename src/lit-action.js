// ─────────────────────────────────────────────────────────────────────────────
// lit-action.js — AgentRAG Dark Knowledge Skill
// Executed inside Lit Protocol Chipotle TEE
//
// Access condition: caller must hold ERC-721 token #1
// Contract: 0x3CcB940f6Af748A46FFF42db8E89278059A3E8dB (Base Sepolia)
//
// Flow:
//   1. Resolve caller address from authSig
//   2. Call ownerOf(1) on the NFT contract via Base Sepolia RPC
//   3. If caller == owner → decrypt and return full RAG bundle
//   4. If caller != owner → return access denied + public graph URL
//
// Deploy:   ipfs pin this file → get CID → store CID in agent.json
// Invoke:   lit-sdk executeJs({ ipfsId: <CID>, jsParams: { ... } })
// ─────────────────────────────────────────────────────────────────────────────

const go = async () => {

  // ── Constants ────────────────────────────────────────────────────────────────
  const NFT_CONTRACT  = "0x3CcB940f6Af748A46FFF42db8E89278059A3E8dB";
  const TOKEN_ID      = "1";
  const NETWORK       = "baseSepolia";
  const RPC_URL       = "https://sepolia.base.org";
  const IPFS_CID      = "QmfUafj31oGNwEmZaaWgs7CwwxC392f32mJp3FeE4gunYy";
  const PUBLIC_GRAPH  = "https://agentrag.xyz/graph";  // update to real host before submission
  const AGENT_ID      = "AgentRAG-v1 / yellowagent";

  // ownerOf(uint256) ABI — minimal fragment
  const OWNER_OF_ABI = [
    {
      "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
      "name": "ownerOf",
      "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  // ── 1. Resolve caller address from authSig ───────────────────────────────────
  let callerAddress;
  try {
    callerAddress = ethers.utils.getAddress(
      LitActions.getAddress ? LitActions.getAddress() : jsParams.callerAddress
    );
  } catch (e) {
    LitActions.setResponse({
      response: JSON.stringify({
        access: "denied",
        reason: "Could not resolve caller address from authSig",
        agentId: AGENT_ID,
        publicGraph: PUBLIC_GRAPH,
        timestamp: Date.now()
      })
    });
    return;
  }

  // ── 2. Call ownerOf(1) on Base Sepolia ───────────────────────────────────────
  let nftOwner;
  try {
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
    const nft = new ethers.Contract(NFT_CONTRACT, OWNER_OF_ABI, provider);
    nftOwner = await nft.ownerOf(TOKEN_ID);
  } catch (e) {
    LitActions.setResponse({
      response: JSON.stringify({
        access: "denied",
        reason: "Failed to call ownerOf — contract may not be deployed or RPC unavailable",
        contract: NFT_CONTRACT,
        tokenId: TOKEN_ID,
        network: NETWORK,
        error: e.message,
        agentId: AGENT_ID,
        timestamp: Date.now()
      })
    });
    return;
  }

  // ── 3. Access check ──────────────────────────────────────────────────────────
  const callerNormalised = callerAddress.toLowerCase();
  const ownerNormalised  = nftOwner.toLowerCase();

  if (callerNormalised !== ownerNormalised) {
    LitActions.setResponse({
      response: JSON.stringify({
        access: "denied",
        reason: "Caller does not hold ERC-721 token #1",
        caller:  callerAddress,
        owner:   nftOwner,
        contract: NFT_CONTRACT,
        tokenId: TOKEN_ID,
        network: NETWORK,
        publicGraph: PUBLIC_GRAPH,
        hint: "Purchase or transfer token #1 to your wallet to unlock full RAG bundle",
        agentId: AGENT_ID,
        timestamp: Date.now()
      })
    });
    return;
  }

  // ── 4. Access granted — decrypt and return RAG bundle ────────────────────────
  let decryptedBundle;
  try {
    decryptedBundle = await Lit.Actions.decryptAndCombine({
      accessControlConditions: jsParams.accessControlConditions,
      ciphertext:              jsParams.ciphertext,
      dataToEncryptHash:       jsParams.dataToEncryptHash,
      authSig:                 jsParams.authSig,
      chain:                   NETWORK
    });
  } catch (e) {
    // Decryption failure — still confirm access was granted, surface the error
    LitActions.setResponse({
      response: JSON.stringify({
        access: "granted",
        owner:  callerAddress,
        decryption: "failed",
        error:  e.message,
        hint:   "Access condition verified. Re-invoke with valid ciphertext and dataToEncryptHash.",
        ipfsCid: IPFS_CID,
        agentId: AGENT_ID,
        timestamp: Date.now()
      })
    });
    return;
  }

  // ── 5. Return full bundle ─────────────────────────────────────────────────────
  LitActions.setResponse({
    response: JSON.stringify({
      access:   "granted",
      owner:    callerAddress,
      agentId:  AGENT_ID,
      network:  NETWORK,
      contract: NFT_CONTRACT,
      tokenId:  TOKEN_ID,
      ipfsCid:  IPFS_CID,
      ragBundle: JSON.parse(decryptedBundle),
      unlockedAt: Date.now()
    })
  });

};

go();
