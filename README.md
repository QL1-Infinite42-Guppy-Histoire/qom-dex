# QOM DEX — a normal Uniswap V2-style DEX for the QOM chain

Built in response to Teh Fund's 2026-11-21 call: *"Someone should create a
normal dex like Qomswap. After that I can create Q stablecoin on Qom chain
and make a pool and bridge there."*

This repo holds the DEX contracts (the 2026-11-21 community deployment
below) + the static frontend, which now connects to Teh Fund's official
contracts (2026-11-24, see "Official DEX connection"). The Q stablecoin
exists, and its QOMX pool is live on the official DEX.

**Live site:** https://qomdex.com/

## Chain (this is QOM, not QL1)

| | |
| --- | --- |
| EVM chain ID | `33303` |
| Cosmos chain ID | `qom_33303-1` |
| Native token | QOMX (18 decimals) |
| Public EVM RPC | `https://rpc.qomx.io` |
| Explorer | https://scan.qomx.io |

## Contracts

Uniswap V2, used as-is (logic unmodified):

- `WQOMX` — wrapped QOMX (WETH9-compatible, 1:1). Original code in this
  repo (`contracts/WQOMX.sol`, MIT), compiled solc 0.8.20, `evmVersion: paris`.
- `UniswapV2Factory` / `UniswapV2Pair` — from `@uniswap/v2-core` 1.0.1
  (GPL-3.0), official build artifacts. Pair init-code hash verified:
  `0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f`.
- `UniswapV2Router02` — from `@uniswap/v2-periphery` (GPL-3.0), official
  build artifact.

Swap fee: **0.3%** (standard V2). Factory `feeTo` starts **unset**
(protocol fee OFF); `feeToSetter` was transferred on 2026-11-23 to a dedicated wallet `0x570AE9e37d209d6Db818d54Bfc05c4D90696c40a` (the deploying address no longer holds any admin rights).

## Official DEX connection (2026-11-24)

On 2026-11-24 Teh Fund deployed the **official** QOM DEX contracts himself,
and this repo's frontend (the GitHub Pages site above) now connects to them:

- `WQOMX` — `0x837a9389C412b2dfca2B97E511305B2B08B96572`
- `QOMFactory` — `0x35e759b084d97919138Ac8CbC8182fE68dcf69c3`
- `QOMRouter02` — `0x6d114d36F04941dCf5dD26445AB975bf7A4f1A34`

Verified on-chain before connecting (2026-11-24, block ≈ 106,489): code
present at all three addresses; `Router.factory()` and `Router.WETH()` return
exactly the Factory / WQOMX above; all three are source-verified on
scan.qomx.io (names WQOMX / QOMFactory / QOMRouter02); WQOMX is a standard
wrapped-native token (deposit/withdraw, 18 decimals, supply 0);
`allPairsLength` = 0 — **no pools yet, and no real swap has been done**.
Factory `feeToSetter` = Teh Fund's deployer `0x77096a50f1B2B9CE2fac9c0EDcc676C1aeD32BFb`;
`feeTo` = `0x58C2264175e4252e1938aC42cfbdC92Eac33CE3c` (set by Teh Fund on
2026-11-24, so the protocol fee is ON for these contracts).

Update (later on 2026-11-24): the Q/QOMX pair
`0x53578385cAb6BA7563F8BB493C1D4bfB63b5bc7B` was created and the first
real swap was done (100 QOMX → 0.132399 Q). The pool is live; liquidity
is still thin.

The 2026-11-21 community deployment below stays on-chain untouched — only
the frontend config (`docs/config.js`) switched. The official QOMX ERC-20
(`0xD494…0517`) remains the main listed token, as before.

## Live verification done before shipping (2026-11-21)

Against `https://rpc.qomx.io` (chain 33303, block ≈ 64,079 at check time):

- `eth_chainId` = `0x8217` (33303) ✓
- `eth_estimateGas` for contract creation **passed** for all three
  deployments: WQOMX ≈ 705,107 · Factory ≈ 3,051,511 · Router02 ≈ 4,757,273 gas.
- A PUSH0 probe also passed, so this chain's EVM is Shanghai-or-later —
  but all shipped bytecode is pre-Shanghai anyway (solc 0.5.16 / 0.6.6 /
  0.8.20-paris), so the QL1 PUSH0 failure mode cannot occur here.
- The chain README confirms standard secp256k1 accounts: MetaMask and
  normal EVM signing work unchanged (ML-DSA is an optional add-on).
- Local end-to-end test (Ganache): deploy → add QOMX/TEST liquidity →
  `getAmountsOut` quote → real swap. See `test-local.js`.

## Deploy (user signs; no keys in this repo, ever)

> **Note (2026-11-24):** the site no longer has a Deploy tab — the
> frontend now connects to Teh Fund's official contracts. This section
> is kept as the record of the 2026-11-21 community deployment.

Open the site's **Deploy** tab with a wallet holding **≥ 600 QOMX**
(the chain's gas price is high: ~53,571 gwei at check time, so the three
deployments cost roughly **460 QOMX** in gas) and click 1 → 2 → 3.
Full notes: [DEPLOY.md](DEPLOY.md).

After deployment, paste the addresses into `docs/config.js` and commit —
or leave them in the deploying browser (localStorage). The handoff block
for Teh Fund is generated on the Deploy tab and in
[HANDOFF.md](HANDOFF.md).

## Frontend

Static site in `docs/` (GitHub Pages, served at qomdex.com). Swap,
add/remove liquidity, a live pools list, custom ERC-20 import by address. Every action is
gated on live reads: a pair with no pool / no reserves shows
"quote unavailable" instead of a fake number. JA / EN, light-first theme.

## Status

- [x] Contracts prepared + live estimateGas verification
- [x] Local end-to-end swap test
- [x] Frontend published
- [x] **On-chain deployment — done 2026-11-21**, verified by live reads:
  WQOMX `0x7DF7DDe45772E01e99aB05F1977E926516271897` ·
  Factory `0x1cC5CeEaF98A3b4e2BB2731f960D63CBe0BA8BFC` ·
  Router02 `0xD0199c4EA87e4CfCc221f2efBC9f161a1331B1F4`
  (feeTo unset; feeToSetter was the deployer `0xa33e…73A23` at deployment, transferred 2026-11-23 to `0x570A…c40a`; Router wiring matches)
- [x] **Frontend connected to Teh Fund's official DEX contracts — 2026-11-24** (see "Official DEX connection" above; community deployment stays on-chain)
- [x] **First real pool + swap on the official Factory — done 2026-11-24**: Q/QOMX pair `0x53578385cAb6BA7563F8BB493C1D4bfB63b5bc7B`; first swap 100 QOMX → 0.132399 Q. The community Factory still has no pairs.

## License

Frontend and original code (incl. `WQOMX.sol`): MIT.
Uniswap V2 core/periphery contracts: GPL-3.0, © Uniswap Labs, unmodified.
