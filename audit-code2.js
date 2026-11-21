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
  for(const [n,local,remote] of [['Factory',await fac.getAddress(),'0x1cC5CeEaF98A3b4e2BB2731f960D63CBe0BA8BFC'],['Router02',await rou.getAddress(),'0xD0199c4EA87e4CfCc221f2efBC9f161a1331B1F4']]){
    const lc=await prov.getCode(local); const rc=await p.getCode(remote);
    console.log(n,'local runtime',(lc.length-2)/2,'qom runtime',(rc.length-2)/2,'MATCH', lc.toLowerCase()===rc.toLowerCase());
  }
})().catch(e=>{console.error(e);process.exit(1)});
