# Qom DEX — a normal Uniswap V2-style DEX for the Qom chain

Built in response to Teh Fund's 2026-11-21 call: *"Someone should create a
normal dex like Qomswap. After that I can create Q stablecoin on Qom chain
and make a pool and bridge there."*

This repo is the DEX itself: contracts + a static frontend. The Q
stablecoin, its pool and the bridge are Teh Fund's side, after deployment.

**Live site:** https://ql1-infinite42-guppy-histoire.github.io/qom-dex/

## Chain (this is Qom, NOT QL1)

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
(protocol fee OFF); `feeToSetter` is the deploying address.

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

Open the site's **Deploy** tab with a wallet holding **≥ 600 QOMX**
(the chain's gas price is high: ~53,571 gwei at check time, so the three
deployments cost roughly **460 QOMX** in gas) and click 1 → 2 → 3.
Full notes: [DEPLOY.md](DEPLOY.md).

After deployment, paste the addresses into `docs/config.js` and commit —
or leave them in the deploying browser (localStorage). The handoff block
for Teh Fund is generated on the Deploy tab and in
[HANDOFF.md](HANDOFF.md).

## Frontend

Static site in `docs/` (GitHub Pages). Swap, add/remove liquidity,
wrap/unwrap QOMX⇄WQOMX, custom ERC-20 import by address. Every action is
gated on live reads: a pair with no pool / no reserves shows
"quote unavailable" instead of a fake number. JA / EN, light-first theme.

## Status

- [x] Contracts prepared + live estimateGas verification
- [x] Local end-to-end swap test
- [x] Frontend published
- [ ] **On-chain deployment — waiting for the user's wallet signature**
- [ ] First real swap — user's wallet test after deployment

## License

Frontend and original code (incl. `WQOMX.sol`): MIT.
Uniswap V2 core/periphery contracts: GPL-3.0, © Uniswap Labs, unmodified.
