# Handoff for Teh Fund — Qom DEX addresses

_Deployed on-chain 2026-11-21 and verified by live reads (code present at
all three addresses, Factory feeTo = unset, feeToSetter = deployer,
Router02 wired to this Factory + WQOMX). Copy-paste block:_

```
Qom DEX (Uniswap V2) — Qom chain
Chain ID: 33303 (Cosmos: qom_33303-1)
RPC: https://rpc.qomx.io
Explorer: https://scan.qomx.io
Site: https://ql1-infinite42-guppy-histoire.github.io/qom-dex/
Repo: https://github.com/QL1-Infinite42-Guppy-Histoire/qom-dex

WQOMX:    0x7DF7DDe45772E01e99aB05F1977E926516271897
Factory:  0x1cC5CeEaF98A3b4e2BB2731f960D63CBe0BA8BFC
Router02: 0xD0199c4EA87e4CfCc221f2efBC9f161a1331B1F4

Swap fee: 0.3% · feeTo: unset (protocol fee OFF)
Create a pool: Factory.createPair(YOUR_TOKEN, WQOMX),
then add liquidity via Router02.addLiquidity / the site's Pool tab.
```

Next on Teh Fund's side (per his 2026-11-21 post): create the Q
stablecoin on Qom chain, make a pool against QOMX (or another pair) on
this Factory, and bridge there.
