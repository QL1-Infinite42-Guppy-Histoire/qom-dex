// Qom DEX — deployment config.
// After the one-time deployment (Deploy tab, from your own wallet),
// paste the three addresses here and commit, OR just deploy from the
// site: the deploying browser remembers them in localStorage.
window.DEX_CONFIG = {
  chainId: 33303,
  chainName: "Qom",
  rpcUrl: "https://rpc.qomx.io",
  explorer: "https://scan.qomx.io",
  nativeSymbol: "QOMX",
  // Deployed 2026-11-21 by 0xa33e223BCF1BB82D475ea29a11f3ADD9c2E73A23 (feeToSetter):
  factory: "0x1cC5CeEaF98A3b4e2BB2731f960D63CBe0BA8BFC",
  router: "0xD0199c4EA87e4CfCc221f2efBC9f161a1331B1F4",
  wqomx: "0x7DF7DDe45772E01e99aB05F1977E926516271897",
  // Official QOMX ERC-20 contract on Qom chain (per Teh Fund, 2026-11-21).
  // It is the ERC-20 mirror of native QOMX: balanceOf(addr) == native balance,
  // totalSupply == 200M genesis supply (both verified on-chain 2026-11-21).
  qomxErc20: "0xD4949664cD82660AaE99bEdc034a0deA8A0bd517",
};
