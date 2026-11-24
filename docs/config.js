// QOM DEX — deployment config (official DEX contracts, connected 2026-11-24).
// The config values below take precedence over any browser-local copies.
window.DEX_CONFIG = {
  chainId: 33303,
  chainName: "QOM",
  rpcUrl: "https://rpc.qomx.io",
  explorer: "https://scan.qomx.io",
  nativeSymbol: "QOMX",
  // OFFICIAL QOM DEX contracts, deployed by Teh Fund on 2026-11-24 and
  // source-verified on scan.qomx.io. Wiring verified on-chain 2026-11-24
  // (Router.factory() / Router.WETH() match the addresses below):
  // Factory feeToSetter = Teh Fund's deployer 0x77096a50f1B2B9CE2fac9c0EDcc676C1aeD32BFb;
  // feeTo = 0x58C2264175e4252e1938aC42cfbdC92Eac33CE3c (set by Teh Fund 2026-11-24).
  // The 2026-11-21 community deployment (Factory 0x1cC5…8BFC etc.) stays
  // on-chain untouched; this frontend now points at the official contracts.
  factory: "0x35e759b084d97919138Ac8CbC8182fE68dcf69c3",
  router: "0x6d114d36F04941dCf5dD26445AB975bf7A4f1A34",
  wqomx: "0x837a9389C412b2dfca2B97E511305B2B08B96572",
  // Official QOMX ERC-20 contract on QOM chain (per Teh Fund, 2026-11-21).
  // It is the ERC-20 mirror of native QOMX: balanceOf(addr) == native balance,
  // totalSupply == 200M genesis supply (both verified on-chain 2026-11-21).
  qomxErc20: "0xD4949664cD82660AaE99bEdc034a0deA8A0bd517",
  // Q Stablecoin on QOM (6 decimals). Identified from the official Factory's
  // only pair 0x53578385cAb6BA7563F8BB493C1D4bfB63b5bc7B (token1) and verified
  // on-chain 2026-11-24: quote 100 QOMX -> ~0.1324 Q reproduced.
  qToken: "0xd53D9f937537262F78AEC261785D731E9E829138",
};
