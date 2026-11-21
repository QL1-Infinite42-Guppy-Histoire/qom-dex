# Handoff for Teh Fund — Qom DEX addresses

_Fill in after deployment (the Deploy tab on the site generates this same
block, ready to copy). Until then the DEX is built and verified, but not
yet deployed on-chain._

```
Qom DEX (Uniswap V2) — Qom chain
Chain ID: 33303 (Cosmos: qom_33303-1)
RPC: https://rpc.qomx.io
Explorer: https://scan.qomx.io
Site: https://ql1-infinite42-guppy-histoire.github.io/qom-dex/
Repo: https://github.com/QL1-Infinite42-Guppy-Histoire/qom-dex

WQOMX:    <pending deployment>
Factory:  <pending deployment>
Router02: <pending deployment>

Swap fee: 0.3% · feeTo: unset (protocol fee OFF)
Create a pool: Factory.createPair(YOUR_TOKEN, WQOMX),
then add liquidity via Router02.addLiquidity / the site's Pool tab.
```

Next on Teh Fund's side (per his 2026-11-21 post): create the Q
stablecoin on Qom chain, make a pool against QOMX (or another pair) on
this Factory, and bridge there.
