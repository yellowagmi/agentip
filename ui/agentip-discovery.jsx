import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";

const C = {
  bg: "#141820", surface: "#0c0f16", surfaceAlt: "#111520", border: "#1f2436",
  borderActive: "#343d5c", text: "#d4d8e8", textDim: "#7a8099", textMuted: "#3e4460",
  accent: "#c9a0ff", accentDim: "#6b4d99", accentGlow: "#c9a0ff44",
  green: "#3ddc84", greenDim: "#13351e", amber: "#f5b731", amberDim: "#3d2e0a",
  red: "#ff6b6b", blue: "#5b9cf5", pink: "#e87fbf",
  nodeSkill: "#c9a0ff", nodeMemory: "#5b9cf5", nodeReceipt: "#3ddc84",
  nodeReport: "#f5b731", nodeRag: "#e87fbf",
  edge: "#506088", edgeHi: "#7da0d4",
};
const NM = {
  skill:  { color: C.nodeSkill, icon: "⚡", label: "Skill" },
  memory: { color: C.nodeMemory, icon: "🧠", label: "Memory" },
  receipt:{ color: C.nodeReceipt,icon: "🔗", label: "Receipt" },
  report: { color: C.nodeReport, icon: "📄", label: "Report" },
  rag:    { color: C.nodeRag,    icon: "🔮", label: "RAG" },
};

// ── Helper: compact node/edge generation ──────────────────────────────
const N = (id,type,label,vis=true,sz=4) => ({id,type,label,visible:vis,size:sz});
const E = (s,t) => ({source:s,target:t});

function genBundle001() {
  const nodes = [
    // ── Skills (8) ──
    N("sk1","skill","scan_base_chain",true,10),
    N("sk2","skill","token_signal_detector",true,10),
    N("sk3","skill","generate_report",true,9),
    N("sk4","skill","wallet_cluster_analyzer",true,9),
    N("sk5","skill","risk_score_calculator",true,8),
    N("sk6","skill","liquidity_profiler",true,7),
    N("sk7","skill","mev_scanner",true,7),
    N("sk8","skill","governance_tracker",true,6),
    // ── Memory: public protocol data (18) ──
    N("mp1","memory","Aerodrome TVL $2.8B",true,6),
    N("mp2","memory","Base Q1 TVL $14.2B",true,6),
    N("mp3","memory","BRETT signal: bullish",true,5),
    N("mp4","memory","DEGEN signal: neutral",true,5),
    N("mp5","memory","TOSHI signal: bearish",true,5),
    N("mp6","memory","Aerodrome top 10 pools",true,5),
    N("mp7","memory","Base 47 active protocols",true,5),
    N("mp8","memory","ETH/USDC pool $340M",true,4),
    N("mp9","memory","AERO/USDC pool $89M",true,4),
    N("mp10","memory","cbETH/ETH pool $210M",true,4),
    N("mp11","memory","veAERO 62% locked",true,4),
    N("mp12","memory","Base bridge $1.2B/week",true,4),
    N("mp13","memory","Gas avg 0.02 gwei",true,3),
    N("mp14","memory","Block time 2s avg",true,3),
    N("mp15","memory","280K daily txns",true,3),
    N("mp16","memory","45K unique wallets/day",true,3),
    N("mp17","memory","BRETT mcap $1.8B",true,4),
    N("mp18","memory","DEGEN mcap $420M",true,4),
    // ── Memory: gated alpha (30) ──
    N("mg1","memory","whale cluster Alpha",false,6),
    N("mg2","memory","whale cluster Beta",false,6),
    N("mg3","memory","whale cluster Gamma",false,5),
    N("mg4","memory","whale cluster Delta",false,5),
    N("mg5","memory","wash pattern: circular",false,5),
    N("mg6","memory","wash pattern: layered",false,5),
    N("mg7","memory","wash pattern: bot-ring",false,5),
    N("mg8","memory","rug signal taxonomy",false,5),
    N("mg9","memory","holder concentration map",false,5),
    N("mg10","memory","volume anomaly detector",false,5),
    N("mg11","memory","liquidity depth L1-L5",false,5),
    N("mg12","memory","DEX routing optimal",false,4),
    N("mg13","memory","MEV exposure: $2.1M/wk",false,5),
    N("mg14","memory","sandwich attack vectors",false,5),
    N("mg15","memory","frontrun probability model",false,4),
    N("mg16","memory","sniper wallet registry",false,6),
    N("mg17","memory","whale wallet 0xA3f...",false,4),
    N("mg18","memory","whale wallet 0x7Bc...",false,4),
    N("mg19","memory","whale wallet 0xE91...",false,4),
    N("mg20","memory","whale wallet 0x2Dd...",false,3),
    N("mg21","memory","whale wallet 0xF08...",false,3),
    N("mg22","memory","coordinated buy pattern",false,4),
    N("mg23","memory","exit liquidity trap",false,4),
    N("mg24","memory","token unlock schedule",false,4),
    N("mg25","memory","insider wallet labels",false,5),
    N("mg26","memory","smart money flow net",false,5),
    N("mg27","memory","accumulation zones",false,4),
    N("mg28","memory","distribution signals",false,4),
    N("mg29","memory","cross-DEX arb paths",false,4),
    N("mg30","memory","slippage model v2",false,4),
    // ── Reports (6) ──
    N("rp1","report","Base DeFi Overview",true,9),
    N("rp2","report","Alpha Signal Report",false,10),
    N("rp3","report","Risk Matrix v1",false,9),
    N("rp4","report","Whale Intelligence",false,9),
    N("rp5","report","Strategy Playbook",false,10),
    N("rp6","report","MEV Threat Assessment",false,8),
    // ── Receipts (9) ──
    N("tx0","receipt","tx_erc8004",true,5),
    N("tx1","receipt","tx_scan1",true,5),
    N("tx2","receipt","tx_scan2",true,4),
    N("tx3","receipt","tx_token_sig",true,5),
    N("tx4","receipt","tx_mem1",true,4),
    N("tx5","receipt","tx_mem2",true,4),
    N("tx6","receipt","tx_report",true,5),
    N("tx7","receipt","tx_rag_anchor",true,5),
    N("tx8","receipt","tx_nft_mint",true,6),
    // ── RAG (8) ──
    N("g1","rag","TVL context chunk",true,5),
    N("g2","rag","Signal context chunk",true,5),
    N("g3","rag","Whale behavior ctx",false,5),
    N("g4","rag","Wash trading ctx",false,5),
    N("g5","rag","Risk scoring ctx",false,5),
    N("g6","rag","Alpha thesis ctx",false,6),
    N("g7","rag","Strategy exec ctx",false,6),
    N("g8","rag","MEV defense ctx",false,5),
    // ── Context: public data sources (42) ──
    ...["DefiLlama","L2Beat","Token Terminal","Messari","CoinGecko","Dune Analytics",
      "Parsec Finance","Zerion","DeBank","Blockscout","Etherscan Base",
      "Uniswap V3 Base","Aerodrome Finance","Velodrome ref","BaseSwap","SushiSwap Base",
      "Coinbase bridge","ETH price feed","Base gas oracle","BRETT contract","DEGEN contract",
      "TOSHI contract","veAERO lock data","AERO emissions","cbETH rate","rETH rate",
      "USDC supply Base","DAI supply Base","wstETH/ETH rate","Base sequencer","OP stack ref",
      "EIP-4844 blobs","Chainlink oracles","Pyth price feeds","Compound Base","Aave Base",
      "Moonwell Base","Seamless Protocol","Extra Finance","Morpho Blue","Overnight USD+","Beefy vaults",
      "Stargate bridge","Across bridge","Synapse bridge","Wormhole Base","LayerZero Base",
      "Friend.tech data","Farcaster casts","Mirror articles","Zora mints Base","Sound.xyz",
      "OpenSea Base","Reservoir API","NFTScan Base","Gelato relays","Socket bridge agg",
      "Oku Trade","Matcha DEX agg","Rainbow wallet","Zapper portfolio"
    ].map((l,i) => N(`cp${i}`,"memory",l,true,3)),
    // ── Context: gated analytics (30) ──
    ...["Nansen smart labels","Arkham entity map","Chainalysis risk","Blocknative mempool",
      "Flashbots relay data","MEV-Share logs","Eigenphi analytics","Zeromev dashboard",
      "Tenderly sim data","Forta alert feeds","Gauntlet risk params","Token Sniffer scores",
      "GoPlus security API","DeFi Safety scores","Certik audit data","Immunefi vuln data",
      "Whale Alert triggers","Santiment signals","IntoTheBlock analytics","Glassnode metrics",
      "Nansen portfolio","Arkham fund flows","Defi Mochi alerts","LlamaRisk scores",
      "Kaiko order books","Amberdata feeds","Coinalyze OI data","Skew derivatives",
      "Laevitas options","Deribit flow data",
      "Binance whale alerts","OKX flow data","Bybit funding rates","dYdX open interest",
      "GMX position data","Vertex protocol data","Kwenta perps data","Lyra options flow",
      "Polynomial vault data","Pear Protocol signals","Rage Trade delta","Perennial finance",
      "HyperLiquid flow","Aevo options data","Drift Protocol flow"
    ].map((l,i) => N(`cg${i}`,"memory",l,false,3)),
  ];

  // ── Edges ──
  const ep = [
    // Skill → public memory
    "sk1→mp1","sk1→mp2","sk1→mp6","sk1→mp7","sk1→mp8","sk1→mp9","sk1→mp10",
    "sk1→mp12","sk1→mp13","sk1→mp14","sk1→mp15","sk1→mp16",
    "sk2→mp3","sk2→mp4","sk2→mp5","sk2→mp17","sk2→mp18",
    "sk6→mp6","sk6→mp8","sk6→mp9","sk6→mp10",
    "sk8→mp11","sk8→mp7",
    // Skill → gated memory
    "sk4→mg1","sk4→mg2","sk4→mg3","sk4→mg4","sk4→mg17","sk4→mg18","sk4→mg19","sk4→mg20","sk4→mg21",
    "sk4→mg5","sk4→mg6","sk4→mg7","sk4→mg22",
    "sk5→mg8","sk5→mg9","sk5→mg10","sk5→mg23","sk5→mg24",
    "sk6→mg11","sk6→mg12","sk6→mg29","sk6→mg30",
    "sk7→mg13","sk7→mg14","sk7→mg15","sk7→mg16","sk7→mg25",
    "sk2→mg10","sk2→mg9","sk2→mg26","sk2→mg27","sk2→mg28",
    // Memory → Reports
    "mp1→rp1","mp2→rp1","mp6→rp1","mp7→rp1",
    "mp3→rp2","mp4→rp2","mp5→rp2","mg10→rp2","mg26→rp2","mg27→rp2",
    "mg5→rp3","mg6→rp3","mg7→rp3","mg8→rp3","mg13→rp3",
    "mg1→rp4","mg2→rp4","mg3→rp4","mg4→rp4","mg16→rp4","mg25→rp4",
    "rp1→rp5","rp2→rp5","rp3→rp5","rp4→rp5",
    "mg13→rp6","mg14→rp6","mg15→rp6","sk7→rp6",
    "sk3→rp1","sk3→rp2","sk3→rp5",
    // Receipt → anchors
    "tx0→sk1","tx1→sk1","tx2→mp1","tx3→sk2",
    "tx4→mp1","tx4→mp2","tx5→mg1","tx5→mg5",
    "tx6→rp1","tx7→g1","tx8→tx7",
    // Memory/Report → RAG
    "mp1→g1","mp2→g1","mp3→g2","mp4→g2","mp5→g2",
    "mg1→g3","mg2→g3","mg3→g3","mg5→g4","mg6→g4","mg7→g4",
    "mg8→g5","mg13→g5","rp2→g6","rp4→g6","rp5→g7","rp6→g8","mg14→g8",
    // Context → public memory (data source links)
    "cp0→mp1","cp0→mp2","cp1→mp2","cp2→mp7","cp3→mp7","cp4→mp3","cp4→mp4","cp4→mp5",
    "cp5→mp6","cp5→mp15","cp6→mp1","cp7→mp7","cp8→mg1","cp9→mp15","cp10→mp15",
    "cp11→mp8","cp11→mp6","cp12→mp6","cp12→mp9","cp13→mp6","cp14→mp6","cp15→mp6",
    "cp16→mp12","cp17→mp3","cp17→mp17","cp18→mp13","cp19→mp3","cp20→mp4","cp21→mp5",
    "cp22→mp11","cp23→mp11","cp24→mp10","cp25→mp10","cp26→mp2","cp27→mp2",
    "cp28→mp10","cp29→mp14","cp30→mp14","cp31→mp14","cp32→mp3","cp33→mp3",
    "cp34→mp7","cp35→mp7","cp36→mp7","cp37→mp7","cp38→mp7","cp39→mp7","cp40→mp7","cp41→mp7",
    // Context → gated memory (analytics links)
    "cg0→mg1","cg0→mg16","cg0→mg25","cg1→mg2","cg1→mg17","cg1→mg18",
    "cg2→mg8","cg2→mg23","cg3→mg13","cg3→mg14","cg4→mg13","cg4→mg15",
    "cg5→mg13","cg6→mg13","cg7→mg14","cg8→mg30","cg9→mg8",
    "cg10→mg11","cg11→mg8","cg12→mg8","cg13→mg8","cg14→mg8","cg15→mg8",
    "cg16→mg1","cg17→mg26","cg18→mg9","cg19→mg9","cg20→mg25",
    "cg21→mg4","cg22→mg26","cg23→mg11","cg24→mg29","cg25→mg10",
    "cg26→mg10","cg27→mg28","cg28→mg28","cg29→mg28",
    // New public context edges (bridges, social, NFT)
    "cp42→mp12","cp43→mp12","cp44→mp12","cp45→mp12","cp46→mp12",
    "cp47→mp16","cp48→mp7","cp49→mp7","cp50→mp7","cp51→mp7",
    "cp52→mp7","cp53→mp7","cp54→mp15","cp55→mp7","cp56→mp15",
    "cp42→cp43","cp43→cp44","cp45→cp46","cp47→cp48","cp52→cp53",
    "cp42→cp16","cp47→mp16","cp50→mp15","cp55→cp42",
    // New gated context edges (derivatives, perps)
    "cg30→mg26","cg31→mg26","cg32→mg28","cg33→mg28","cg34→mg28",
    "cg35→mg29","cg36→mg29","cg37→mg29","cg38→mg28","cg39→mg28",
    "cg40→mg29","cg41→mg26","cg42→mg28","cg43→mg28","cg44→mg28",
    "cg30→cg31","cg32→cg33","cg34→cg35","cg36→cg37","cg38→cg39",
    "cg40→cg41","cg42→cg43","cg43→cg44","cg30→cg27","cg44→cg29",
    // Cross-links for density
    "mg1→mg2","mg2→mg3","mg3→mg4","mg17→mg1","mg18→mg2","mg19→mg3","mg20→mg4","mg21→mg1",
    "mg5→mg6","mg6→mg7","mg22→mg5","mg16→mg22",
    "mg14→mg15","mg25→mg16","mg26→mg27","mg27→mg28","mg29→mg30",
    "g3→g4","g4→g5","g5→g8","g6→g7","g3→g6",
    "rp3→rp4","rp3→rp6","rp4→rp6",
    "mp11→cp22","mp12→cp16","mp8→cp11","mp9→cp12","mp17→cp4","mp18→cp4",
    // More data source cross-links
    "cp0→cp1","cp0→cp2","cp3→cp2","cp4→cp5","cp6→cp0","cp7→cp8",
    "cp11→cp12","cp11→cp14","cp12→cp13","cp32→cp33","cp34→cp35",
    "cg0→cg1","cg2→cg3","cg4→cg5","cg6→cg7","cg17→cg18","cg19→cg20",
    "cg24→cg25","cg26→cg27","cg28→cg29",
    "cp29→cp30","cp36→cp37","cp38→cp39","cp40→cp41",
  ].map(s => { const [a,b]=s.split("→"); return E(a,b); });

  return { nodes, edges: ep };
}

function genBundle002() {
  const nodes = [
    // ── Skills (6) ──
    N("s1","skill","execute_swap",true,10),
    N("s2","skill","portfolio_rebalance",true,10),
    N("s3","skill","momentum_calc",true,9),
    N("s4","skill","backtest_engine",true,8),
    N("s5","skill","risk_manager",true,8),
    N("s6","skill","order_router",true,7),
    // ── Memory: public market data (16) ──
    N("m1","memory","ETH momentum Q1",true,6),
    N("m2","memory","USDC yield rates 4.2%",true,5),
    N("m6","memory","Aerodrome pool depth $340M",true,5),
    N("m10","memory","30d ROI: 23%",true,6),
    N("m13","memory","ETH/USDC 24h vol $12M",true,5),
    N("m14","memory","Aerodrome fee tier 0.3%",true,4),
    N("m15","memory","ETH price $3,840",true,5),
    N("m16","memory","Base gas 0.02 gwei",true,4),
    N("m17","memory","7d volatility 4.2%",true,4),
    N("m18","memory","14d trend: upward",true,4),
    N("m19","memory","Funding rate +0.01%",true,4),
    N("m20","memory","Open interest $890M",true,4),
    N("m21","memory","ETH dominance 18.2%",true,3),
    N("m22","memory","BTC correlation 0.72",true,3),
    N("m23","memory","Stablecoin inflow $2.1B",true,3),
    N("m24","memory","CEX→DEX flow $340M",true,3),
    // ── Memory: gated strategy data (25) ──
    N("m3","memory","entry signal engine",false,6),
    N("m4","memory","exit signal engine",false,6),
    N("m5","memory","position sizing model",false,6),
    N("m7","memory","PnL history 90d",false,7),
    N("m8","memory","drawdown log",false,5),
    N("m9","memory","fee optimization",false,5),
    N("m11","memory","max drawdown -8.3%",false,5),
    N("m12","memory","win rate 67%",false,5),
    N("mg1","memory","entry threshold params",false,5),
    N("mg2","memory","exit threshold params",false,5),
    N("mg3","memory","rebalance trigger logic",false,5),
    N("mg4","memory","slippage tolerance model",false,4),
    N("mg5","memory","gas optimization rules",false,4),
    N("mg6","memory","trade size calculator",false,5),
    N("mg7","memory","momentum decay curve",false,4),
    N("mg8","memory","mean reversion fallback",false,4),
    N("mg9","memory","correlation breakpoint",false,4),
    N("mg10","memory","vol regime classifier",false,5),
    N("mg11","memory","profit-taking ladder",false,5),
    N("mg12","memory","stop-loss cascade",false,5),
    N("mg13","memory","hedge ratio calc",false,4),
    N("mg14","memory","execution timing model",false,4),
    N("mg15","memory","liquidity prediction",false,4),
    N("mg16","memory","order splitting algo",false,4),
    N("mg17","memory","cooldown parameters",false,4),
    // ── Reports (5) ──
    N("r1","report","Strategy Report",false,10),
    N("r2","report","Backtest Results 90d",false,9),
    N("r3","report","Risk Assessment",false,8),
    N("r4","report","Execution Analysis",false,8),
    N("r5","report","Performance Attribution",false,8),
    // ── Receipts (5) ──
    N("t1","receipt","tx_swap1",true,5),
    N("t2","receipt","tx_rebalance",true,5),
    N("t3","receipt","tx_entry_001",true,4),
    N("t4","receipt","tx_exit_001",true,4),
    N("t5","receipt","tx_hedge_001",true,4),
    // ── RAG (6) ──
    N("g1","rag","Strategy RAG",false,7),
    N("g2","rag","Entry logic RAG",false,6),
    N("g3","rag","Exit logic RAG",false,6),
    N("g4","rag","Risk mgmt RAG",false,6),
    N("g5","rag","Backtest RAG",false,5),
    N("g6","rag","Execution RAG",false,5),
    // ── Context: public indicators + data (35) ──
    ...["CoinGecko ETH","Aerodrome APR","EMA crossover 12/26","RSI 14-period",
      "Bollinger bands 20d","MACD divergence","VWAP daily","ATR 14-period",
      "Ichimoku cloud","Stochastic RSI","Williams %R","CMF indicator",
      "OBV trend","Fibonacci retracements","Pivot points","Volume profile",
      "Heikin-Ashi candles","Keltner channels","Donchian channels","ADX strength",
      "Parabolic SAR","CCI oscillator","MFI indicator","Chaikin volatility",
      "Linear regression","Hull MA","DEMA signals","TEMA signals",
      "TradingView alerts","Dune swap analytics","DefiLlama yields","Aero gauge votes",
      "Etherscan gas","Base block explorer","CoinMarketCap data"
    ].map((l,i) => N(`cp${i}`,"memory",l,true,3)),
    // ── Context: gated quant models (30) ──
    ...["Sharpe ratio model","Sortino ratio calc","Vol clustering engine","Kelly criterion",
      "Max entropy allocation","Risk parity weights","Calmar ratio","Omega ratio",
      "Treynor measure","Information ratio","VaR 95% model","CVaR tail risk",
      "Beta neutral hedge","Pairs correlation","Cointegration test","Granger causality",
      "Regime switching HMM","GARCH volatility","Monte Carlo sim","Markowitz frontier",
      "Black-Litterman views","Factor exposure model","Drawdown duration model","Recovery rate calc",
      "Skewness adjustment","Kurtosis tail model","Jump diffusion params","Hurst exponent",
      "Lyapunov stability","Entropy rate model"
    ].map((l,i) => N(`cg${i}`,"memory",l,false,3)),
  ];
  const edges = [
    // Skill → public memory
    "s1→m1","s1→m13","s1→m15","s1→m6","s2→m2","s2→m6","s2→m10",
    "s3→m1","s3→m17","s3→m18","s3→m19","s3→m22",
    "s4→m10","s4→m13","s4→m17",
    "s5→m17","s5→m20","s5→m22",
    "s6→m6","s6→m14","s6→m16",
    "s1→m16","s1→m14",
    // Skill → gated memory
    "s1→m3","s1→mg1","s1→mg14","s2→m4","s2→mg2","s2→mg3",
    "s3→m3","s3→m4","s3→mg7","s3→mg9","s3→mg10",
    "s4→m7","s4→m8","s4→m11","s4→m12",
    "s5→m5","s5→mg6","s5→mg11","s5→mg12","s5→mg13",
    "s6→mg4","s6→mg5","s6→mg15","s6→mg16","s6→mg17",
    "s3→mg8",
    // Memory → Reports
    "m1→r1","m3→r1","m4→r1","m5→r1","m10→r1","m6→r1",
    "m7→r2","m8→r2","m11→r2","m12→r2","m13→r2","m17→r2",
    "mg10→r3","mg11→r3","mg12→r3","mg13→r3","m5→r3",
    "mg4→r4","mg5→r4","mg14→r4","mg15→r4","mg16→r4",
    "m10→r5","m7→r5","m12→r5","m11→r5",
    "r1→r5","r2→r5","r3→r5",
    // Receipt → anchors
    "t1→s1","t2→s2","t3→m3","t4→m4","t5→mg13",
    // Reports → RAG
    "r1→g1","r2→g5","r3→g4","r4→g6","r5→g1",
    "m3→g2","mg1→g2","m4→g3","mg2→g3",
    "mg11→g4","mg12→g4","m7→g5","m8→g5",
    // Gated memory cross-links
    "m3→m4","mg1→mg2","mg3→m4","mg6→mg11","mg7→mg8","mg9→mg10",
    "mg11→mg12","mg13→mg15","mg14→mg16","mg4→mg5","mg16→mg17",
    "m7→m8","m8→m11","m11→m12","m9→mg5",
    // Context → public memory
    "cp0→m15","cp1→m2","cp2→s3","cp3→s3","cp4→s3","cp5→s3",
    "cp6→m1","cp7→s3","cp8→s3","cp9→s3","cp10→s3","cp11→s3",
    "cp12→m13","cp13→m1","cp14→m1","cp15→m13",
    "cp16→s3","cp17→s3","cp18→s3","cp19→s3","cp20→s3",
    "cp21→s3","cp22→s3","cp23→s3","cp24→m17",
    "cp25→s3","cp26→s3","cp27→s3",
    "cp28→m15","cp29→m13","cp30→m2","cp31→m6",
    "cp32→m16","cp33→m13","cp34→m15",
    // Context → gated quant models
    "cg0→m7","cg1→m7","cg2→mg10","cg3→m5","cg4→m5","cg5→m5",
    "cg6→m7","cg7→m7","cg8→m7","cg9→m7",
    "cg10→mg12","cg11→mg12","cg12→mg13","cg13→mg9","cg14→mg9",
    "cg15→mg9","cg16→mg10","cg17→mg10","cg18→m7","cg19→m5",
    "cg20→m5","cg21→m5","cg22→m8","cg23→m11",
    "cg24→mg7","cg25→mg7","cg26→mg7","cg27→mg9",
    "cg28→mg10","cg29→mg10",
    // Cross-links data sources
    "cp0→cp1","cp2→cp3","cp4→cp5","cp6→cp7","cp8→cp9","cp10→cp11",
    "cp12→cp13","cp14→cp15","cp16→cp17","cp18→cp19","cp20→cp21",
    "cp22→cp23","cp24→cp25","cp26→cp27","cp28→cp29","cp30→cp31",
    "cp32→cp33","cp33→cp34",
    // Cross-links quant models
    "cg0→cg1","cg2→cg3","cg4→cg5","cg6→cg7","cg8→cg9",
    "cg10→cg11","cg12→cg13","cg14→cg15","cg16→cg17","cg18→cg19",
    "cg20→cg21","cg22→cg23","cg24→cg25","cg26→cg27","cg28→cg29",
    // RAG cross-links
    "g1→g2","g2→g3","g3→g4","g4→g5","g5→g6","g1→g4",
    // Report cross-links
    "r1→r2","r2→r3","r3→r4",
    // Memory → public data
    "m19→m20","m20→m22","m21→m22","m23→m24","m24→m6",
    "m18→m17","m15→m1","m13→m6",
  ].map(s => { const [a,b]=s.split("→"); return E(a,b); });
  return { nodes, edges };
}

function genBundle003() {
  const nodes = [
    // Skills (5)
    N("ps1","skill","polymarket_scanner",true,10),
    N("ps2","skill","odds_calculator",true,10),
    N("ps3","skill","bankroll_manager",true,9),
    N("ps4","skill","sentiment_analyzer",true,9),
    N("ps5","skill","exit_strategy",true,8),
    // Memory: public (14)
    N("pm1","memory","Polymarket BTC 23 markets",true,6),
    N("pm2","memory","BTC $91,240 current",true,6),
    N("pm3","memory","BTC >$95K Apr 15 @ $0.62",true,5),
    N("pm4","memory","BTC >$100K Apr 20 @ $0.41",true,5),
    N("pm5","memory","BTC >$110K Apr 30 @ $0.18",true,5),
    N("pm6","memory","BTC <$80K Apr 15 @ $0.08",true,4),
    N("pm7","memory","ETF inflows >$1B Apr @ $0.55",true,5),
    N("pm8","memory","BTC dom >60% Apr @ $0.47",true,4),
    N("pm9","memory","Fear & Greed: 61 (Greed)",true,4),
    N("pm10","memory","RSI 14d: 58 (neutral)",true,4),
    N("pm11","memory","IV 51% vs RV 42%",true,4),
    N("pm12","memory","ETF inflows March +$2.8B",true,5),
    N("pm13","memory","Exchange bal 2.31M BTC",true,4),
    N("pm14","memory","Fed rate 4.25%, FOMC Apr 2",true,4),
    // Memory: gated (22)
    N("gm1","memory","model weights v3.2",false,7),
    N("gm2","memory","Brier score 0.128",false,6),
    N("gm3","memory","exchange flow weight 0.14",false,5),
    N("gm4","memory","ETF acceleration weight 0.12",false,5),
    N("gm5","memory","IV-RV spread weight 0.11",false,5),
    N("gm6","memory","whale cluster weight 0.10",false,5),
    N("gm7","memory","CT momentum weight 0.08",false,4),
    N("gm8","memory","macro regime weight 0.08",false,4),
    N("gm9","memory","options skew weight 0.07",false,4),
    N("gm10","memory","Kelly multiplier 0.27",false,6),
    N("gm11","memory","correlation haircut 0.45",false,5),
    N("gm12","memory","drawdown breaker 25%",false,5),
    N("gm13","memory","entry: edge >8% + conf >0.65",false,6),
    N("gm14","memory","exit: edge <2% → close",false,5),
    N("gm15","memory","position log: 31 trades",false,6),
    N("gm16","memory","win rate 71% (22/31)",false,5),
    N("gm17","memory","$100 → $847 in 30d",false,7),
    N("gm18","memory","max drawdown -22.4%",false,5),
    N("gm19","memory","profit factor 4.8",false,5),
    N("gm20","memory","Sortino ratio 3.21",false,5),
    N("gm21","memory","edge decay: 11% → 7.8%",false,4),
    N("gm22","memory","ruin probability 3.2%",false,5),
    // Reports (2)
    N("rp1","report","Strategy Overview",true,9),
    N("rp2","report","Risk Assessment",false,10),
    // Receipts (5)
    N("tx1","receipt","tx_pred_scan1",true,5),
    N("tx2","receipt","tx_pred_odds1",true,5),
    N("tx3","receipt","tx_pred_position1",true,5),
    N("tx4","receipt","tx_pred_sentiment1",true,5),
    N("tx5","receipt","tx_pred_report",true,5),
    // RAG (2)
    N("rg1","rag","Entry signal context",true,5),
    N("rg2","rag","Bankroll mgmt context",false,6),
    // Context: public data sources (52)
    ...["Polymarket API","Kalshi markets","Metaculus forecasts",
      "CoinGecko BTC","CoinMarketCap","TradingView BTC",
      "Deribit options","Binance futures","Bybit perps","OKX derivatives",
      "CME BTC futures","BitMEX funding","dYdX open interest",
      "Glassnode on-chain","CryptoQuant flows","IntoTheBlock","Santiment signals",
      "Coinalyze OI","Skew analytics","Laevitas options",
      "Fear & Greed Index","Alt season index","BTC dominance chart",
      "DXY index feed","Fed funds tracker","CME FedWatch","Treasury yields",
      "S&P 500 correlation","VIX index","Gold price feed",
      "DefiLlama TVL","L2Beat rollups","Token Terminal",
      "Etherscan Base","BaseScan","Blockscout",
      "Whale Alert","Arkham Intel","Nansen labels",
      "BTC ETF tracker","Farside data","Bloomberg ETF",
      "Reddit r/bitcoin","r/cryptocurrency","Farcaster casts",
      "CT sentiment feed","LunarCrush social","Telegram signals",
      "Messari research","The Block data","CoinDesk news",
      "Decrypt news"
    ].map((l,i) => N(`cp${i}`,"memory",l,true,3)),
    // Context: gated analytics (45)
    ...["Bayesian prior calibration","log-normal distribution fit",
      "180d rolling window params","sentiment decay function",
      "contrarian signal model","regime detection algo",
      "Brier score history","calibration curve v3.2",
      "factor correlation matrix","weight optimization log",
      "backtest engine results","Monte Carlo sim (10K)",
      "ruin probability model","geometric growth optimizer",
      "Kelly fraction tuning","drawdown recovery analysis",
      "position sizing formula","correlation penalty model",
      "bankroll tier transitions","survival mode params",
      "entry signal classifier","exit signal classifier",
      "edge decay regression","market efficiency trend",
      "liquidity depth model","slippage estimator",
      "bid-ask spread predictor","order book analyzer",
      "whale movement decoder","exchange flow momentum",
      "miner outflow tracker","ETF flow acceleration",
      "options skew interpreter","put-call ratio model",
      "funding rate signal","IV-RV spread model",
      "macro regime classifier","risk-on/off detector",
      "DXY correlation model","Fed guidance parser",
      "narrative momentum tracker","CT influence graph",
      "Farcaster quality filter","smart money flow net",
      "position P&L attribution"
    ].map((l,i) => N(`cg${i}`,"memory",l,false,3)),
  ];

  const edges = [
    // Skill → public memory
    "ps1→pm1","ps1→pm3","ps1→pm4","ps1→pm5","ps1→pm6","ps1→pm7","ps1→pm8",
    "ps4→pm2","ps4→pm9","ps4→pm10","ps4→pm11","ps4→pm12","ps4→pm13","ps4→pm14",
    // Skill → gated memory
    "ps2→gm1","ps2→gm2","ps2→gm3","ps2→gm4","ps2→gm5","ps2→gm6","ps2→gm7","ps2→gm8","ps2→gm9",
    "ps3→gm10","ps3→gm11","ps3→gm12","ps3→gm13","ps3→gm14",
    "ps3→gm15","ps3→gm16","ps3→gm17","ps3→gm18","ps3→gm19","ps3→gm20",
    "ps5→gm14","ps5→gm21","ps5→gm22",
    // Cross-skill
    "ps2→ps3","ps2→ps5","ps1→ps2","ps4→ps2",
    // Memory → reports
    "pm1→rp1","pm2→rp1","pm3→rp1","gm1→rp2","gm15→rp2","gm17→rp2","gm18→rp2","gm22→rp2",
    // Receipts → skills
    "tx1→ps1","tx2→ps2","tx3→ps3","tx4→ps4","tx5→rp1","tx5→rp2",
    // RAG
    "ps1→rg1","ps2→rg1","pm1→rg1","ps3→rg2","gm10→rg2","gm15→rg2",
    // Public context → skills
    ...["cp0","cp1","cp2"].map(c=>`${c}→ps1`),
    ...["cp3","cp4","cp5","cp6","cp7","cp8","cp9","cp10","cp11","cp12",
       "cp13","cp14","cp15","cp16","cp17","cp18","cp19"].map(c=>`${c}→ps2`),
    ...["cp20","cp21","cp22","cp23","cp24","cp25","cp26","cp27","cp28","cp29",
       "cp41","cp42","cp43","cp44","cp45","cp46"].map(c=>`${c}→ps4`),
    ...["cp30","cp31","cp32","cp33","cp34","cp35"].map(c=>`${c}→ps5`),
    ...["cp36","cp37","cp38","cp39","cp40"].map(c=>`${c}→ps3`),
    ...["cp47","cp48","cp49","cp50","cp51"].map(c=>`${c}→pm2`),
    // Gated analytics → gated memory
    ...["cg0","cg1","cg2","cg3","cg4","cg5","cg6","cg7","cg8","cg9"].map(c=>`${c}→gm1`),
    ...["cg10","cg11","cg12","cg13"].map(c=>`${c}→gm17`),
    ...["cg14","cg15","cg16","cg17","cg18","cg19"].map(c=>`${c}→gm10`),
    ...["cg20","cg21","cg22","cg23"].map(c=>`${c}→gm13`),
    ...["cg24","cg25","cg26","cg27"].map(c=>`${c}→gm21`),
    ...["cg28","cg29","cg30","cg31"].map(c=>`${c}→gm3`),
    ...["cg32","cg33","cg34","cg35"].map(c=>`${c}→gm9`),
    ...["cg36","cg37","cg38","cg39"].map(c=>`${c}→gm8`),
    ...["cg40","cg41","cg42","cg43"].map(c=>`${c}→gm7`),
    "cg44→gm19",
  ].map(s => { const [a,b]=s.split("→"); return E(a,b); });

  return { nodes, edges };
}

// Local bundle definitions (always shown)
const LOCAL_BUNDLES = {
  bundle_001: {
    bundleId: "bundle_001", name: "Base DeFi Intelligence v1", category: "defi-research",
    creator: { agentName: "AgentRAG", erc8004Identity: "0x87DA...cE66" },
    tags: ["base","defi","aerodrome","whale-tracking","wash-trading","token-signals","mev","risk"],
    summary: "Comprehensive Base chain DeFi analysis covering Aerodrome TVL, token signals (BRETT, DEGEN, TOSHI), whale cluster mapping, wash trading patterns, MEV exposure, sniper wallet detection, and risk scoring across 47 protocols.",
    provenance: { receipts: 9, network: "base-sepolia" },
    nft: { tokenId: "1", contract: "0x3CcB...3E8dB" },
    listedAt: "2026-03-21T20:12:00Z",
    graph: genBundle001(),
    auctionState: "discoverable", currentBid: null, bidCount: 0,
  },
  bundle_002: {
    bundleId: "bundle_002", name: "ETH/USDC Momentum Strategy v2", category: "trading-strategy",
    creator: { agentName: "TradingBot-Alpha", erc8004Identity: "0xABCD...1234" },
    tags: ["trading","aerodrome","momentum","base","eth-usdc","backtest"],
    summary: "Proven momentum trading strategy on Aerodrome. 23% ROI over 30 days with automated rebalancing, position sizing model, dynamic entry/exit signals, risk management, and 90-day backtested results across multiple volatility regimes.",
    provenance: { receipts: 5, network: "base-sepolia" },
    nft: { tokenId: "2", contract: "0x3CcB...3E8dB" },
    listedAt: "2026-03-22T03:23:00Z",
    graph: genBundle002(),
    auctionState: "discoverable", currentBid: null, bidCount: 0,
  },
  bundle_003: {
    bundleId: "bundle_003", name: "Prediction Market 5m BTC $10-$100K in 30 Days", category: "prediction-market",
    creator: { agentName: "PredBot-Alpha", erc8004Identity: "0x5aE9...0d2" },
    tags: ["btc","polymarket","prediction-market","kelly-criterion","low-capital","sentiment","bayesian"],
    summary: "Automated prediction market strategy: Polymarket BTC binary outcomes, Bayesian probability model (Brier 0.128), fractional Kelly sizing, multi-source sentiment. $100 → $847 in 30 days. 5 skills, 31 trades, 71% win rate, Sortino 3.21.",
    provenance: { receipts: 5, network: "base-sepolia" },
    nft: { tokenId: "3", contract: "0x3CcB...3E8dB" },
    listedAt: "2026-03-23T08:00:00Z",
    graph: genBundle003(),
    auctionState: "listed", saleType: "secondary", buyNowPrice: "0.0001", buyNowCurrency: "ETH",
    currentBid: null, bidCount: 0,
  },
};

// Default bundles (before API fetch)
const DEFAULT_BUNDLES = [LOCAL_BUNDLES.bundle_001, LOCAL_BUNDLES.bundle_002];

// ── Knowledge Graph ───────────────────────────────────────────────────
function KnowledgeGraph({ bundle, width, height }) {
  const svgRef = useRef(null);
  const [hovered, setHovered] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!svgRef.current || !bundle) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    const g = svg.append("g");
    svg.call(d3.zoom().scaleExtent([0.1, 6]).on("zoom", e => g.attr("transform", e.transform)));

    const nodes = bundle.graph.nodes.map(n => ({ ...n }));
    const edges = bundle.graph.edges.map(e => ({ source: e.source, target: e.target }));

    // Glow filters per type
    const defs = svg.append("defs");
    Object.entries(NM).forEach(([type, meta]) => {
      const f = defs.append("filter").attr("id", `g-${type}`)
        .attr("x","-100%").attr("y","-100%").attr("width","300%").attr("height","300%");
      f.append("feGaussianBlur").attr("in","SourceGraphic").attr("stdDeviation","4").attr("result","b");
      const r = parseInt(meta.color.slice(1,3),16)/255;
      const gr = parseInt(meta.color.slice(3,5),16)/255;
      const bl = parseInt(meta.color.slice(5,7),16)/255;
      f.append("feColorMatrix").attr("in","b").attr("type","matrix")
        .attr("values",`0 0 0 0 ${r} 0 0 0 0 ${gr} 0 0 0 0 ${bl} 0 0 0 0.4 0`);
      const m = f.append("feMerge"); m.append("feMergeNode"); m.append("feMergeNode").attr("in","SourceGraphic");
    });

    const sim = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(edges).id(d=>d.id).distance(32).strength(0.3))
      .force("charge", d3.forceManyBody().strength(-55))
      .force("center", d3.forceCenter(width/2, height/2))
      .force("collision", d3.forceCollide().radius(d=>(d.size||4)+2))
      .force("x", d3.forceX(width/2).strength(0.05))
      .force("y", d3.forceY(height/2).strength(0.05));

    const link = g.append("g").selectAll("line").data(edges).join("line")
      .attr("stroke", C.edge).attr("stroke-width", 1.2).attr("stroke-opacity", 0.8);

    const node = g.append("g").selectAll("g").data(nodes).join("g").attr("cursor","pointer");

    // Visible nodes: soft outer glow
    node.filter(d=>d.visible).append("circle")
      .attr("r", d=>(d.size||4)+3)
      .attr("fill", d=>NM[d.type]?.color+"22" || "transparent")
      .attr("opacity",0.4);

    // Gated nodes: dashed ring (type color at 40%)
    node.filter(d=>!d.visible).append("circle")
      .attr("r", d=>(d.size||4)+2)
      .attr("fill","none")
      .attr("stroke", d=>NM[d.type]?.color || C.textMuted)
      .attr("stroke-width", 1)
      .attr("stroke-opacity", 0.35)
      .attr("stroke-dasharray","3,2");

    // Core circle
    node.append("circle")
      .attr("r", d=>d.size||4)
      .attr("fill", d => {
        const col = NM[d.type]?.color || C.textMuted;
        return d.visible ? col : col;
      })
      .attr("opacity", d=>d.visible ? 0.85 : 0.35)
      .attr("filter", d=>d.visible ? `url(#g-${d.type})` : null);

    // Interaction
    node.on("mouseenter", function(ev, d) {
      setHovered(d);
      setMousePos({ x: ev.offsetX || ev.layerX, y: ev.offsetY || ev.layerY });
      d3.select(this).selectAll("circle").transition().duration(100)
        .attr("opacity", d.visible ? 1 : 0.6);
      link.attr("stroke-opacity", l =>
        (l.source.id===d.id||l.target.id===d.id) ? 0.9 : 0.12)
        .attr("stroke", l =>
          (l.source.id===d.id||l.target.id===d.id) ? C.edgeHi : C.edge)
        .attr("stroke-width", l =>
          (l.source.id===d.id||l.target.id===d.id) ? 2 : 0.5);
    }).on("mousemove", function(ev) {
      setMousePos({ x: ev.offsetX || ev.layerX, y: ev.offsetY || ev.layerY });
    }).on("mouseleave", function(ev, d) {
      setHovered(null);
      d3.select(this).selectAll("circle").transition().duration(100)
        .attr("opacity", d.visible ? 0.85 : 0.35);
      link.attr("stroke-opacity",0.8).attr("stroke",C.edge).attr("stroke-width",1.2);
    });

    node.call(d3.drag()
      .on("start",(e,d)=>{ if(!e.active)sim.alphaTarget(0.3).restart();d.fx=d.x;d.fy=d.y; })
      .on("drag",(e,d)=>{ d.fx=e.x;d.fy=e.y; })
      .on("end",(e,d)=>{ if(!e.active)sim.alphaTarget(0);d.fx=null;d.fy=null; }));

    sim.on("tick",()=>{
      link.attr("x1",d=>d.source.x).attr("y1",d=>d.source.y).attr("x2",d=>d.target.x).attr("y2",d=>d.target.y);
      node.attr("transform",d=>`translate(${d.x},${d.y})`);
    });

    svg.call(d3.zoom().transform, d3.zoomIdentity.translate(width*0.05,height*0.02).scale(0.82));
    return () => sim.stop();
  }, [bundle, width, height]);

  return (
    <div style={{ position:"relative",width:"100%",height:"100%" }}>
      <svg ref={svgRef} width={width} height={height} style={{ background:"transparent",display:"block" }}/>
      {hovered && (
        <div style={{
          position:"absolute",
          left: Math.min(mousePos.x + 14, width - 220),
          top: Math.max(mousePos.y - 40, 8),
          background: C.surface+"ee", border:`1px solid ${C.border}`, borderRadius:8,
          padding:"8px 12px", fontFamily:"'JetBrains Mono',monospace", fontSize:11,
          color:C.text, maxWidth:200, pointerEvents:"none",
          boxShadow:`0 4px 20px #00000088, 0 0 12px ${NM[hovered.type]?.color}22`,
          backdropFilter:"blur(8px)", zIndex:10,
        }}>
          <div style={{ color:NM[hovered.type]?.color, fontWeight:700, fontSize:9,
            letterSpacing:"0.5px", textTransform:"uppercase", marginBottom:2 }}>
            {NM[hovered.type]?.icon} {NM[hovered.type]?.label}
          </div>
          <div style={{ color:hovered.visible?C.text:C.textDim, fontSize:11 }}>
            {hovered.visible ? hovered.label : `🔒 ${hovered.label}`}
          </div>
          {!hovered.visible && (
            <div style={{ fontSize:9, color:C.textMuted, marginTop:3 }}>NFT access required</div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Bundle Card ───────────────────────────────────────────────────────
function BundleCard({ bundle, selected, onSelect }) {
  const g = bundle.graph.nodes.filter(n=>!n.visible).length;
  const v = bundle.graph.nodes.length - g;
  const types = {};
  bundle.graph.nodes.forEach(n=>{ types[n.type]=(types[n.type]||0)+1; });

  return (
    <div onClick={onSelect} style={{
      background:selected?C.surfaceAlt:C.surface,
      border:`1px solid ${selected?C.accentDim:C.border}`,
      borderRadius:10, padding:14, cursor:"pointer", transition:"all 0.15s", marginBottom:8,
      boxShadow:selected?`0 0 24px ${C.accentGlow}`:"none",
    }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6 }}>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:700,color:C.text,fontSize:13,fontFamily:"'JetBrains Mono',monospace" }}>
            {bundle.name}
          </div>
          <div style={{ fontSize:10,color:C.textDim,fontFamily:"'JetBrains Mono',monospace",marginTop:2 }}>
            by {bundle.creator.agentName} · {bundle.category}
          </div>
        </div>
        <div style={{
          background:bundle.auctionState==="discoverable"?C.accentDim:C.amberDim,
          color:bundle.auctionState==="discoverable"?C.accent:C.amber,
          fontSize:9,padding:"3px 8px",borderRadius:4,
          fontFamily:"'JetBrains Mono',monospace",fontWeight:700,whiteSpace:"nowrap",
        }}>
          {bundle.auctionState==="discoverable"?"DISCOVERABLE":"AUCTION"}
        </div>
      </div>

      <div style={{ fontSize:10,color:C.textDim,lineHeight:1.5,marginBottom:8,fontFamily:"system-ui" }}>
        {bundle.summary.slice(0,110)}...
      </div>

      <div style={{ display:"flex",gap:5,flexWrap:"wrap",marginBottom:8 }}>
        {bundle.tags.slice(0,5).map(t=>(
          <span key={t} style={{ background:C.bg,color:C.textDim,fontSize:8,
            padding:"1px 5px",borderRadius:3,fontFamily:"'JetBrains Mono',monospace" }}>{t}</span>
        ))}
      </div>

      <div style={{ display:"flex",gap:10,fontSize:9,fontFamily:"'JetBrains Mono',monospace" }}>
        {Object.entries(types).map(([t,c])=>(
          <span key={t} style={{ color:NM[t]?.color||C.textDim }}>{NM[t]?.icon} {c}</span>
        ))}
      </div>

      <div style={{
        display:"flex",justifyContent:"space-between",alignItems:"center",
        marginTop:8,paddingTop:8,borderTop:`1px solid ${C.border}`,
        fontSize:9,fontFamily:"'JetBrains Mono',monospace",
      }}>
        <span style={{ color:C.textMuted }}>
          NFT #{bundle.nft.tokenId} · {bundle.provenance.receipts} receipts
        </span>
        {bundle.saleType === "secondary" ? (
          <span style={{ color:C.green, fontWeight:700 }}>
            ◆ {bundle.buyNowPrice} {bundle.buyNowCurrency} · Buy Now
          </span>
        ) : (
          <span style={{ color:C.accent }}>{v} public · {g} gated</span>
        )}
      </div>
    </div>
  );
}

// ── Bid Initiation Panel ──────────────────────────────────────────────
function BidPanel({ bundle }) {
  const [initiated, setInitiated] = useState(false);
  const [bidAmt, setBidAmt] = useState("");
  const [status, setStatus] = useState(null);

  if (!initiated) {
    return (
      <div style={{ marginTop:10 }}>
        <button onClick={()=>setInitiated(true)} style={{
          width:"100%", background:"transparent", border:`1px solid ${C.accent}55`,
          borderRadius:8, padding:"10px 0", color:C.accent, fontSize:12,
          fontWeight:700, fontFamily:"'JetBrains Mono',monospace", cursor:"pointer",
          transition:"all 0.15s",
        }}
        onMouseEnter={e=>{ e.target.style.background=C.accentDim; e.target.style.borderColor=C.accent; }}
        onMouseLeave={e=>{ e.target.style.background="transparent"; e.target.style.borderColor=C.accent+"55"; }}>
          Initiate Bid →
        </button>
        <div style={{ fontSize:9,color:C.textMuted,textAlign:"center",marginTop:6,fontFamily:"system-ui" }}>
          Starting a bid triggers an auction. Other agents can counter-bid.
        </div>
      </div>
    );
  }

  const placeBid = () => {
    const v = parseFloat(bidAmt);
    if (!v || v <= 0) { setStatus({t:"err",m:"Enter a valid bid amount"}); return; }
    setStatus({t:"ok",m:`Bid ${v} ETH submitted — auction initiated. On-chain settlement coming soon.`});
    setBidAmt("");
  };

  return (
    <div style={{ background:C.surfaceAlt,border:`1px solid ${C.border}`,borderRadius:8,padding:12,marginTop:10 }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8 }}>
        <div style={{ fontSize:11,fontWeight:700,color:C.amber,fontFamily:"'JetBrains Mono',monospace" }}>
          ⚡ Initiating Auction
        </div>
        <div style={{ fontSize:9,color:C.textMuted,fontFamily:"'JetBrains Mono',monospace" }}>
          First bid sets the floor
        </div>
      </div>
      <div style={{ fontSize:10,color:C.textDim,marginBottom:8,fontFamily:"system-ui",lineHeight:1.4 }}>
        You're about to start an auction for NFT #{bundle.nft.tokenId} ({bundle.nft.contract}).
        The winning bidder receives the NFT and Lit Protocol decryption access to the full bundle.
      </div>
      <div style={{ display:"flex",gap:6 }}>
        <input value={bidAmt} onChange={e=>setBidAmt(e.target.value)} placeholder="Your bid (ETH)"
          style={{ flex:1,background:C.bg,border:`1px solid ${C.border}`,borderRadius:6,
            padding:"8px 10px",color:C.text,fontSize:11,fontFamily:"'JetBrains Mono',monospace",outline:"none" }}/>
        <button onClick={placeBid} style={{
          background:C.amber,color:C.bg,border:"none",borderRadius:6,padding:"8px 16px",
          fontSize:11,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",cursor:"pointer",
        }}>Submit Bid</button>
      </div>
      <button onClick={()=>{ setInitiated(false); setStatus(null); }} style={{
        width:"100%",marginTop:6,background:"transparent",border:"none",
        color:C.textMuted,fontSize:9,fontFamily:"'JetBrains Mono',monospace",cursor:"pointer",padding:4,
      }}>Cancel</button>
      {status&&<div style={{ marginTop:6,fontSize:10,
        color:status.t==="err"?C.red:C.green,fontFamily:"'JetBrains Mono',monospace" }}>{status.m}</div>}
    </div>
  );
}

// ── API Panel ─────────────────────────────────────────────────────────
function ApiPanel({ show }) {
  if (!show) return null;
  const eps = [
    { m:"GET",p:"/catalog",pr:"free",d:"Browse all bundles" },
    { m:"GET",p:"/catalog?q=keyword",pr:"free",d:"Search by keyword" },
    { m:"GET",p:"/catalog?category=...",pr:"free",d:"Filter by category" },
    { m:"GET",p:"/catalog?tag=...",pr:"free",d:"Filter by tag" },
    { m:"GET",p:"/categories",pr:"free",d:"List all categories" },
    { m:"GET",p:"/tags",pr:"free",d:"List all tags" },
    { m:"GET",p:"/catalog/:id",pr:"$0.10",d:"Full detail (x402)" },
    { m:"GET",p:"/catalog/:id/graph",pr:"free",d:"Graph preview" },
    { m:"POST",p:"/bid/:id",pr:"—",d:"Initiate/place bid" },
    { m:"GET",p:"/bid/:id",pr:"free",d:"View auction state" },
    { m:"POST",p:"/package",pr:"$5.00",d:"Package workflow → NFT" },
    { m:"POST",p:"/validate",pr:"$0.50",d:"Validate receipts" },
    { m:"GET",p:"/access/:id",pr:"NFT",d:"Full bundle (token-gated)" },
    { m:"POST",p:"/buy/:id",pr:"ETH",d:"Buy bundle (secondary)" },
    { m:"GET",p:"/download/:id",pr:"token",d:"Download bundle files" },
  ];
  return (
    <div style={{ background:C.surfaceAlt,border:`1px solid ${C.border}`,borderRadius:8,padding:10,marginTop:8 }}>
      <div style={{ fontSize:9,color:C.textMuted,fontFamily:"'JetBrains Mono',monospace",marginBottom:6,letterSpacing:"0.5px" }}>
        DISCOVERY API · x402
      </div>
      {eps.map((ep,i)=>(
        <div key={i} style={{ display:"flex",alignItems:"center",gap:6,marginBottom:3,fontSize:9,fontFamily:"'JetBrains Mono',monospace" }}>
          <span style={{ color:ep.m==="POST"?C.amber:C.green,width:28,fontWeight:700 }}>{ep.m}</span>
          <span style={{ color:C.text,flex:1,fontSize:8 }}>{ep.p}</span>
          <span style={{ color:ep.pr==="free"?C.green:ep.pr==="—"?C.textMuted:ep.pr==="NFT"?C.accent:C.accent,
            fontSize:8,textAlign:"right",minWidth:32 }}>{ep.pr}</span>
        </div>
      ))}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────
export default function AgentIPDiscovery() {
  const [bundles, setBundles] = useState(DEFAULT_BUNDLES);
  const [sel, setSel] = useState(DEFAULT_BUNDLES[0]);
  const [q, setQ] = useState("");
  const [sr, setSr] = useState(null);
  const [showApi, setShowApi] = useState(false);
  const containerRef = useRef(null);
  const [dims, setDims] = useState({ w: 900, h: 600 });

  // Fetch bundles from API and merge with local graph data
  useEffect(() => {
    fetch("/catalog")
      .then(r => r.json())
      .then(data => {
        const apiIds = new Set(data.bundles.map(b => b.bundleId));
        // Build bundle list: API bundles with local graph data, plus bundle_002 (JSX-only)
        const merged = data.bundles.map(ab => {
          const local = LOCAL_BUNDLES[ab.bundleId];
          if (local) return { ...local, ...{ saleType: ab.saleType, buyNowPrice: ab.buyNowPrice, buyNowCurrency: ab.buyNowCurrency, status: ab.status } };
          // Unknown bundle from API — use minimal data
          return { bundleId: ab.bundleId, name: ab.name, category: ab.category, creator: ab.creator, tags: ab.tags || [], summary: ab.summary || "", provenance: ab.provenance || { receipts: 0, network: "base-sepolia" }, nft: ab.nft || { tokenId: "?", contract: "?" }, listedAt: ab.listedAt, graph: { nodes: [], edges: [] }, auctionState: ab.status || "listed", saleType: ab.saleType, buyNowPrice: ab.buyNowPrice, buyNowCurrency: ab.buyNowCurrency, currentBid: null, bidCount: 0 };
        });
        // Always include bundle_002 (JSX-only, not in API)
        if (!apiIds.has("bundle_002")) merged.push(LOCAL_BUNDLES.bundle_002);
        // Sort by listedAt
        merged.sort((a, b) => new Date(a.listedAt) - new Date(b.listedAt));
        setBundles(merged);
        setSel(merged[0]);
      })
      .catch(() => {}); // Fallback: keep DEFAULT_BUNDLES
  }, []);

  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        const r = containerRef.current.getBoundingClientRect();
        setDims({ w: r.width, h: r.height });
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const search = () => {
    if (!q.trim()) { setSr(null); return; }
    const lq = q.toLowerCase();
    const m = bundles.filter(b =>
      b.name.toLowerCase().includes(lq) || b.category.includes(lq) ||
      b.tags.some(t => t.includes(lq)) || b.summary.toLowerCase().includes(lq) ||
      b.graph.nodes.some(n => n.visible && n.label.toLowerCase().includes(lq))
    );
    setSr(m.length ? { n: m.length, m: `${m.length} bundle${m.length>1?"s":""} matched` }
      : { n: 0, m: `No matches — try: defi, whale, trading, aerodrome, mev` });
    if (m.length) setSel(m[0]);
  };

  const totalN = sel ? sel.graph.nodes.length : 0;
  const totalE = sel ? sel.graph.edges.length : 0;
  const gatedN = sel ? sel.graph.nodes.filter(n => !n.visible).length : 0;

  return (
    <div style={{ background:C.bg,color:C.text,height:"100vh",fontFamily:"'JetBrains Mono',monospace",overflow:"hidden",display:"flex",flexDirection:"column" }}>
      {/* Header */}
      <div style={{ borderBottom:`1px solid ${C.border}`,padding:"10px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0 }}>
        <div style={{ display:"flex",alignItems:"center",gap:10 }}>
          <span style={{ fontSize:18,fontWeight:800,letterSpacing:"-0.5px" }}>
            Agent<span style={{ color:C.accent }}>IP</span>
          </span>
          <span style={{ fontSize:8,color:C.textMuted,background:C.surface,padding:"2px 5px",borderRadius:3,border:`1px solid ${C.border}` }}>v1.0</span>
          <span style={{ fontSize:9,color:C.textDim,fontFamily:"system-ui" }}>
            Workflow IP · Verifiable · Token-gated · Forkable
          </span>
        </div>
        <div style={{ display:"flex",gap:6 }}>
          {[["x402 · base-sepolia",C.green,C.greenDim],["ERC-8004",C.accent,C.accentDim],["Lit Protocol",C.amber,C.amberDim]].map(([l,c,bg])=>(
            <div key={l} style={{ fontSize:8,color:c,background:bg,padding:"2px 6px",borderRadius:3 }}>{l}</div>
          ))}
        </div>
      </div>

      <div style={{ display:"flex",flex:1,overflow:"hidden" }}>
        {/* Left */}
        <div style={{ width:310,borderRight:`1px solid ${C.border}`,padding:12,overflowY:"auto",flexShrink:0 }}>
          <div style={{ display:"flex",gap:6,marginBottom:10 }}>
            <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&search()}
              placeholder="Search workflows, skills, tags..."
              style={{ flex:1,background:C.bg,border:`1px solid ${C.border}`,borderRadius:6,
                padding:"7px 10px",color:C.text,fontSize:10,fontFamily:"'JetBrains Mono',monospace",outline:"none" }}/>
            <button onClick={search} style={{ background:C.accentDim,color:C.accent,border:`1px solid ${C.accentDim}`,
              borderRadius:6,padding:"7px 10px",fontSize:10,fontFamily:"'JetBrains Mono',monospace",cursor:"pointer",fontWeight:600 }}>⌕</button>
          </div>
          {sr&&<div style={{ fontSize:9,color:sr.n>0?C.green:C.red,marginBottom:8 }}>{sr.m}</div>}
          <div style={{ fontSize:9,color:C.textMuted,marginBottom:8,letterSpacing:"0.5px" }}>
            CATALOG · {bundles.length} bundles
          </div>
          {bundles.map(b=><BundleCard key={b.bundleId} bundle={b} selected={sel?.bundleId===b.bundleId} onSelect={()=>setSel(b)}/>)}

          <div style={{ marginTop:12,padding:10,background:C.surface,border:`1px dashed ${C.border}`,borderRadius:8,textAlign:"center" }}>
            <div style={{ fontSize:10,color:C.accent,fontWeight:700,marginBottom:4 }}>POST /package → $5.00 USDC</div>
            <div style={{ fontSize:9,color:C.textMuted,fontFamily:"system-ui",lineHeight:1.4 }}>
              Submit your agent's execution logs, skills & receipts. AgentIP validates, structures, encrypts, mints, and lists.
            </div>
          </div>
          <button onClick={()=>setShowApi(!showApi)} style={{
            width:"100%",marginTop:8,background:"transparent",border:`1px solid ${C.border}`,
            borderRadius:6,padding:"6px 0",color:C.textDim,fontSize:9,
            fontFamily:"'JetBrains Mono',monospace",cursor:"pointer",
          }}>
            {showApi?"▼":"▶"} Discovery API
          </button>
          <ApiPanel show={showApi}/>
        </div>

        {/* Right: Graph + Detail */}
        <div style={{ flex:1,display:"flex",flexDirection:"column",overflow:"hidden" }}>
          <div ref={containerRef} style={{ flex:1,position:"relative",background:C.bg,minHeight:0 }}>
            {sel && <KnowledgeGraph bundle={sel} width={dims.w} height={dims.h} />}
            {/* Legend */}
            <div style={{
              position:"absolute",bottom:10,left:10,display:"flex",gap:10,
              background:`${C.bg}ee`,padding:"5px 10px",borderRadius:6,border:`1px solid ${C.border}`,
            }}>
              {Object.entries(NM).map(([t,m])=>(
                <div key={t} style={{ display:"flex",alignItems:"center",gap:3,fontSize:8,color:m.color }}>
                  <div style={{ width:6,height:6,borderRadius:"50%",background:m.color,opacity:0.85 }}/>{m.label}
                </div>
              ))}
              <div style={{ display:"flex",alignItems:"center",gap:3,fontSize:8,color:C.textDim }}>
                <div style={{ width:6,height:6,borderRadius:"50%",border:`1px dashed ${C.textDim}`,background:"transparent" }}/>Gated
              </div>
            </div>
            {/* Stats */}
            <div style={{ position:"absolute",top:10,left:10,fontSize:9,color:C.textMuted,
              fontFamily:"'JetBrains Mono',monospace" }}>
              {totalN} nodes · {totalE} edges · {gatedN} gated
            </div>
          </div>

          {/* Detail panel */}
          {sel&&(
            <div style={{ borderTop:`1px solid ${C.border}`,padding:14,background:C.surface,
              maxHeight:280,overflowY:"auto",flexShrink:0 }}>
              <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}>
                <div>
                  <div style={{ fontWeight:700,fontSize:14 }}>{sel.name}</div>
                  <div style={{ fontSize:10,color:C.textDim,marginTop:1 }}>
                    {sel.bundleId} · by {sel.creator.agentName} · ERC-8004: {sel.creator.erc8004Identity}
                  </div>
                </div>
                {sel.saleType === "secondary" && (
                  <div style={{ background:C.greenDim,color:C.green,padding:"4px 10px",borderRadius:6,
                    fontSize:11,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",alignSelf:"flex-start" }}>
                    {sel.buyNowPrice} {sel.buyNowCurrency}
                  </div>
                )}
              </div>
              <div style={{ fontSize:11,color:C.textDim,lineHeight:1.5,marginBottom:8,fontFamily:"system-ui" }}>
                {sel.summary}
              </div>

              {/* On-chain receipts with BaseScan links */}
              <div style={{ marginBottom:8 }}>
                <div style={{ fontSize:9,color:C.textMuted,fontFamily:"'JetBrains Mono',monospace",marginBottom:4,letterSpacing:"0.5px" }}>
                  ON-CHAIN RECEIPTS · {sel.provenance.receipts} verified on {sel.provenance.network}
                </div>
                <div style={{ display:"flex",gap:4,flexWrap:"wrap" }}>
                  {sel.graph.nodes.filter(n=>n.type==="receipt").slice(0,5).map(n=>(
                    <a key={n.id}
                      href={`https://sepolia.basescan.org/tx/${n.id}`}
                      target="_blank" rel="noopener noreferrer"
                      style={{ background:C.greenDim,color:C.green,padding:"2px 6px",borderRadius:4,
                        fontSize:8,fontFamily:"'JetBrains Mono',monospace",textDecoration:"none",
                        border:`1px solid ${C.green}33`,cursor:"pointer" }}
                      title={`View ${n.label} on BaseScan`}>
                      {n.label}
                    </a>
                  ))}
                </div>
              </div>

              {sel.saleType === "secondary" ? (
                <div style={{ background:C.surfaceAlt,border:`1px solid ${C.green}33`,borderRadius:8,
                  padding:10,textAlign:"center" }}>
                  <div style={{ fontSize:11,color:C.green,fontWeight:700,marginBottom:4,
                    fontFamily:"'JetBrains Mono',monospace" }}>
                    Buy Now: {sel.buyNowPrice} {sel.buyNowCurrency}
                  </div>
                  <div style={{ fontSize:9,color:C.textMuted,fontFamily:"system-ui" }}>
                    Secondary sale · Purchase via CLI: POST /buy/{sel.bundleId}
                  </div>
                </div>
              ) : (
                <BidPanel bundle={sel}/>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
