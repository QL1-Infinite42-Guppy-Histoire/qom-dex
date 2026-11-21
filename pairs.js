const {ethers}=require('ethers');
const p=new ethers.JsonRpcProvider('https://rpc.qomx.io',33303);
const F='0x1cC5CeEaF98A3b4e2BB2731f960D63CBe0BA8BFC';
const f=new ethers.Contract(F,["function allPairsLength() view returns (uint256)","function allPairs(uint256) view returns (address)","function getPair(address,address) view returns (address)"],p);
const E=["function symbol() view returns (string)","function balanceOf(address) view returns (uint256)"];
(async()=>{
  const n=await f.allPairsLength(); console.log('allPairsLength:', n.toString());
  for(let i=0;i<Number(n);i++){
    const pair=await f.allPairs(i);
    const pc=new ethers.Contract(pair,["function token0() view returns (address)","function token1() view returns (address)","function getReserves() view returns (uint112,uint112,uint32)","function totalSupply() view returns (uint256)"],p);
    const [t0,t1,r,ts]=await Promise.all([pc.token0(),pc.token1(),pc.getReserves(),pc.totalSupply()]);
    const s0=await new ethers.Contract(t0,E,p).symbol().catch(()=>'?');
    const s1=await new ethers.Contract(t1,E,p).symbol().catch(()=>'?');
    console.log(`pair[${i}] ${pair} ${s0}(${t0.slice(0,8)}) / ${s1}(${t1.slice(0,8)}) reserves=${ethers.formatEther(r[0])} / ${ethers.formatEther(r[1])} LP supply=${ethers.formatEther(ts)}`);
  }
  const wq=await new ethers.Contract('0x7DF7DDe45772E01e99aB05F1977E926516271897',E,p).totalSupply().catch(()=>null);
  console.log('WQOMX totalSupply:', wq!==null?ethers.formatEther(wq):'n/a');
})().catch(e=>{console.error(e);process.exit(1)});
