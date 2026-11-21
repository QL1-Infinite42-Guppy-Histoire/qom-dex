const {ethers}=require('ethers');
const p=new ethers.JsonRpcProvider('https://rpc.qomx.io',33303);
const A='0xD4949664cD82660AaE99bEdc034a0deA8A0bd517';
const ERC20=["function name() view returns (string)","function symbol() view returns (string)","function decimals() view returns (uint8)","function totalSupply() view returns (uint256)","function balanceOf(address) view returns (uint256)","function allowance(address,address) view returns (uint256)"];
(async()=>{
  const code=await p.getCode(A); console.log('code bytes:',(code.length-2)/2);
  const c=new ethers.Contract(A,ERC20,p);
  for(const f of ['name','symbol','decimals','totalSupply']){ try{ const v=await c[f](); console.log(f,'=',v.toString()); }catch(e){ console.log(f,'FAILED', e.shortMessage||e.message);} }
  const probes=[['CEX hot','0xF9C3b5e63416ed9e4dB661B10D66e1bAeC6b6c83'],['deployer','0xa33e223BCF1BB82D475ea29a11f3ADD9c2E73A23'],['validator','0x385BE93570680703A12d0406ed534dAc7Af601fb'],['factory','0x1cC5CeEaF98A3b4e2BB2731f960D63CBe0BA8BFC']];
  for(const [n,a] of probes){
    const native=await p.getBalance(a); let erc=null; try{ erc=await c.balanceOf(a);}catch(e){}
    console.log(n, 'native=', ethers.formatEther(native), '| erc20 balanceOf=', erc===null?'FAILED':ethers.formatEther(erc), '| EQUAL:', erc!==null && erc===native);
  }
})().catch(e=>{console.error(e);process.exit(1)});
