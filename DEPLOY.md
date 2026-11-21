# Deploy guide — Qom DEX

Deployment is done **from your own wallet** on the site. No private key
ever leaves your device; this repo contains bytecode + ABI only.

## Before you start

1. MetaMask installed, with an account you control.
2. That account funded with **QOMX on the Qom chain — at least 600 QOMX**.
   Gas on this chain is priced high (~53,571 gwei at 2026-11-21 check):
   - WQOMX deploy ≈ 705,107 gas ≈ 38 QOMX
   - Factory deploy ≈ 3,051,511 gas ≈ 164 QOMX
   - Router02 deploy ≈ 4,757,273 gas ≈ 255 QOMX
   - Total ≈ **460 QOMX**, plus a little for your first pool/swap.
   (In USD at the explorer's quoted price this is small; the QOMX amount
   is what matters.)
3. Open the site → **Connect Wallet**. It adds/switches to:
   Qom, chain ID 33303, RPC https://rpc.qomx.io, explorer scan.qomx.io.

## Steps (Deploy tab)

1. **Deploy WQOMX** — sign. Note the address shown.
2. **Deploy Factory** — sign. Constructor arg is your address
   (feeToSetter). `feeTo` stays unset → protocol fee OFF.
3. **Deploy Router02** — sign. Wired to the Factory + WQOMX above.

The site stores the three addresses in your browser and enables
Swap / Pool / Wrap automatically.

## After deployment

1. Copy the address block from the Deploy tab (or fill HANDOFF.md) and
   send it to Teh Fund — he creates the Q stablecoin + pool next.
2. Paste the addresses into `docs/config.js` and commit, so every
   visitor's browser sees the DEX as deployed (not just yours).
3. Verify the contracts on https://scan.qomx.io (optional but good):
   - WQOMX: source `contracts/WQOMX.sol`, solc 0.8.20, optimizer 999999
     runs, evmVersion paris.
   - Factory / Pair / Router02: official Uniswap V2 build artifacts,
     sources under `contracts/uniswap-v2-core` / `uniswap-v2-periphery`.
4. First real test: Wrap 1 QOMX → create a tiny pool → swap a small
   amount. Treat this as the end-to-end check before announcing.

## If a step fails

- "Insufficient funds": top up QOMX and retry that step only — completed
  steps keep their addresses.
- Wrong network: click Connect Wallet again; it re-switches to 33303.
