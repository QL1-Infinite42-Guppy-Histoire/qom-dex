const {ethers}=require('ethers');
const p=new ethers.JsonRpcProvider('https://rpc.qomx.io',33303);
const W='0x7DF7DDe45772E01e99aB05F1977E926516271897', F='0x1cC5CeEaF98A3b4e2BB2731f960D63CBe0BA8BFC', R='0xD0199c4EA87e4CfCc221f2efBC9f161a1331B1F4';
(async()=>{
  for(const [n,a] of [['WQOMX',W],['Factory',F],['Router02',R]]){ const code=await p.getCode(a); console.log(n, a, 'code bytes', (code.length-2)/2); }
  const wq=new ethers.Contract(W, ["function name() view returns (string)","function symbol() view returns (string)","function decimals() view returns (uint8)","function totalSupply() view returns (uint256)"], p);
  console.log('WQOMX', await wq.name(), await wq.symbol(), (await wq.decimals()).toString(), 'supply', ethers.formatEther(await wq.totalSupply()));
  const f=new ethers.Contract(F, ["function feeTo() view returns (address)","function feeToSetter() view returns (address)","function allPairsLength() view returns (uint256)"], p);
  console.log('Factory feeTo', await f.feeTo(), 'feeToSetter', await f.feeToSetter(), 'pairs', (await f.allPairsLength()).toString());
  const r=new ethers.Contract(R, ["function factory() view returns (address)","function WETH() view returns (address)"], p);
  const rf=await r.factory(), rw=await r.WETH();
  console.log('Router factory', rf, 'match', rf.toLowerCase()===F.toLowerCase(), '| WETH', rw, 'match', rw.toLowerCase()===W.toLowerCase());
  // check deployer txs on scan api for WQOMX creation
  const res=await fetch(`https://scan.qomx.io/api/v2/addresses/${W}`); const j=await res.json();
  console.log('WQOMX creator tx', j.creation_transaction_hash, 'creator', j.creator_address_hash);
})().catch(e=>{console.error(e); process.exit(1)});
