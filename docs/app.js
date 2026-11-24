/* QOM DEX frontend — Uniswap V2 on QOM chain (33303). No backend; all calls go wallet/RPC direct. */
"use strict";
const CFG = window.DEX_CONFIG;
const $ = id => document.getElementById(id);
const ERC20_ABI = ["function symbol() view returns (string)","function decimals() view returns (uint8)","function balanceOf(address) view returns (uint256)","function allowance(address,address) view returns (uint256)","function approve(address,uint256) returns (bool)","function transfer(address,uint256) returns (bool)"];
const ROUTER_ABI = ["function getAmountsOut(uint256,address[]) view returns (uint256[])","function swapExactETHForTokens(uint256,address[],address,uint256) payable returns (uint256[])","function swapExactTokensForETH(uint256,uint256,address[],address,uint256) returns (uint256[])","function swapExactTokensForTokens(uint256,uint256,address[],address,uint256) returns (uint256[])","function quote(uint256,uint256,uint256) view returns (uint256)","function addLiquidity(address,address,uint256,uint256,uint256,uint256,address,uint256) returns (uint256,uint256,uint256)","function addLiquidityETH(address,uint256,uint256,uint256,address,uint256) payable returns (uint256,uint256,uint256)","function removeLiquidity(address,address,uint256,uint256,uint256,address,uint256) returns (uint256,uint256)","function removeLiquidityETH(address,uint256,uint256,uint256,address,uint256) returns (uint256,uint256)","function factory() view returns (address)","function WETH() view returns (address)"];
const FACTORY_ABI = ["function getPair(address,address) view returns (address)","function feeTo() view returns (address)","function feeToSetter() view returns (address)","function allPairsLength() view returns (uint256)","function allPairs(uint256) view returns (address)"];
const PAIR_ABI = ["function getReserves() view returns (uint112,uint112,uint32)","function balanceOf(address) view returns (uint256)","function allowance(address,address) view returns (uint256)","function approve(address,uint256) returns (bool)","function totalSupply() view returns (uint256)","function token0() view returns (address)","function token1() view returns (address)"];
const WQOMX_ABI = ["function deposit() payable","function withdraw(uint256)","function balanceOf(address) view returns (uint256)"];

const I18N = {
  en:{tabSwap:"Swap",tabPool:"Pool",tabWrap:"Wrap",tabDeploy:"Deploy",youPay:"You pay",youReceive:"You receive (estimated)",slippage:"Slippage %",connect:"Connect Wallet",connected:"Connected",wrongNet:"Wrong network — click Connect to switch to QOM (33303).",notDeployed:"The DEX contracts are not configured in this build.",pickToken:"Pick a token",importBtn:"Import",addLiq:"Add liquidity",removeLiq:"Remove liquidity",pairLabel:"Pair (Token A / Token B above)",wrapBtn:"Wrap",unwrapBtn:"Unwrap",deployTitle:"Deploy the DEX (one time)",deployNote:"Deploys WQOMX → Factory → Router02 from YOUR wallet. You sign each step; nobody else holds the keys. feeTo stays unset (protocol fee OFF), feeToSetter = your address. Estimated total gas ≈ 8.5M gas — at the chain's current gas price that is roughly 460 QOMX, so prepare at least 600 QOMX in the deploying wallet.",handoffTitle:"Addresses for Teh Fund / pool creators",copyBtn:"Copy",noPool:"No pool / no liquidity for this pair yet — quote unavailable. Create it in the Pool tab.",quoteOk:(r)=>`Rate ≈ ${r}`,needConnect:"Connect your wallet first.",needDeployed:"Contracts not configured in this build.",working:"Working… check your wallet.",done:(h)=>`Done ✓ tx: ${h}`,failed:(m)=>`Failed: ${m}`,bal:(b,s)=>`Balance: ${b} ${s}`,lpBal:(b)=>`Your LP balance: ${b}`,insufficient:"Amount exceeds your balance / allowance flow failed.",useWrap:"QOMX ⇄ WQOMX is always 1:1 and is not traded through a pool — pick a different pair.",samePair:"Pick two different tokens for a pair.",tag_official:"official ERC-20",tag_onqom:"on QOM",maxGas:"MAX (keep gas)",priceImpact:(v)=>`Price impact: ${v}%`,impactHigh:"⚠️ High price impact — this trade moves the price a lot; you may receive much less than the spot value.",minRecv:(v,s)=>`Minimum received: ${v} ${s}`,feeLine:(v,s)=>`Swap fee (0.3%): ${v} ${s}`,tooManyDecimals:(d)=>`Too many decimal places — this token supports ${d} decimals.`,gasKeep:(r)=>`This amount would leave too little for gas — QOMX pays the gas too. Keep at least ≈ ${r} QOMX unspent, or use the MAX button.`,poolShare:(v)=>`Your pool share after adding: ≈ ${v}%`,firstLiq:"No pool yet for this pair — your deposit sets the starting price.",poolsTitle:"Pools on this DEX",devNotice:"🚧 The official QOM DEX — contracts deployed by Teh Fund, frontend built by the community. The Q/QOMX pool is live; liquidity is still thin, so check the price impact before swapping. Use at your own risk.",poolsNone:"No pools yet — create the first one above.",openInMM:"Open this page in MetaMask",noWallet:"No wallet found in this browser. Open this page inside MetaMask (or install MetaMask), then tap Connect Wallet.",tag_wrapped:"wrapped",tag_native:"via WQOMX",qomxNote:"QOMX in the list is the official ERC-20 contract (0xD494…0517): its balance IS your native QOMX balance — the same coins, and QOMX also pays the gas. The live pool uses QOMX (0xD494…) directly; WQOMX is a separate wrapped token with no pool here.",quoteFail:"Could not fetch a quote — the chain / RPC may be unreachable. This is NOT the same as 'no pool': please wait a moment and retry.",readWarn:"⚠️ Some data could not be loaded (RPC read failure). Balances and pool information shown may be out of date — reload the page to retry.",priceMoved:(a,b)=>`Price moved since the quote you saw: expected ≈ ${a}, now ≈ ${b}. The swap was cancelled BEFORE signing and the quote has been refreshed — review it and try again.`,slipHigh:"⚠️ High slippage: with this setting you may receive much less than the quoted amount.",slipCap:(cap)=>`Slippage is capped at ${cap}% for safety — your input was adjusted to ${cap}%.`,insufficientBal:(s)=>`Insufficient ${s} balance for this amount.`,symbolCaution:(s)=>`⚠️ Caution: the symbol "${s}" is reported by this token's own contract — any contract can call itself QOMX or WQOMX. The symbol is NOT verified; double-check the contract address.`},
  ja:{tabSwap:"スワップ",tabPool:"プール",tabWrap:"ラップ",tabDeploy:"デプロイ",youPay:"支払う",youReceive:"受け取る（見込み）",slippage:"スリッページ %",connect:"ウォレット接続",connected:"接続済み",wrongNet:"ネットワークが違います —「ウォレット接続」から QOM (33303) に切り替えてください。",notDeployed:"DEXコントラクトがこのビルドに設定されていません。",pickToken:"トークンを選ぶ",importBtn:"追加",addLiq:"流動性を追加",removeLiq:"流動性を削除",pairLabel:"ペア（上の Token A / Token B）",wrapBtn:"ラップ",unwrapBtn:"アンラップ",deployTitle:"DEXをデプロイ（初回のみ）",deployNote:"あなたのウォレットから WQOMX → Factory → Router02 の順にデプロイします。各ステップであなたが署名し、鍵は誰にも渡りません。feeTo は未設定（プロトコル手数料OFF）、feeToSetter はあなたのアドレスです。ガス見積もり合計 ≈ 850万 gas — 現在のガス価格では約460 QOMX になるため、デプロイ用ウォレットには 600 QOMX 以上を用意してください。",handoffTitle:"Teh Fund / プール作成者向けアドレス一覧",copyBtn:"コピー",noPool:"このペアのプール／流動性がまだ無いため見積もりできません。「プール」タブで作成できます。",quoteOk:(r)=>`レート ≈ ${r}`,needConnect:"先にウォレットを接続してください。",needDeployed:"コントラクトがこのビルドに設定されていません。",working:"処理中… ウォレットを確認してください。",done:(h)=>`完了 ✓ tx: ${h}`,failed:(m)=>`失敗: ${m}`,bal:(b,s)=>`残高: ${b} ${s}`,lpBal:(b)=>`あなたのLP残高: ${b}`,insufficient:"残高不足、または承認フローに失敗しました。",useWrap:"QOMX ⇄ WQOMX は常に 1:1 で、プールでは取引されません。別のペアを選んでください。",samePair:"ペアには異なる2つのトークンを選んでください。",tag_official:"公式 ERC-20",tag_onqom:"QOM 上",maxGas:"MAX（ガス分を残す）",priceImpact:(v)=>`価格インパクト： ${v}%`,impactHigh:"⚠️ 価格インパクトが大きい取引です。スポット価格より大幅に少なく受け取る可能性があります。",minRecv:(v,s)=>`最低受取額： ${v} ${s}`,feeLine:(v,s)=>`スワップ手数料（0.3%）： ${v} ${s}`,tooManyDecimals:(d)=>`小数桁が多すぎます。このトークンは小数 ${d} 桁までです。`,gasKeep:(r)=>`この金額だとガス分が残りません。ガス代も QOMX から払われます。少なくとも約 ${r} QOMX を残すか、MAX ボタンを使ってください。`,poolShare:(v)=>`追加後のあなたのプールシェア： 約 ${v}%`,firstLiq:"このペアのプールはまだありません — あなたの預け入れが開始価格になります。",poolsTitle:"このDEXのプール",devNotice:"🚧 公式 QOM DEX — コントラクトは Teh Fund がデプロイ、フロントエンドはコミュニティが開発しました。Q/QOMX プールは稼働中です。流動性はまだ薄いため、スワップ前に価格インパクトを確認してください。利用は自己責任でお願いします。",poolsNone:"プールはまだありません — 上で最初のプールを作れます。",openInMM:"MetaMaskでこのページを開く",noWallet:"このブラウザにウォレットが見つかりません。MetaMaskの中でこのページを開く（またはMetaMaskを入れる）→「ウォレット接続」を押してください。",tag_wrapped:"ラップ済み",tag_native:"WQOMX 経由",qomxNote:"リストの QOMX は公式 ERC-20 コントラクト（0xD494…0517）です。残高はネイティブ QOMX の残高そのもの（同じコイン）で、ガス代もこの QOMX から払われます。稼働中のプールは QOMX（0xD494…）を直接使っており、WQOMX は別のラップ済みトークンで、ここにはプールがありません。",quoteFail:"見積もりを取得できませんでした（チェーン／RPCに接続できない可能性があります）。これは「プールが無い」とは別の状態です。少し待って再試行してください。",readWarn:"⚠️ 一部のデータを読み取れませんでした（RPC読み取り失敗）。表示中の残高・プール情報が古い可能性があります。ページを再読み込みして再試行してください。",priceMoved:(a,b)=>`表示されていた見積もりから価格が動きました（見込み ≈ ${a} → 現在 ≈ ${b}）。署名の前にスワップを中止し、見積もりを更新しました。内容を確認して再試行してください。`,slipHigh:"⚠️ スリッページが高すぎます。この設定では見積もりより大幅に少なく受け取る可能性があります。",slipCap:(cap)=>`安全のためスリッページの上限は ${cap}% です。入力を ${cap}% に調整しました。`,insufficientBal:(s)=>`${s} の残高が不足しています。`,symbolCaution:(s)=>`⚠️ 注意：シンボル「${s}」はこのトークンのコントラクト自身が名乗っているものです。QOMX や WQOMX のような名前はどのコントラクトでも名乗れます。シンボルは検証されていません — コントラクトアドレスをよく確認してください。`}
};
let lang = localStorage.getItem("qomdex-lang") || "en";
const t = k => I18N[lang][k];

let readProvider, provider, signer, account = null;
// L-1: track which read paths are currently failing so a visible banner can
// say "displayed data may be stale" instead of silently blanking values.
const readFailSrc = new Set();
function noteReadFail(src){ readFailSrc.add(src); renderReadWarn(); }
function noteReadOk(src){ readFailSrc.delete(src); renderReadWarn(); }
function renderReadWarn(){ const el = $("readWarn"); if(!el) return; el.hidden = readFailSrc.size === 0; if(!el.hidden) el.textContent = t("readWarn"); }
function safeParse(s, fb){ try{ const v = JSON.parse(s); return v ?? fb; }catch(e){ return fb; } }
let addrs = loadAddrs();
function loadAddrs(){
  const ls = safeParse(localStorage.getItem("qomdex-addrs") || "{}", {});
  return { factory: CFG.factory || ls.factory || "", router: CFG.router || ls.router || "", wqomx: CFG.wqomx || ls.wqomx || "" };
}
function saveAddrs(){ localStorage.setItem("qomdex-addrs", JSON.stringify(addrs)); refreshDeployedUI(); }
const deployed = () => !!(addrs.factory && addrs.router && addrs.wqomx);

let customTokens = safeParse(localStorage.getItem("qomdex-tokens") || "[]", []); if(!Array.isArray(customTokens)) customTokens = [];
function tokenList(){
  const list = [];
  if(CFG.qomxErc20) list.push({symbol:"QOMX", address:CFG.qomxErc20, decimals:18, tag:"official"});
  if(CFG.qToken) list.push({symbol:"Q", label:"Q (on QOM)", address:CFG.qToken, decimals:6, tag:"onqom"});
  if(addrs.wqomx) list.push({symbol:"WQOMX", address:addrs.wqomx, decimals:18, tag:"wrapped"});
  return list.concat(customTokens.filter(ct => !list.some(x=>x.address.toLowerCase()===ct.address.toLowerCase())));
}
const tokLabel = tok => tok.label || tok.symbol;
let swapIn = tokenList()[0], swapOut = tokenList()[1] || tokenList()[0];
let liqA = tokenList()[0], liqB = tokenList()[1] || tokenList()[0];

function fmt(n, d=6){ if(n===null||n===undefined||isNaN(n)) return "0"; return Number(n).toLocaleString("en-US",{maximumFractionDigits:d}); }
function deadline(){ return BigInt(Math.floor(Date.now()/1000)+1200); }
const SLIP_MAX = 10, SLIP_WARN = 5; // percent: hard cap, and the threshold above which a high-slippage warning is shown
function slipInfo(raw){ let s = Number(raw); if(!(s>=0)) s = 0; const capped = s > SLIP_MAX; if(capped) s = SLIP_MAX; return { value:s, capped, warn: s > SLIP_WARN }; }
function minOut(amount, slipPct){ const s = slipInfo(slipPct).value; const bps = BigInt(Math.round((100 - s)*100)); return amount * bps / 10000n; }
// M-2 drift guard: true when the output achievable NOW has dropped below what
// the quote the user actually SAW guarantees (displayed quote minus slippage).
// In that case the send must abort before signing instead of silently
// re-anchoring the minimum to the worse, fresh quote.
function driftAbort(shownOut, freshOut, slipPct){ if(shownOut === null || shownOut === undefined) return false; return freshOut < minOut(shownOut, slipPct); }

function showMmOpen(){ const l = $("mmOpenLink"); if(l) l.href = "https://metamask.app.link/dapp/" + location.host + location.pathname; $("mmOpen").hidden = false; }

async function init(){
  readProvider = new ethers.JsonRpcProvider(CFG.rpcUrl, CFG.chainId);
  applyLang(); refreshDeployedUI(); renderTokButtons();
  try{ const n = await readProvider.getNetwork(); console.log("RPC chain", n.chainId.toString()); }catch(e){ $("netNotice").hidden=false; $("netNotice").textContent = "RPC unreachable: "+CFG.rpcUrl; }
  const wireEth = ()=>{ if(window.ethereum && !provider){ provider = new ethers.BrowserProvider(window.ethereum); window.ethereum.on?.("accountsChanged", ()=>location.reload()); window.ethereum.on?.("chainChanged", ()=>location.reload()); $("mmOpen").hidden = true; } };
  wireEth();
  window.addEventListener("ethereum#initialized", wireEth, {once:true});
  setTimeout(()=>{ if(!window.ethereum){ $("netNotice").hidden=false; $("netNotice").textContent = t("noWallet"); showMmOpen(); } }, 1200);
  loadPools();
}
function refreshDeployedUI(){
  $("notDeployed").hidden = deployed();
  if(!deployed()) $("notDeployed").textContent = t("notDeployed");
  const dis = !deployed();
  $("swapBtn").disabled = dis; $("liqBtn").disabled = dis; $("liqRemoveBtn").disabled = dis;
  renderTokButtons();
}
function applyLang(){
  document.querySelectorAll("[data-i18n]").forEach(el=>{ const k=el.dataset.i18n; if(I18N[lang][k]) el.textContent = I18N[lang][k]; });
  $("langBtn").textContent = lang==="en" ? "日本語" : "English";
  if(!account) $("connectBtn").textContent = t("connect");
  refreshDeployedUI(); renderReadWarn(); checkSlippage();
}
$("langBtn").onclick = ()=>{ lang = lang==="en"?"ja":"en"; localStorage.setItem("qomdex-lang", lang); applyLang(); };
$("themeBtn").onclick = ()=>{ const d = document.documentElement.dataset.theme==="dark"; document.documentElement.dataset.theme = d?"":"dark"; localStorage.setItem("guppy-theme", d?"light":"dark"); $("themeBtn").textContent = d?"🌙 Dark":"☀️ Light"; };

document.querySelectorAll(".tab").forEach(b=> b.onclick = ()=>{ document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active")); b.classList.add("active"); ["swap","pool"].forEach(k=> $("tab-"+k).hidden = k!==b.dataset.tab); });

async function connect(){
  if(!window.ethereum){ $("netNotice").hidden=false; $("netNotice").textContent = t("noWallet"); showMmOpen(); return; }
  // Request accounts FIRST, explicitly: eth_requestAccounts is the call that
  // makes the wallet show its site-connection confirmation to a user who has
  // not authorised this origin yet. (If the origin is already authorised in
  // the wallet, it returns silently — that is the wallet's normal behaviour
  // and no dApp can force the prompt to reappear.) Doing it before the chain
  // switch also means the confirmation is never blocked behind a switch/add
  // failure on wallets whose switch handling is flaky.
  await window.ethereum.request({method:"eth_requestAccounts"});
  provider = new ethers.BrowserProvider(window.ethereum);
  const hexId = "0x"+CFG.chainId.toString(16);
  const addParams = [{chainId:hexId, chainName:CFG.chainName, nativeCurrency:{name:"QOMX",symbol:"QOMX",decimals:18}, rpcUrls:[CFG.rpcUrl], blockExplorerUrls:[CFG.explorer]}];
  // MetaMask mobile wraps the 4902 "chain not added" error so ethers shows
  // only "could not coalesce error" and the code is lost. Do NOT branch on
  // the switch error: on ANY switch failure, add the chain via the raw
  // provider request, then switch again.
  try{ await window.ethereum.request({method:"wallet_switchEthereumChain", params:[{chainId:hexId}]}); }
  catch(switchErr){
    if(switchErr && switchErr.code === 4001) throw switchErr; // user rejected: do not pop the add-chain dialog
    await window.ethereum.request({method:"wallet_addEthereumChain", params:addParams});
    await window.ethereum.request({method:"wallet_switchEthereumChain", params:[{chainId:hexId}]});
  }
  const net = await provider.getNetwork();
  if(Number(net.chainId) !== CFG.chainId){ $("netNotice").hidden=false; $("netNotice").textContent = t("wrongNet"); return; }
  signer = await provider.getSigner(); account = await signer.getAddress();
  $("connectBtn").textContent = t("connected")+": "+account.slice(0,6)+"…"+account.slice(-4);
  refreshDeployedUI(); refreshBalances(); quoteSwap(); refreshLp(); updatePctRow();
}
$("connectBtn").onclick = ()=> connect().catch(e=>{ $("netNotice").hidden=false; $("netNotice").textContent = t("failed")(e.shortMessage||e.message); });

function renderTokButtons(){
  $("swapInTok").textContent = tokLabel(swapIn)+" ▾"; $("swapOutTok").textContent = tokLabel(swapOut)+" ▾";
  $("liqATok").textContent = tokLabel(liqA)+" ▾"; $("liqBTok").textContent = tokLabel(liqB)+" ▾";
  updatePctRow();
}
const isQomx = tok => !!CFG.qomxErc20 && tok.address.toLowerCase() === CFG.qomxErc20.toLowerCase();
function updatePctRow(){
  const on = !!account && deployed();
  document.querySelectorAll("#swapPctRow .pct-btn, #liqPctRow .pct-btn").forEach(b => b.disabled = !on);
}
let pickerTarget = null;
function openPicker(setter){ pickerTarget = setter; const list=$("tokList"); list.innerHTML=""; tokenList().forEach(tok=>{ const b=document.createElement("button"); b.className="tok-btn"; b.textContent=`${tokLabel(tok)}${tok.tag && !tok.label?" ("+t("tag_"+tok.tag)+")":""} — ${tok.address==="native"?"native":tok.address.slice(0,10)+"…"}`; b.onclick=()=>{ setter(tok); $("tokDlg").close(); renderTokButtons(); quoteSwap(); refreshBalances(); refreshLp(); updateLiqInfo(); }; list.appendChild(b); }); $("tokDlg").showModal(); }
$("swapInTok").onclick=()=>openPicker(v=>swapIn=v); $("swapOutTok").onclick=()=>openPicker(v=>swapOut=v);
$("liqATok").onclick=()=>openPicker(v=>liqA=v); $("liqBTok").onclick=()=>openPicker(v=>liqB=v);
$("tokClose").onclick=()=>$("tokDlg").close();
$("addTokBtn").onclick = async ()=>{
  const raw = $("customTokAddr").value.trim();
  if(!ethers.isAddress(raw)){ $("tokStatus").textContent = t("failed")("not a valid address"); return; }
  const a = ethers.getAddress(raw);
  try{ const c = new ethers.Contract(a, ERC20_ABI, readProvider); const [s,d] = await Promise.all([c.symbol(), c.decimals()]); const dec = Number(d); if(!(dec>=0 && dec<=36) || !s) throw new Error("bad token metadata"); const tok={symbol:String(s).slice(0,32), address:a, decimals:dec}; customTokens = customTokens.filter(x=>x.address.toLowerCase()!==a.toLowerCase()); customTokens.push(tok); localStorage.setItem("qomdex-tokens", JSON.stringify(customTokens));
  // L-4: if the imported token's self-reported symbol collides with a
  // built-in symbol (QOMX / WQOMX) but this is NOT the genuine built-in
  // contract, warn that the symbol is unverified. Adding is not blocked.
  const builtinSyms = ["QOMX","WQOMX"];
  const isGenuine = a.toLowerCase() === String(CFG.qomxErc20||"").toLowerCase() || a.toLowerCase() === String(addrs.wqomx||"").toLowerCase();
  $("tokStatus").textContent = "✓ "+tok.symbol + (!isGenuine && builtinSyms.includes(tok.symbol.toUpperCase()) ? " — " + t("symbolCaution")(tok.symbol) : "");
  if(pickerTarget) pickerTarget(tok); renderTokButtons(); }
  catch(e){ $("tokStatus").textContent = t("failed")("not an ERC-20 readable at this address"); }
};

const effAddr = tok => tok.address==="native" ? addrs.wqomx : tok.address;
async function balOf(tok, who){
  if(!who) return null;
  if(tok.address==="native") return await readProvider.getBalance(who);
  return await new ethers.Contract(tok.address, ERC20_ABI, readProvider).balanceOf(who);
}
async function refreshBalances(){
  if(!account) return;
  let allOk = true;
  for(const [tok,el] of [[swapIn,"swapInBal"],[swapOut,"swapOutBal"]]){ try{ const b=await balOf(tok,account); $(el).textContent = t("bal")(fmt(ethers.formatUnits(b, tok.decimals)), tok.symbol); }catch(e){ allOk = false; /* keep the last shown value; the readWarn banner says it may be stale */ } }
  if(allOk) noteReadOk("bal"); else noteReadFail("bal");
}
let quoteSeq = 0;
let shownQuote = null; // the quote currently on screen: {key, outRaw} — doSwap binds the send to THIS (M-2)
function decOverflow(str, dec){ const parts = String(str).split("."); if(parts.length < 2) return false; return parts[1].replace(/0+$/, "").length > dec; }
function clearSwapDetails(){ for(const id of ["swapImpact","swapMinRecv","swapFee"]){ const el = $(id); if(el){ el.textContent = ""; el.className = "quote"; } } }
async function quoteSwap(){
  const seq = ++quoteSeq;
  const amt = $("swapInAmt").value; $("swapQuote").textContent=""; $("swapOutAmt").value=""; shownQuote = null; clearSwapDetails();
  if(!deployed() || !amt || Number(amt)<=0 || swapIn.address===swapOut.address) return;
  if(decOverflow(amt, swapIn.decimals)){ $("swapQuote").textContent = t("tooManyDecimals")(swapIn.decimals); $("swapBtn").disabled = true; return; }
  const aIn = effAddr(swapIn).toLowerCase(), aOut = effAddr(swapOut).toLowerCase();
  const wrapPair = (aIn===CFG.qomxErc20.toLowerCase() && aOut===addrs.wqomx.toLowerCase()) || (aOut===CFG.qomxErc20.toLowerCase() && aIn===addrs.wqomx.toLowerCase());
  if(effAddr(swapIn)===effAddr(swapOut) || wrapPair){ $("swapQuote").textContent = t("useWrap"); $("swapBtn").disabled = true; return; }
  let amtInRaw;
  try{ amtInRaw = ethers.parseUnits(amt, swapIn.decimals); }
  catch(e){ $("swapQuote").textContent = t("tooManyDecimals")(swapIn.decimals); $("swapBtn").disabled = true; return; }
  try{
    // L-1: check pair existence first so "no pool" is not confused with an
    // RPC/read failure (previously every error was reported as "no pool").
    const factory = new ethers.Contract(addrs.factory, FACTORY_ABI, readProvider);
    const pair = await factory.getPair(effAddr(swapIn), effAddr(swapOut));
    if(seq !== quoteSeq) return; // a newer quote superseded this one
    if(pair === ethers.ZeroAddress){ $("swapQuote").textContent = t("noPool"); $("swapBtn").disabled = true; return; }
    const router = new ethers.Contract(addrs.router, ROUTER_ABI, readProvider);
    const amounts = await router.getAmountsOut(amtInRaw, [effAddr(swapIn), effAddr(swapOut)]);
    if(seq !== quoteSeq) return; // a newer quote superseded this one
    $("swapOutAmt").value = fmt(ethers.formatUnits(amounts[1], swapOut.decimals));
    $("swapQuote").textContent = t("quoteOk")(`1 ${swapIn.symbol} = ${fmt(Number(ethers.formatUnits(amounts[1],swapOut.decimals))/Number(amt))} ${swapOut.symbol}`);
    shownQuote = { key: aIn+"|"+aOut+"|"+amtInRaw.toString(), outRaw: amounts[1] };
    // Price impact vs the pool's spot price, the guaranteed minimum at the
    // current slippage setting, and the 0.3% swap fee — all derived from the
    // SAME displayed quote the send is bound to (M-2), so they cannot drift
    // apart from what doSwap will enforce.
    try{
      const pc = new ethers.Contract(pair, PAIR_ABI, readProvider);
      const [t0, res] = await Promise.all([pc.token0(), pc.getReserves()]);
      if(seq === quoteSeq){
        const inIs0 = effAddr(swapIn).toLowerCase() === t0.toLowerCase();
        const rIn = inIs0 ? res[0] : res[1], rOut = inIs0 ? res[1] : res[0];
        const spot = Number(ethers.formatUnits(rOut, swapOut.decimals)) / Number(ethers.formatUnits(rIn, swapIn.decimals));
        const eff = Number(ethers.formatUnits(amounts[1], swapOut.decimals)) / Number(amt);
        const impact = Math.max(0, (1 - eff / spot) * 100);
        const impEl = $("swapImpact");
        impEl.textContent = t("priceImpact")(impact < 0.005 ? "≈0" : impact.toFixed(2)) + (impact > 3 ? " — " + t("impactHigh") : "");
        impEl.className = "quote" + (impact > 10 ? " impact-bad" : impact > 3 ? " impact-warn" : "");
        $("swapMinRecv").textContent = t("minRecv")(fmt(ethers.formatUnits(minOut(amounts[1], $("slippage").value || 0.5), swapOut.decimals)), swapOut.symbol);
        $("swapFee").textContent = t("feeLine")(fmt(Number(amt) * 0.003), swapIn.symbol);
      }
    }catch(e){ /* details are best-effort; the quote itself already stands */ }
    $("swapBtn").disabled = !account;
  }catch(e){
    if(seq !== quoteSeq) return;
    // A pair that exists but holds no liquidity reverts INSUFFICIENT_LIQUIDITY
    // inside getAmountsOut — that is still honestly "no pool / no liquidity".
    // Anything else (network, RPC, decode) is a quote FETCH failure.
    const msg = String((e && (e.shortMessage || e.message)) || "");
    $("swapQuote").textContent = /INSUFFICIENT_LIQUIDITY|INSUFFICIENT_OUTPUT_AMOUNT/.test(msg) ? t("noPool") : t("quoteFail");
    $("swapBtn").disabled = true;
  }
}
$("swapInAmt").addEventListener("input", quoteSwap);
// The QOMX in the list IS the native balance (0xD494 precompile), so gas is
// paid from the same coins being swapped. Percentage buttons therefore act
// on (balance - gas reserve) for QOMX, and MAX means "everything except the
// reserve". The reserve is a live swap-gas estimate x1.2 x gas price.
async function gasReserveWei(estGas){
  const fd = await readProvider.getFeeData();
  const gp = fd.gasPrice || 0n;
  return (estGas * 120n / 100n) * gp;
}
async function swapGasEstimate(){
  try{
    const r = new ethers.Contract(addrs.router, ROUTER_ABI, signer);
    const bal = await readProvider.getBalance(account);
    const probe = bal / 2n > 0n ? bal / 2n : bal;
    let est = await r.swapExactTokensForTokens.estimateGas(probe, 0n, [effAddr(swapIn), effAddr(swapOut)], account, deadline());
    const c = new ethers.Contract(swapIn.address, ERC20_ABI, readProvider);
    if(await c.allowance(account, addrs.router) < probe) est += 60000n; // first swap also pays the approve
    return est;
  }catch(e){ return 220000n; } // fallback if the swap cannot be estimated yet
}
async function spendable(tok, estGas){
  let base = await balOf(tok, account);
  if(base === null) return null;
  if(isQomx(tok)){
    const reserve = await gasReserveWei(estGas);
    base = base > reserve ? base - reserve : 0n;
  }
  return base;
}
async function setSwapPct(pct){
  if(!account) return;
  const st = $("swapStatus");
  try{
    const base = await spendable(swapIn, await swapGasEstimate());
    if(base === null) return;
    const amt = pct >= 100 ? base : base * BigInt(pct) / 100n;
    if(amt <= 0n){ st.textContent = t("insufficient"); return; }
    $("swapInAmt").value = ethers.formatUnits(amt, swapIn.decimals);
    st.textContent = "";
    quoteSwap();
  }catch(e){ st.textContent = t("failed")(e.shortMessage || e.message); }
}
document.querySelectorAll("#swapPctRow .pct-btn").forEach(b => b.onclick = () => setSwapPct(Number(b.dataset.pct)));
async function setLiqPct(pct){
  if(!account) return;
  const st = $("liqStatus");
  try{
    const base = await spendable(liqA, 260000n); // add-liquidity-sized gas estimate
    if(base === null) return;
    const amt = pct >= 100 ? base : base * BigInt(pct) / 100n;
    if(amt <= 0n){ st.textContent = t("insufficient"); return; }
    $("liqAAmt").value = ethers.formatUnits(amt, liqA.decimals);
    st.textContent = "";
    refreshLp(); scheduleLiq("A"); // ratio auto-fill sets the other side
  }catch(e){ st.textContent = t("failed")(e.shortMessage || e.message); }
}
document.querySelectorAll("#liqPctRow .pct-btn").forEach(b => b.onclick = () => setLiqPct(Number(b.dataset.lpct)));
// Flip button: swap the pair direction. The new input amount is the quote
// the user just saw (raw value, no locale commas), then a fresh quote runs.
$("swapFlip").onclick = ()=>{
  const prevOut = shownQuote ? shownQuote.outRaw : null;
  const prevOutTok = swapOut;
  [swapIn, swapOut] = [swapOut, swapIn];
  $("swapInAmt").value = prevOut !== null ? ethers.formatUnits(prevOut, prevOutTok.decimals) : "";
  renderTokButtons(); refreshBalances(); quoteSwap();
};

// L-2: visible warning for high slippage, and a labelled hard cap instead of
// the old silent 50% clamp inside minOut.
function checkSlippage(){
  const el = $("slipWarn"); if(!el) return;
  const info = slipInfo($("slippage").value);
  if(info.capped){ $("slippage").value = SLIP_MAX; el.textContent = t("slipCap")(SLIP_MAX); }
  else if(info.warn){ el.textContent = t("slipHigh"); }
  else el.textContent = "";
}
$("slippage").addEventListener("input", checkSlippage);
$("slippage").addEventListener("change", ()=>{ checkSlippage(); quoteSwap(); });

// Gas: every send sets gasLimit to exactly the estimate x1.2. The wallet's
// own estimate on this chain leaves no headroom, but padding further is
// wasteful because QOM charges at least 50% of the gas LIMIT per tx.
async function sendGas(fn, args, overrides){
  const ov = overrides || {};
  const est = await fn.estimateGas(...args, ov);
  return fn(...args, {...ov, gasLimit: est * 120n / 100n});
}
async function ensureApprove(tokAddr, spender, amount, statusEl){
  const c = new ethers.Contract(tokAddr, ERC20_ABI, signer);
  const al = await c.allowance(account, spender);
  if(al < amount){ statusEl.textContent = t("working"); const tx = await sendGas(c.approve, [spender, amount]); await tx.wait(); }
}
async function doSwap(){
  const st=$("swapStatus"); if(!account){ st.textContent=t("needConnect"); return; } if(!deployed()){ st.textContent=t("needDeployed"); return; }
  try{
    st.textContent=t("working");
    if(effAddr(swapIn)===effAddr(swapOut)){ st.textContent = t("useWrap"); return; }
    if(decOverflow($("swapInAmt").value, swapIn.decimals)){ st.textContent = t("tooManyDecimals")(swapIn.decimals); return; }
    const amtIn = ethers.parseUnits($("swapInAmt").value, swapIn.decimals);
    if(amtIn <= 0n){ st.textContent = t("insufficient"); return; }
    const balIn = await balOf(swapIn, account); if(balIn !== null && balIn < amtIn){ st.textContent = t("insufficient"); return; }
    const router = new ethers.Contract(addrs.router, ROUTER_ABI, signer);
    const slip = $("slippage").value || 0.5;
    // M-2: bind the send to the quote the user actually SAW (Guppy Bridge
    // v0.8.2 pattern). Re-quote now; if the achievable output has dropped
    // below the displayed quote minus slippage, abort BEFORE signing and
    // refresh the displayed quote. If it is equal or better, proceed with
    // outMin derived from the DISPLAYED quote, not the fresh one.
    const readRouter = new ethers.Contract(addrs.router, ROUTER_ABI, readProvider);
    const amounts = await readRouter.getAmountsOut(amtIn, [effAddr(swapIn), effAddr(swapOut)]);
    const key = effAddr(swapIn).toLowerCase()+"|"+effAddr(swapOut).toLowerCase()+"|"+amtIn.toString();
    const shown = (shownQuote && shownQuote.key === key) ? shownQuote.outRaw : null;
    if(driftAbort(shown, amounts[1], slip)){
      st.textContent = t("priceMoved")(fmt(ethers.formatUnits(shown, swapOut.decimals))+" "+swapOut.symbol, fmt(ethers.formatUnits(amounts[1], swapOut.decimals))+" "+swapOut.symbol);
      shownQuote = null; quoteSwap();
      return;
    }
    const outMin = minOut(shown !== null ? shown : amounts[1], slip);
    let tx;
    if(swapIn.address==="native") tx = await sendGas(router.swapExactETHForTokens, [outMin, [addrs.wqomx, effAddr(swapOut)], account, deadline()], {value: amtIn});
    else if(swapOut.address==="native"){ await ensureApprove(swapIn.address, addrs.router, amtIn, st); tx = await sendGas(router.swapExactTokensForETH, [amtIn, outMin, [swapIn.address, addrs.wqomx], account, deadline()]); }
    else {
      await ensureApprove(swapIn.address, addrs.router, amtIn, st);
      // Gas guard: when the input is QOMX (the native-balance token), the
      // gas is paid from the very balance being swapped. Refuse a send that
      // would leave too little behind to pay for itself.
      if(swapIn.address.toLowerCase() === String(CFG.qomxErc20||"").toLowerCase()){
        const est = await router.swapExactTokensForTokens.estimateGas(amtIn, outMin, [swapIn.address, swapOut.address], account, deadline());
        const reserve = await gasReserveWei(est);
        const nativeBal = await readProvider.getBalance(account);
        if(amtIn + reserve > nativeBal){ st.textContent = t("gasKeep")(fmt(ethers.formatEther(reserve))); return; }
      }
      tx = await sendGas(router.swapExactTokensForTokens, [amtIn, outMin, [swapIn.address, swapOut.address], account, deadline()]);
    }
    const r = await tx.wait(); st.textContent = t("done")(r.hash); refreshBalances(); quoteSwap();
  }catch(e){ st.textContent = t("failed")(e.shortMessage||e.message); }
}

async function loadPools(){
  const el = $("poolList"); if(!el || !deployed()) return;
  try{
    const f = new ethers.Contract(addrs.factory, FACTORY_ABI, readProvider);
    const n = Number(await f.allPairsLength());
    if(n===0){ el.innerHTML = ""; const p=document.createElement("p"); p.className="muted"; p.textContent = t("poolsNone"); el.appendChild(p); noteReadOk("pools"); return; }
    el.innerHTML = "";
    for(let i=0;i<n;i++){
      const pair = await f.allPairs(i);
      const pc = new ethers.Contract(pair, PAIR_ABI, readProvider);
      const [t0, t1, r] = await Promise.all([pc.token0(), pc.token1(), pc.getReserves()]);
      const sym = async a => { try{ return await new ethers.Contract(a, ERC20_ABI, readProvider).symbol(); }catch(e){ return a.slice(0,6)+"…"; } };
      const dec = async a => { try{ return Number(await new ethers.Contract(a, ERC20_ABI, readProvider).decimals()); }catch(e){ return 18; } };
      const [s0, s1, d0, d1] = await Promise.all([sym(t0), sym(t1), dec(t0), dec(t1)]);
      const row = document.createElement("div"); row.className = "pool-row";
      const a = document.createElement("a"); a.href = CFG.explorer + "/address/" + pair; a.target = "_blank"; a.rel = "noopener"; a.textContent = s0 + " / " + s1;
      const span = document.createElement("span"); span.textContent = fmt(ethers.formatUnits(r[0], d0)) + " " + s0 + " · " + fmt(ethers.formatUnits(r[1], d1)) + " " + s1;
      row.appendChild(a); row.appendChild(span); el.appendChild(row);
    }
    noteReadOk("pools");
  }catch(e){ noteReadFail("pools"); /* keep whatever is already rendered; the readWarn banner flags it as possibly stale */ }
}
$("swapBtn").onclick = doSwap;

async function refreshLp(){
  if(!deployed() || !account || effAddr(liqA)===effAddr(liqB)) { $("lpBal").textContent=""; $("liqRemoveBtn").disabled = true; return; }
  try{ const f=new ethers.Contract(addrs.factory, FACTORY_ABI, readProvider); const pair=await f.getPair(effAddr(liqA), effAddr(liqB)); if(pair===ethers.ZeroAddress){ $("lpBal").textContent=t("noPool"); $("liqRemoveBtn").disabled = true; noteReadOk("lp"); return; } const p=new ethers.Contract(pair, PAIR_ABI, readProvider); const b=await p.balanceOf(account); $("lpBal").textContent = t("lpBal")(fmt(ethers.formatEther(b)))+" · Pair: "+pair; $("liqRemoveBtn").disabled = b===0n; noteReadOk("lp"); }
  catch(e){ $("lpBal").textContent=""; noteReadFail("lp"); }
}
async function doAddLiq(){
  const st=$("liqStatus"); if(!account){ st.textContent=t("needConnect"); return; }
  try{
    st.textContent=t("working");
    if(effAddr(liqA)===effAddr(liqB)){ st.textContent = t("samePair"); return; }
    if(decOverflow($("liqAAmt").value, liqA.decimals) || decOverflow($("liqBAmt").value, liqB.decimals)){ st.textContent = t("tooManyDecimals")(decOverflow($("liqAAmt").value, liqA.decimals) ? liqA.decimals : liqB.decimals); return; }
    const aAmt=ethers.parseUnits($("liqAAmt").value, liqA.decimals), bAmt=ethers.parseUnits($("liqBAmt").value, liqB.decimals);
    if(aAmt <= 0n || bAmt <= 0n){ st.textContent = t("insufficient"); return; }
    // L-5: same pre-send balance check the swap path has (was missing here —
    // an under-funded add previously just reverted on-chain and cost gas).
    const balA = await balOf(liqA, account); if(balA !== null && balA < aAmt){ st.textContent = t("insufficientBal")(liqA.symbol); return; }
    const balB = await balOf(liqB, account); if(balB !== null && balB < bAmt){ st.textContent = t("insufficientBal")(liqB.symbol); return; }
    const router=new ethers.Contract(addrs.router, ROUTER_ABI, signer); const slip=$("slippage").value||0.5;
    let tx;
    if(liqA.address==="native"||liqB.address==="native"){
      const tok = liqA.address==="native"? liqB: liqA; const tokAmt = liqA.address==="native"? bAmt: aAmt; const ethAmt = liqA.address==="native"? aAmt: bAmt;
      await ensureApprove(tok.address, addrs.router, tokAmt, st);
      tx = await sendGas(router.addLiquidityETH, [tok.address, tokAmt, minOut(tokAmt,slip), minOut(ethAmt,slip), account, deadline()], {value: ethAmt});
    } else {
      await ensureApprove(liqA.address, addrs.router, aAmt, st); await ensureApprove(liqB.address, addrs.router, bAmt, st);
      tx = await sendGas(router.addLiquidity, [liqA.address, liqB.address, aAmt, bAmt, minOut(aAmt,slip), minOut(bAmt,slip), account, deadline()]);
    }
    const r=await tx.wait(); st.textContent=t("done")(r.hash); refreshLp();
  }catch(e){ st.textContent=t("failed")(e.shortMessage||e.message); }
}
$("liqBtn").onclick = doAddLiq;
// Ratio auto-fill: typing one side fills the other at the pool's current
// ratio (Router.quote), so an add cannot fail on a mismatched second amount
// after the approve gas is spent. Also shows the resulting pool share.
let liqSeq = 0, liqTimer = null;
async function liqReserves(){
  const f = new ethers.Contract(addrs.factory, FACTORY_ABI, readProvider);
  const pair = await f.getPair(effAddr(liqA), effAddr(liqB));
  if(pair === ethers.ZeroAddress) return null;
  const pc = new ethers.Contract(pair, PAIR_ABI, readProvider);
  const [t0, res, ts] = await Promise.all([pc.token0(), pc.getReserves(), pc.totalSupply()]);
  const aIs0 = effAddr(liqA).toLowerCase() === t0.toLowerCase();
  return { pair, resA: aIs0 ? res[0] : res[1], resB: aIs0 ? res[1] : res[0], ts };
}
async function updateLiqInfo(changed){
  const seq = ++liqSeq;
  const el = $("liqQuote"); if(!el) return;
  let info = null;
  try{ info = await liqReserves(); }catch(e){ info = null; }
  if(seq !== liqSeq) return;
  if(!info){ el.textContent = (liqAAmtVal() || liqBAmtVal()) ? t("firstLiq") : ""; return; }
  // auto-fill the side that was not just edited
  try{
    const router = new ethers.Contract(addrs.router, ROUTER_ABI, readProvider);
    if(changed === "A" && liqAAmtVal()){
      if(!decOverflow(liqAAmtVal(), liqA.decimals)){
        const aRaw = ethers.parseUnits(liqAAmtVal(), liqA.decimals);
        const bRaw = await router.quote(aRaw, info.resA, info.resB);
        if(seq === liqSeq) $("liqBAmt").value = ethers.formatUnits(bRaw, liqB.decimals);
      }
    } else if(changed === "B" && liqBAmtVal()){
      if(!decOverflow(liqBAmtVal(), liqB.decimals)){
        const bRaw = ethers.parseUnits(liqBAmtVal(), liqB.decimals);
        const aRaw = await router.quote(bRaw, info.resB, info.resA);
        if(seq === liqSeq) $("liqAAmt").value = ethers.formatUnits(aRaw, liqA.decimals);
      }
    }
  }catch(e){ /* ratio fill is best-effort */ }
  // pool share from the (possibly just filled) amounts
  try{
    const aRaw = liqAAmtVal() && !decOverflow(liqAAmtVal(), liqA.decimals) ? ethers.parseUnits(liqAAmtVal(), liqA.decimals) : 0n;
    const bRaw = liqBAmtVal() && !decOverflow(liqBAmtVal(), liqB.decimals) ? ethers.parseUnits(liqBAmtVal(), liqB.decimals) : 0n;
    if(aRaw > 0n && bRaw > 0n && info.resA > 0n && info.resB > 0n && info.ts > 0n){
      const liqFromA = aRaw * info.ts / info.resA, liqFromB = bRaw * info.ts / info.resB;
      const liq = liqFromA < liqFromB ? liqFromA : liqFromB;
      const share = Number(liq * 1000000n / (info.ts + liq)) / 10000;
      el.textContent = t("poolShare")(share < 0.01 ? "<0.01" : share.toFixed(2));
    } else el.textContent = "";
  }catch(e){ el.textContent = ""; }
}
function liqAAmtVal(){ return $("liqAAmt").value; }
function liqBAmtVal(){ return $("liqBAmt").value; }
function scheduleLiq(changed){ clearTimeout(liqTimer); liqTimer = setTimeout(()=>updateLiqInfo(changed), 350); }
$("liqAAmt").addEventListener("input", ()=>{ refreshLp(); scheduleLiq("A"); });
$("liqBAmt").addEventListener("input", ()=>{ refreshLp(); scheduleLiq("B"); });
async function doRemoveLiq(){
  const st=$("liqRemoveStatus"); if(!account){ st.textContent=t("needConnect"); return; }
  try{
    st.textContent=t("working");
    const f=new ethers.Contract(addrs.factory, FACTORY_ABI, readProvider); const pairAddr=await f.getPair(effAddr(liqA), effAddr(liqB));
    if(pairAddr===ethers.ZeroAddress){ st.textContent = t("noPool"); return; }
    const pair=new ethers.Contract(pairAddr, PAIR_ABI, signer); const bal=await pair.balanceOf(account);
    let pct = Math.floor(Number($("liqRemovePct").value||100)); if(!(pct>=1)) pct = 1; if(pct>100) pct = 100;
    const amt = bal * BigInt(pct) / 100n;
    if(amt <= 0n){ st.textContent = t("insufficient"); return; }
    const al=await pair.allowance(account, addrs.router); if(al<amt){ const txa=await sendGas(pair.approve, [addrs.router, amt]); await txa.wait(); }
    // slippage-protected minimums from the pair's live reserves and total supply
    const [res, ts, t0] = await Promise.all([pair.getReserves(), pair.totalSupply(), pair.token0()]);
    const exp0 = amt * res[0] / ts, exp1 = amt * res[1] / ts;
    const aIs0 = effAddr(liqA).toLowerCase() === t0.toLowerCase();
    const expA = aIs0 ? exp0 : exp1, expB = aIs0 ? exp1 : exp0;
    const slip = $("slippage").value || 0.5;
    const minA = minOut(expA, slip), minB = minOut(expB, slip);
    const router=new ethers.Contract(addrs.router, ROUTER_ABI, signer); let tx;
    if(liqA.address==="native"||liqB.address==="native"){ const tok=liqA.address==="native"?liqB:liqA; const minTok = liqA.address==="native"? minB : minA; const minEth = liqA.address==="native"? minA : minB; tx=await sendGas(router.removeLiquidityETH, [tok.address, amt, minTok, minEth, account, deadline()]); }
    else tx=await sendGas(router.removeLiquidity, [liqA.address, liqB.address, amt, minA, minB, account, deadline()]);
    const r=await tx.wait(); st.textContent=t("done")(r.hash); refreshLp(); loadPools();
  }catch(e){ st.textContent=t("failed")(e.shortMessage||e.message); }
}
$("liqRemoveBtn").onclick = doRemoveLiq;

init();
