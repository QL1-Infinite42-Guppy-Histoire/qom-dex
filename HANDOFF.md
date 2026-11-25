# Handoff for Teh Fund — Qom DEX addresses

> **Status note (2026-11-25):** this document records the 2026-11-21
> community deployment. The frontend now connects to Teh Fund's official
> contracts (see README, "Official DEX connection") and the site no
> longer has a Deploy tab. Figures below (feeTo unset, pairs 0) describe
> the community contracts only.


_Deployed on-chain 2026-11-21 and verified by live reads (code present at
all three addresses, Factory feeTo = unset, feeToSetter = the dedicated wallet 0x570AE9e37d209d6Db818d54Bfc05c4D90696c40a (transferred from the deployer on 2026-11-23 via the site's admin section, one signature; verified on-chain — the deployer retains no admin rights),
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

## Update 2026-11-21 (evening) — official QOMX ERC-20 adopted
Teh Fund asked that the DEX use the official QOMX contract instead of WQOMX:
0xD4949664cD82660AaE99bEdc034a0deA8A0bd517 — verified on-chain as the ERC-20
mirror of native QOMX (balanceOf == native balance on every probed address;
totalSupply == 200M genesis supply). The frontend now lists it as the main
"QOMX" token (labelled "official ERC-20"). NOTHING was changed on-chain:
Factory / Router02 / WQOMX stay deployed and supported exactly as before, and
any WQOMX pool keeps working — the switch is display/default only, so no
holder can lose funds by it. Teh Fund's Q/QOMX pair is created with
Factory.createPair(Q, 0xD4949664cD82660AaE99bEdc034a0deA8A0bd517).

Follow-up reply draft for Teh Fund:
"Thanks — confirmed on-chain: 0xD494…0517 is the official ERC-20 mirror of
native QOMX (balanceOf equals the native balance). The DEX frontend now uses
it as the main QOMX. WQOMX stays deployed and supported, and nothing was
moved or changed on-chain, so the Q/QOMX pair can be created anytime with
Factory.createPair(Q, 0xD4949664cD82660AaE99bEdc034a0deA8A0bd517).
About the swap not opening in your MetaMask — was that on mobile or desktop,
and what did you see? I want to fix that first."

## Update 2026-11-24 — frontend connected to the OFFICIAL DEX

Teh Fund deployed his own official contracts and sent the addresses; the
frontend in this repo now points at them (`docs/config.js`). Verified
on-chain first (block ≈ 106,489): code at all three, Router wiring matches,
all three source-verified on scan.qomx.io, `allPairsLength` = 0.

```
WQOMX:    0x837a9389C412b2dfca2B97E511305B2B08B96572
Factory:  0x35e759b084d97919138Ac8CbC8182fE68dcf69c3 (QOMFactory)
Router02: 0x6d114d36F04941dCf5dD26445AB975bf7A4f1A34 (QOMRouter02)
```

Factory state at connection time: feeToSetter = Teh Fund's deployer
0x77096a50f1B2B9CE2fac9c0EDcc676C1aeD32BFb. NOTE: feeTo was UNSET at the
first read (block 106,480) and was then set — during the verification
window — to 0x58C2264175e4252e1938aC42cfbdC92Eac33CE3c (the address the
user had asked to be made feeToSetter). So that address is currently the
feeTo (protocol fee recipient; protocol fee ON), NOT the feeToSetter —
Teh Fund retains feeToSetter and can change feeTo at any time. Flagged to
the user 2026-11-24.

The community deployment in the block at the top of this file stays
on-chain untouched. Site copy now reads as the official DEX (contracts by
Teh Fund, frontend by the community) with the honest limits kept: no
pools yet, first real swap not done.

## Audit 2026-11-24 (community DEX, frontend only)
On-chain state re-verified: all three contracts present, Router wiring correct,
feeToSetter = dedicated wallet 0x570A…c40a (transfer persisted), feeTo unset, pairs 0.
Fixed and live-verified: ethers 6.13.4 vendored locally (was an integrity-less CDN
script; sha256 fd66c046…); connect() chainId verification + user-rejection respected;
amount/balance validation on swap/add-liquidity/wrap; quote race guard; QOMX<->WQOMX
routes to Wrap guidance; remove-liquidity slippage minimums from live reserves
(was 0/0) + pair/zero guards; pool list per-token decimals; custom-token import
validation/dedupe; localStorage parse hardening; stale admin prefill removed.
Contracts themselves are immutable and were not touched.

## Audit fixes 2026-11-24 (official DEX frontend; contracts untouched)
Full audit of the official contracts + frontend: Critical 0 / High 0 (the
three contracts are faithful Uniswap V2 copies; Router pair init-code hash
matches the Factory on-chain). Frontend-side findings fixed here:
- M-2: swaps now bind to the quote the user SAW (Guppy Bridge v0.8.2
  pattern). doSwap re-quotes at send time; if the achievable output dropped
  below the displayed quote minus slippage, it aborts BEFORE signing and
  refreshes the quote with a "price moved" message (EN/JA). Equal-or-better
  proceeds with minOut derived from the displayed quote. 20-minute deadline
  and exact-amount approvals unchanged.
- L-1: read failures are no longer silent or mislabelled. quoteSwap checks
  pair existence first, so "no pool" is distinct from a quote FETCH failure
  (new message); balance / pool-list / LP read failures raise a visible
  readWarn banner ("displayed data may be stale") instead of blanking.
- L-2: slippage — visible warning above 5%, labelled hard cap at 10%
  (was a silent clamp at 50% inside minOut).
- L-5: add-liquidity now does the same pre-send balance check as swap,
  with a per-token insufficient-balance message.
- L-4: importing a custom token whose self-reported symbol collides with
  QOMX / WQOMX (and is not the genuine contract) shows a caution that the
  symbol is unverified. Adding is not blocked.
Remaining contract-side item is M-1 (feeToSetter stays with Teh Fund) —
not fixable from the frontend.

## 2026-11-24 — connect() ordering (user report: "no confirmation prompt")

User reported that tapping Connect shows no wallet confirmation prompt and
connects instantly, in both MetaMask and FoxWallet. Cause: this origin
(ql1-infinite42-guppy-histoire.github.io) is already authorised in the
user's wallets from the community DEX / other Guppy's Guide sites — wallet
site permissions are per-origin, and for an authorised origin
eth_requestAccounts returns silently. A dApp cannot force the prompt; it
appears only for first-time connections (or after revoking the site in the
wallet's connected-sites settings). Reproduced with the real app.js in a
stub-provider harness: the old flow also only reached the account step via
getSigner()/eth_accounts AFTER the chain switch, so a switch/add failure
could block the account step entirely. Fix (frontend only): connect() now
calls eth_requestAccounts explicitly FIRST, before the chain switch; the
no-wallet MetaMask deep link is built from the current location. Verified
in the harness (accounts first, prompt triggered, full connect) and live.

## Official connection + Teh Fund review fixes 2026-11-24
The frontend now points at Teh Fund's OFFICIAL contracts (connected by the
user's other session, commits 9a234cc..bf2b901): Factory 0x35e7…69c3,
Router 0x6d11…1A34, WQOMX 0x837a…6572. feeTo = 0x58C2…CE3c (frontend
builder); feeToSetter stays with Teh Fund — CONFIRMED INTENTIONAL by him;
the earlier audit note M-1 is withdrawn, no confirmation DM needed.
Q/QOMX pool is LIVE: pair 0x53578385cAb6BA7563F8BB493C1D4bfB63b5bc7B,
Q = 0xd53D9f937537262F78AEC261785D731E9E829138 (Q Stablecoin, 6 dp),
reserves at fix time ≈ 7,530,220 QOMX / 9,999.87 Q; quote 100 QOMX →
0.132396 Q reproduced; impact at 1M QOMX = 11.96%.
Review fixes shipped (commit cb2b6fe, live-verified): Q built-in with label
"Q (on QOM)" and QOMX/Q defaults on both tabs; banner states the pool is
live; price impact (>3% warn, >10% red) + minimum received + 0.3% fee shown
from the displayed quote; gasLimit = estimate x1.2 on ALL sends (QOM charges
>=50% of the limit, so no extra padding); add-liquidity ratio auto-fill via
Router.quote + pool-share display; QOMX MAX button keeps a live-estimated
gas reserve and doSwap refuses gas-starving sends; Wrap tab removed (no
WQOMX pool exists; pools use 0xD494 directly); Factory admin section removed
from the public site; decimal-overflow inputs show an explicit message;
naming unified to QOM (title, chain name in wallet prompts, UI strings).
The 2026-11-21 community contracts stay on-chain untouched.
