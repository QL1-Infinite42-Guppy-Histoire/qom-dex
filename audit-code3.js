const {ethers}=require('ethers');
const ganache=require('ganache');
const fs=require('fs');
function norm(n){const a=JSON.parse(fs.readFileSync('artifacts/'+n+'.json','utf8')); return {abi:a.abi, bytecode: a.bytecode.startsWith('0x')?a.bytecode:'0x'+a.bytecode};}
(async()=>{
  const prov=new ethers.BrowserProvider(ganache.provider({logging:{quiet:true}}));
  const s=await prov.getSigner(); const me=await s.getAddress();
  const wqA=JSON.parse(fs.readFileSync('artifacts/WQOMX.json','utf8'));
  const wq=await (await new ethers.ContractFactory(wqA.abi,wqA.bytecode,s).deploy()).waitForDeployment();
  const F=norm('UniswapV2Factory'), R=norm('UniswapV2Router02');
  const fac=await (await new ethers.ContractFactory(F.abi,F.bytecode,s).deploy(me)).waitForDeployment();
  const rou=await (await new ethers.ContractFactory(R.abi,R.bytecode,s).deploy(await fac.getAddress(), await wq.getAddress())).waitForDeployment();
  const p=new ethers.JsonRpcProvider('https://rpc.qomx.io',33303);
  let lc=(await prov.getCode(await rou.getAddress())).toLowerCase();
  let rc=(await p.getCode('0xD0199c4EA87e4CfCc221f2efBC9f161a1331B1F4')).toLowerCase();
  // mask the two immutable address slots: replace local addrs in lc and qom addrs in rc with placeholder
  const lf=(await fac.getAddress()).toLowerCase().slice(2), lw=(await wq.getAddress()).toLowerCase().slice(2);
  const qf='1cc5ce eaf98a3b4e2bb2731f960d63cbe0ba8bfc'.replace(/ /g,''), qw='7df7dde45772e01e99ab05f1977e926516271897';
  const mask=(code,a,b)=>code.split(a).join('X'.repeat(40)).split(b).join('Y'.repeat(40));
  const lm=mask(lc,lf,lw), rm=mask(rc,qf,qw);
  console.log('local contains its factory/wqomx immutables:', lc.includes(lf), lc.includes(lw));
  console.log('qom contains qom factory/wqomx immutables:', rc.includes(qf), rc.includes(qw));
  console.log('after masking addresses, runtimes identical:', lm===rm);
})().catch(e=>{console.error(e);process.exit(1)});
