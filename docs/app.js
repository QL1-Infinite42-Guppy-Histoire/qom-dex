/* Qom DEX frontend — Uniswap V2 on Qom chain (33303). No backend; all calls go wallet/RPC direct. */
"use strict";
const CFG = window.DEX_CONFIG;
const $ = id => document.getElementById(id);
const ERC20_ABI = ["function symbol() view returns (string)","function decimals() view returns (uint8)","function balanceOf(address) view returns (uint256)","function allowance(address,address) view returns (uint256)","function approve(address,uint256) returns (bool)","function transfer(address,uint256) returns (bool)"];
const ROUTER_ABI = ["function getAmountsOut(uint256,address[]) view returns (uint256[])","function swapExactETHForTokens(uint256,address[],address,uint256) payable returns (uint256[])","function swapExactTokensForETH(uint256,uint256,address[],address,uint256) returns (uint256[])","function swapExactTokensForTokens(uint256,uint256,address[],address,uint256) returns (uint256[])","function addLiquidity(address,address,uint256,uint256,uint256,uint256,address,uint256) returns (uint256,uint256,uint256)","function addLiquidityETH(address,uint256,uint256,uint256,address,uint256) payable returns (uint256,uint256,uint256)","function removeLiquidity(address,address,uint256,uint256,uint256,address,uint256) returns (uint256,uint256)","function removeLiquidityETH(address,uint256,uint256,uint256,address,uint256) returns (uint256,uint256)","function factory() view returns (address)","function WETH() view returns (address)"];
const FACTORY_ABI = ["function getPair(address,address) view returns (address)","function feeTo() view returns (address)","function feeToSetter() view returns (address)","function setFeeToSetter(address)","function allPairsLength() view returns (uint256)","function allPairs(uint256) view returns (address)"];
const PAIR_ABI = ["function getReserves() view returns (uint112,uint112,uint32)","function balanceOf(address) view returns (uint256)","function allowance(address,address) view returns (uint256)","function approve(address,uint256) returns (bool)","function totalSupply() view returns (uint256)","function token0() view returns (address)","function token1() view returns (address)"];
const WQOMX_ABI = ["function deposit() payable","function withdraw(uint256)","function balanceOf(address) view returns (uint256)"];

const I18N = {
  en:{tabSwap:"Swap",tabPool:"Pool",tabWrap:"Wrap",tabDeploy:"Deploy",youPay:"You pay",youReceive:"You receive (estimated)",slippage:"Slippage %",connect:"Connect Wallet",connected:"Connected",wrongNet:"Wrong network — click Connect to switch to Qom (33303).",notDeployed:"The DEX contracts are not configured in this build.",pickToken:"Pick a token",importBtn:"Import",addLiq:"Add liquidity",removeLiq:"Remove liquidity",pairLabel:"Pair (Token A / Token B above)",wrapNote:"QOMX ⇄ WQOMX is always 1:1. WQOMX is the ERC-20 form of QOMX used by the DEX.",wrapBtn:"Wrap",unwrapBtn:"Unwrap",deployTitle:"Deploy the DEX (one time)",deployNote:"Deploys WQOMX → Factory → Router02 from YOUR wallet. You sign each step; nobody else holds the keys. feeTo stays unset (protocol fee OFF), feeToSetter = your address. Estimated total gas ≈ 8.5M gas — at the chain's current gas price that is roughly 460 QOMX, so prepare at least 600 QOMX in the deploying wallet.",handoffTitle:"Addresses for Teh Fund / pool creators",copyBtn:"Copy",noPool:"No pool / no liquidity for this pair yet — quote unavailable. Create it in the Pool tab.",quoteOk:(r)=>`Rate ≈ ${r}`,needConnect:"Connect your wallet first.",needDeployed:"Contracts not configured in this build.",working:"Working… check your wallet.",done:(h)=>`Done ✓ tx: ${h}`,failed:(m)=>`Failed: ${m}`,bal:(b,s)=>`Balance: ${b} ${s}`,lpBal:(b)=>`Your LP balance: ${b}`,insufficient:"Amount exceeds your balance / allowance flow failed.",useWrap:"QOMX ⇄ WQOMX is 1:1 — use the Wrap tab, not Swap.",samePair:"Pick two different tokens for a pair.",tag_official:"official ERC-20",poolsTitle:"Pools on this DEX",devNotice:"🚧 Development stage — community-built beta. No pools are live yet and the first real swap has not been done. Use at your own risk.",adminTitle:"Factory admin",adminCur:"Current feeToSetter",adminFeeTo:"Protocol fee recipient (feeTo)",feeToUnset:"unset",adminNew:"New feeToSetter address",adminNote:"This only hands over the right to set the protocol fee in future. The fee recipient stays unset and no funds move. One signature from the current feeToSetter wallet.",adminBtn:"Transfer feeToSetter role",adminDone:"Done. The new feeToSetter is now:",adminBadAddr:"That address is not valid.",poolsNone:"No pools yet — create the first one above.",openInMM:"Open this page in MetaMask",noWallet:"No wallet found in this browser. Open this page inside MetaMask (or install MetaMask), then tap Connect Wallet.",tag_wrapped:"wrapped",tag_native:"via WQOMX",qomxNote:"QOMX in the list is the official ERC-20 contract (0xD494…0517): its balance IS your native QOMX balance — the same coins, spendable directly. WQOMX is a separate wrapped token; WQOMX pools keep working exactly as before. Nothing was moved or changed on-chain."},
  ja:{tabSwap:"スワップ",tabPool:"プール",tabWrap:"ラップ",tabDeploy:"デプロイ",youPay:"支払う",youReceive:"受け取る（見込み）",slippage:"スリッページ %",connect:"ウォレット接続",connected:"接続済み",wrongNet:"ネットワークが違います —「ウォレット接続」から Qom (33303) に切り替えてください。",notDeployed:"DEXコントラクトがこのビルドに設定されていません。",pickToken:"トークンを選ぶ",importBtn:"追加",addLiq:"流動性を追加",removeLiq:"流動性を削除",pairLabel:"ペア（上の Token A / Token B）",wrapNote:"QOMX ⇄ WQOMX は常に 1:1。WQOMX は DEX で使う QOMX の ERC-20 版です。",wrapBtn:"ラップ",unwrapBtn:"アンラップ",deployTitle:"DEXをデプロイ（初回のみ）",deployNote:"あなたのウォレットから WQOMX → Factory → Router02 の順にデプロイします。各ステップであなたが署名し、鍵は誰にも渡りません。feeTo は未設定（プロトコル手数料OFF）、feeToSetter はあなたのアドレスです。ガス見積もり合計 ≈ 850万 gas — 現在のガス価格では約460 QOMX になるため、デプロイ用ウォレットには 600 QOMX 以上を用意してください。",handoffTitle:"Teh Fund / プール作成者向けアドレス一覧",copyBtn:"コピー",noPool:"このペアのプール／流動性がまだ無いため見積もりできません。「プール」タブで作成できます。",quoteOk:(r)=>`レート ≈ ${r}`,needConnect:"先にウォレットを接続してください。",needDeployed:"コントラクトがこのビルドに設定されていません。",working:"処理中… ウォレットを確認してください。",done:(h)=>`完了 ✓ tx: ${h}`,failed:(m)=>`失敗: ${m}`,bal:(b,s)=>`残高: ${b} ${s}`,lpBal:(b)=>`あなたのLP残高: ${b}`,insufficient:"残高不足、または承認フローに失敗しました。",useWrap:"QOMX ⇄ WQOMX は 1:1 です — スワップではなく「ラップ」タブを使ってください。",samePair:"ペアには異なる2つのトークンを選んでください。",tag_official:"公式 ERC-20",poolsTitle:"このDEXのプール",devNotice:"🚧 開発段階です — コミュニティによるベータ版。プールはまだ開始しておらず、初回の実スワップも未実施です。利用は自己責任でお願いします。",adminTitle:"Factory 管理",adminCur:"現在の feeToSetter",adminFeeTo:"プロトコル手数料の受取先（feeTo）",feeToUnset:"未設定",adminNew:"新しい feeToSetter のアドレス",adminNote:"これは将来プロトコル手数料を設定できる権限を移すだけです。受取先は未設定のままで、資金は一切動きません。現在の feeToSetter のウォレットで署名1回です。",adminBtn:"feeToSetter 権限を移転する",adminDone:"完了しました。新しい feeToSetter：",adminBadAddr:"アドレスの形式が正しくありません。",poolsNone:"プールはまだありません — 上で最初のプールを作れます。",openInMM:"MetaMaskでこのページを開く",noWallet:"このブラウザにウォレットが見つかりません。MetaMaskの中でこのページを開く（またはMetaMaskを入れる）→「ウォレット接続」を押してください。",tag_wrapped:"ラップ済み",tag_native:"WQOMX 経由",qomxNote:"リストの QOMX は公式 ERC-20 コントラクト（0xD494…0517）です。残高はネイティブ QOMX の残高そのもの（同じコイン）で、そのまま使えます。WQOMX は別のラップ済みトークンで、WQOMX のプールは今まで通り動き続けます。チェーン上のものは何も移動・変更していません。"}
};
let lang = localStorage.getItem("qomdex-lang") || "en";
const t = k => I18N[lang][k];

let readProvider, provider, signer, account = null;
let addrs = loadAddrs();
function loadAddrs(){
  const ls = JSON.parse(localStorage.getItem("qomdex-addrs") || "{}");
  return { factory: CFG.factory || ls.factory || "", router: CFG.router || ls.router || "", wqomx: CFG.wqomx || ls.wqomx || "" };
}
function saveAddrs(){ localStorage.setItem("qomdex-addrs", JSON.stringify(addrs)); refreshDeployedUI(); }
const deployed = () => !!(addrs.factory && addrs.router && addrs.wqomx);

let customTokens = JSON.parse(localStorage.getItem("qomdex-tokens") || "[]");
function tokenList(){
  const list = [];
  if(CFG.qomxErc20) list.push({symbol:"QOMX", address:CFG.qomxErc20, decimals:18, tag:"official"});
  if(addrs.wqomx) list.push({symbol:"WQOMX", address:addrs.wqomx, decimals:18, tag:"wrapped"});
  return list.concat(customTokens.filter(ct => !list.some(x=>x.address.toLowerCase()===ct.address.toLowerCase())));
}
let swapIn = tokenList()[0], swapOut = tokenList()[1] || tokenList()[0];
let liqA = tokenList()[0], liqB = tokenList()[1] || tokenList()[0];

function fmt(n, d=6){ if(n===null||n===undefined||isNaN(n)) return "0"; return Number(n).toLocaleString("en-US",{maximumFractionDigits:d}); }
function deadline(){ return BigInt(Math.floor(Date.now()/1000)+1200); }
function minOut(amount, slipPct){ let s = Number(slipPct); if(!(s>=0)) s = 0; if(s>50) s = 50; const bps = BigInt(Math.round((100 - s)*100)); return amount * bps / 10000n; }

async function init(){
  readProvider = new ethers.JsonRpcProvider(CFG.rpcUrl, CFG.chainId);
  applyLang(); refreshDeployedUI(); renderTokButtons();
  try{ const n = await readProvider.getNetwork(); console.log("RPC chain", n.chainId.toString()); }catch(e){ $("netNotice").hidden=false; $("netNotice").textContent = "RPC unreachable: "+CFG.rpcUrl; }
  const wireEth = ()=>{ if(window.ethereum && !provider){ provider = new ethers.BrowserProvider(window.ethereum); window.ethereum.on?.("accountsChanged", ()=>location.reload()); window.ethereum.on?.("chainChanged", ()=>location.reload()); $("mmOpen").hidden = true; } };
  wireEth();
  window.addEventListener("ethereum#initialized", wireEth, {once:true});
  setTimeout(()=>{ if(!window.ethereum){ $("netNotice").hidden=false; $("netNotice").textContent = t("noWallet"); $("mmOpen").hidden = false; } }, 1200);
  loadPools();
}
function refreshDeployedUI(){
  $("notDeployed").hidden = deployed();
  if(!deployed()) $("notDeployed").textContent = t("notDeployed");
  const dis = !deployed();
  $("swapBtn").disabled = dis; $("liqBtn").disabled = dis; $("liqRemoveBtn").disabled = dis; $("wrapBtn").disabled = dis || !addrs.wqomx; $("unwrapBtn").disabled = dis || !addrs.wqomx;
  renderTokButtons();
}
function applyLang(){
  document.querySelectorAll("[data-i18n]").forEach(el=>{ const k=el.dataset.i18n; if(I18N[lang][k]) el.textContent = I18N[lang][k]; });
  $("langBtn").textContent = lang==="en" ? "日本語" : "English";
  if(!account) $("connectBtn").textContent = t("connect");
  refreshDeployedUI();
}
$("langBtn").onclick = ()=>{ lang = lang==="en"?"ja":"en"; localStorage.setItem("qomdex-lang", lang); applyLang(); };
$("themeBtn").onclick = ()=>{ const d = document.documentElement.dataset.theme==="dark"; document.documentElement.dataset.theme = d?"":"dark"; localStorage.setItem("guppy-theme", d?"light":"dark"); $("themeBtn").textContent = d?"🌙 Dark":"☀️ Light"; };

document.querySelectorAll(".tab").forEach(b=> b.onclick = ()=>{ document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active")); b.classList.add("active"); ["swap","pool","wrap"].forEach(k=> $("tab-"+k).hidden = k!==b.dataset.tab); });

async function connect(){
  if(!window.ethereum){ $("netNotice").hidden=false; $("netNotice").textContent = t("noWallet"); $("mmOpen").hidden = false; return; }
  provider = new ethers.BrowserProvider(window.ethereum);
  const hexId = "0x"+CFG.chainId.toString(16);
  const addParams = [{chainId:hexId, chainName:CFG.chainName, nativeCurrency:{name:"QOMX",symbol:"QOMX",decimals:18}, rpcUrls:[CFG.rpcUrl], blockExplorerUrls:[CFG.explorer]}];
  // MetaMask mobile wraps the 4902 "chain not added" error so ethers shows
  // only "could not coalesce error" and the code is lost. Do NOT branch on
  // the switch error: on ANY switch failure, add the chain via the raw
  // provider request, then switch again.
  try{ await window.ethereum.request({method:"wallet_switchEthereumChain", params:[{chainId:hexId}]}); }
  catch(switchErr){
    await window.ethereum.request({method:"wallet_addEthereumChain", params:addParams});
    await window.ethereum.request({method:"wallet_switchEthereumChain", params:[{chainId:hexId}]});
  }
  signer = await provider.getSigner(); account = await signer.getAddress();
  $("connectBtn").textContent = t("connected")+": "+account.slice(0,6)+"…"+account.slice(-4);
  refreshDeployedUI(); refreshBalances(); quoteSwap(); refreshLp(); checkAdmin();
}
$("connectBtn").onclick = ()=> connect().catch(e=>{ $("netNotice").hidden=false; $("netNotice").textContent = t("failed")(e.shortMessage||e.message); });

function renderTokButtons(){
  $("swapInTok").textContent = swapIn.symbol+" ▾"; $("swapOutTok").textContent = swapOut.symbol+" ▾";
  $("liqATok").textContent = liqA.symbol+" ▾"; $("liqBTok").textContent = liqB.symbol+" ▾";
}
let pickerTarget = null;
function openPicker(setter){ pickerTarget = setter; const list=$("tokList"); list.innerHTML=""; tokenList().forEach(tok=>{ const b=document.createElement("button"); b.className="tok-btn"; b.textContent=`${tok.symbol}${tok.tag?" ("+t("tag_"+tok.tag)+")":""} — ${tok.address==="native"?"native":tok.address.slice(0,10)+"…"}`; b.onclick=()=>{ setter(tok); $("tokDlg").close(); renderTokButtons(); quoteSwap(); refreshBalances(); refreshLp(); }; list.appendChild(b); }); $("tokDlg").showModal(); }
$("swapInTok").onclick=()=>openPicker(v=>swapIn=v); $("swapOutTok").onclick=()=>openPicker(v=>swapOut=v);
$("liqATok").onclick=()=>openPicker(v=>liqA=v); $("liqBTok").onclick=()=>openPicker(v=>liqB=v);
$("tokClose").onclick=()=>$("tokDlg").close();
$("addTokBtn").onclick = async ()=>{
  const a = $("customTokAddr").value.trim();
  try{ const c = new ethers.Contract(a, ERC20_ABI, readProvider); const [s,d] = await Promise.all([c.symbol(), c.decimals()]); const tok={symbol:s, address:a, decimals:Number(d)}; customTokens.push(tok); localStorage.setItem("qomdex-tokens", JSON.stringify(customTokens)); $("tokStatus").textContent = "✓ "+s; if(pickerTarget) pickerTarget(tok); renderTokButtons(); }
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
  for(const [tok,el] of [[swapIn,"swapInBal"],[swapOut,"swapOutBal"]]){ try{ const b=await balOf(tok,account); $(el).textContent = t("bal")(fmt(ethers.formatUnits(b, tok.decimals)), tok.symbol); }catch(e){ $(el).textContent=""; } }
}
async function quoteSwap(){
  const amt = $("swapInAmt").value; $("swapQuote").textContent=""; $("swapOutAmt").value="";
  if(!deployed() || !amt || Number(amt)<=0 || swapIn.address===swapOut.address) return;
  if(effAddr(swapIn)===effAddr(swapOut)){ $("swapQuote").textContent = t("useWrap"); $("swapBtn").disabled = true; return; }
  try{
    const router = new ethers.Contract(addrs.router, ROUTER_ABI, readProvider);
    const amounts = await router.getAmountsOut(ethers.parseUnits(amt, swapIn.decimals), [effAddr(swapIn), effAddr(swapOut)]);
    $("swapOutAmt").value = fmt(ethers.formatUnits(amounts[1], swapOut.decimals));
    $("swapQuote").textContent = t("quoteOk")(`1 ${swapIn.symbol} = ${fmt(Number(ethers.formatUnits(amounts[1],swapOut.decimals))/Number(amt))} ${swapOut.symbol}`);
    $("swapBtn").disabled = !account;
  }catch(e){ $("swapQuote").textContent = t("noPool"); $("swapBtn").disabled = true; }
}
$("swapInAmt").addEventListener("input", quoteSwap);

async function ensureApprove(tokAddr, spender, amount, statusEl){
  const c = new ethers.Contract(tokAddr, ERC20_ABI, signer);
  const al = await c.allowance(account, spender);
  if(al < amount){ statusEl.textContent = t("working"); const tx = await c.approve(spender, amount); await tx.wait(); }
}
async function doSwap(){
  const st=$("swapStatus"); if(!account){ st.textContent=t("needConnect"); return; } if(!deployed()){ st.textContent=t("needDeployed"); return; }
  try{
    st.textContent=t("working");
    if(effAddr(swapIn)===effAddr(swapOut)){ st.textContent = t("useWrap"); return; }
    const amtIn = ethers.parseUnits($("swapInAmt").value, swapIn.decimals);
    const router = new ethers.Contract(addrs.router, ROUTER_ABI, signer);
    const amounts = await router.getAmountsOut(amtIn, [effAddr(swapIn), effAddr(swapOut)]);
    const outMin = minOut(amounts[1], $("slippage").value || 0.5);
    let tx;
    if(swapIn.address==="native") tx = await router.swapExactETHForTokens(outMin, [addrs.wqomx, effAddr(swapOut)], account, deadline(), {value: amtIn});
    else if(swapOut.address==="native"){ await ensureApprove(swapIn.address, addrs.router, amtIn, st); tx = await router.swapExactTokensForETH(amtIn, outMin, [swapIn.address, addrs.wqomx], account, deadline()); }
    else { await ensureApprove(swapIn.address, addrs.router, amtIn, st); tx = await router.swapExactTokensForTokens(amtIn, outMin, [swapIn.address, swapOut.address], account, deadline()); }
    const r = await tx.wait(); st.textContent = t("done")(r.hash); refreshBalances(); quoteSwap();
  }catch(e){ st.textContent = t("failed")(e.shortMessage||e.message); }
}

async function loadPools(){
  const el = $("poolList"); if(!el || !deployed()) return;
  try{
    const f = new ethers.Contract(addrs.factory, FACTORY_ABI, readProvider);
    const n = Number(await f.allPairsLength());
    if(n===0){ el.innerHTML = ""; const p=document.createElement("p"); p.className="muted"; p.textContent = t("poolsNone"); el.appendChild(p); return; }
    el.innerHTML = "";
    for(let i=0;i<n;i++){
      const pair = await f.allPairs(i);
      const pc = new ethers.Contract(pair, PAIR_ABI, readProvider);
      const [t0, t1, r] = await Promise.all([pc.token0(), pc.token1(), pc.getReserves()]);
      const sym = async a => { try{ return await new ethers.Contract(a, ERC20_ABI, readProvider).symbol(); }catch(e){ return a.slice(0,6)+"…"; } };
      const [s0, s1] = await Promise.all([sym(t0), sym(t1)]);
      const row = document.createElement("div"); row.className = "pool-row";
      const a = document.createElement("a"); a.href = CFG.explorer + "/address/" + pair; a.target = "_blank"; a.rel = "noopener"; a.textContent = s0 + " / " + s1;
      const span = document.createElement("span"); span.textContent = fmt(ethers.formatEther(r[0])) + " " + s0 + " · " + fmt(ethers.formatEther(r[1])) + " " + s1;
      row.appendChild(a); row.appendChild(span); el.appendChild(row);
    }
  }catch(e){ /* leave as-is */ }
}
$("swapBtn").onclick = doSwap;

async function refreshLp(){
  if(!deployed() || !account || effAddr(liqA)===effAddr(liqB)) { $("lpBal").textContent=""; $("liqRemoveBtn").disabled = true; return; }
  try{ const f=new ethers.Contract(addrs.factory, FACTORY_ABI, readProvider); const pair=await f.getPair(effAddr(liqA), effAddr(liqB)); if(pair===ethers.ZeroAddress){ $("lpBal").textContent=t("noPool"); $("liqRemoveBtn").disabled = true; return; } const p=new ethers.Contract(pair, PAIR_ABI, readProvider); const b=await p.balanceOf(account); $("lpBal").textContent = t("lpBal")(fmt(ethers.formatEther(b)))+" · Pair: "+pair; $("liqRemoveBtn").disabled = b===0n; }
  catch(e){ $("lpBal").textContent=""; }
}
async function doAddLiq(){
  const st=$("liqStatus"); if(!account){ st.textContent=t("needConnect"); return; }
  try{
    st.textContent=t("working");
    if(effAddr(liqA)===effAddr(liqB)){ st.textContent = t("samePair"); return; }
    const aAmt=ethers.parseUnits($("liqAAmt").value, liqA.decimals), bAmt=ethers.parseUnits($("liqBAmt").value, liqB.decimals);
    const router=new ethers.Contract(addrs.router, ROUTER_ABI, signer); const slip=$("slippage").value||0.5;
    let tx;
    if(liqA.address==="native"||liqB.address==="native"){
      const tok = liqA.address==="native"? liqB: liqA; const tokAmt = liqA.address==="native"? bAmt: aAmt; const ethAmt = liqA.address==="native"? aAmt: bAmt;
      await ensureApprove(tok.address, addrs.router, tokAmt, st);
      tx = await router.addLiquidityETH(tok.address, tokAmt, minOut(tokAmt,slip), minOut(ethAmt,slip), account, deadline(), {value: ethAmt});
    } else {
      await ensureApprove(liqA.address, addrs.router, aAmt, st); await ensureApprove(liqB.address, addrs.router, bAmt, st);
      tx = await router.addLiquidity(liqA.address, liqB.address, aAmt, bAmt, minOut(aAmt,slip), minOut(bAmt,slip), account, deadline());
    }
    const r=await tx.wait(); st.textContent=t("done")(r.hash); refreshLp();
  }catch(e){ st.textContent=t("failed")(e.shortMessage||e.message); }
}
$("liqBtn").onclick = doAddLiq;
$("liqAAmt").addEventListener("input", refreshLp); $("liqBAmt").addEventListener("input", refreshLp);
async function doRemoveLiq(){
  const st=$("liqRemoveStatus"); if(!account){ st.textContent=t("needConnect"); return; }
  try{
    st.textContent=t("working");
    const f=new ethers.Contract(addrs.factory, FACTORY_ABI, readProvider); const pairAddr=await f.getPair(effAddr(liqA), effAddr(liqB));
    const pair=new ethers.Contract(pairAddr, PAIR_ABI, signer); const bal=await pair.balanceOf(account);
    let pct = Math.floor(Number($("liqRemovePct").value||100)); if(!(pct>=1)) pct = 1; if(pct>100) pct = 100;
    const amt = bal * BigInt(pct) / 100n;
    const al=await pair.allowance(account, addrs.router); if(al<amt){ const txa=await pair.approve(addrs.router, amt); await txa.wait(); }
    const router=new ethers.Contract(addrs.router, ROUTER_ABI, signer); let tx;
    if(liqA.address==="native"||liqB.address==="native"){ const tok=liqA.address==="native"?liqB:liqA; tx=await router.removeLiquidityETH(tok.address, amt, 0, 0, account, deadline()); }
    else tx=await router.removeLiquidity(liqA.address, liqB.address, amt, 0, 0, account, deadline());
    const r=await tx.wait(); st.textContent=t("done")(r.hash); refreshLp(); loadPools();
  }catch(e){ st.textContent=t("failed")(e.shortMessage||e.message); }
}
$("liqRemoveBtn").onclick = doRemoveLiq;

$("wrapBtn").onclick = async ()=>{ const st=$("wrapStatus"); try{ st.textContent=t("working"); const w=new ethers.Contract(addrs.wqomx, WQOMX_ABI, signer); const tx=await w.deposit({value: ethers.parseEther($("wrapAmt").value)}); const r=await tx.wait(); st.textContent=t("done")(r.hash); }catch(e){ st.textContent=t("failed")(e.shortMessage||e.message); } };
$("unwrapBtn").onclick = async ()=>{ const st=$("wrapStatus"); try{ st.textContent=t("working"); const w=new ethers.Contract(addrs.wqomx, WQOMX_ABI, signer); const tx=await w.withdraw(ethers.parseEther($("unwrapAmt").value)); const r=await tx.wait(); st.textContent=t("done")(r.hash); }catch(e){ st.textContent=t("failed")(e.shortMessage||e.message); } };

init();
