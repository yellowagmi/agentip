const { ethers } = require("ethers");
require("dotenv").config();

async function generateWallets() {
  const main = ethers.Wallet.createRandom();
  const skillAgent = ethers.Wallet.createRandom();
  const memoryAgent = ethers.Wallet.createRandom();
  const packagerAgent = ethers.Wallet.createRandom();

  console.log("MAIN_WALLET_ADDRESS=" + main.address);
  console.log("MAIN_WALLET_PRIVATE_KEY=" + main.privateKey);
  console.log("SKILL_AGENT_ADDRESS=" + skillAgent.address);
  console.log("SKILL_AGENT_PRIVATE_KEY=" + skillAgent.privateKey);
  console.log("MEMORY_AGENT_ADDRESS=" + memoryAgent.address);
  console.log("MEMORY_AGENT_PRIVATE_KEY=" + memoryAgent.privateKey);
  console.log("PACKAGER_AGENT_ADDRESS=" + packagerAgent.address);
  console.log("PACKAGER_AGENT_PRIVATE_KEY=" + packagerAgent.privateKey);
}

generateWallets();
