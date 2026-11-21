const {ethers}=require('ethers');
const fs=require('fs');
const RPC='https://rpc.qomx.io';
const p=new ethers.JsonRpcProvider(RPC,33303);
const FROM='0x385BE93570680703A12d0406ed534dAc7Af601fb'; // validator/miner seen on scan, used only as estimateGas `from`
function art(path){const a=require(path); return {abi:a.abi, bytecode: a.bytecode.startsWith('0x')?a.bytecode:'0x'+a.bytecode};}
async function est(name, bytecode, args=[]){
  const f=new ethers.ContractFactory([], bytecode); // abi not needed for deploy data encoding manually
  let data=bytecode;
  if(args.length){ const c=new ethers.AbiCoder(); /* handled by caller */ }
  try{ const g=await p.estimateGas({from:FROM, data}); console.log(name,'estimateGas OK', g.toString()); return true; }
  catch(e){ console.log(name,'estimateGas FAILED:', (e.shortMessage||e.message||'').slice(0,300)); return false; }
}
(async()=>{
  console.log('chainId', (await p.getNetwork()).chainId.toString(), 'block', await p.getBlockNumber(), 'from balance QOMX', ethers.formatEther(await p.getBalance(FROM)));
  const wq=JSON.parse(fs.readFileSync('artifacts/WQOMX.json','utf8'));
  await est('WQOMX (solc 0.8.20, paris)', wq.bytecode);
  const fac=art('@uniswap/v2-core/build/UniswapV2Factory.json');
  const facData=fac.bytecode + new ethers.AbiCoder().encode(['address'],[FROM]).slice(2);
  await est('UniswapV2Factory (solc 0.5.16)', facData);
  const rou=art('@uniswap/v2-periphery/build/UniswapV2Router02.json');
  const rouData=rou.bytecode + new ethers.AbiCoder().encode(['address','address'],['0x0000000000000000000000000000000000001000','0x0000000000000000000000000000000000002000']).slice(2);
  await est('UniswapV2Router02 (solc 0.6.6)', rouData);
  // PUSH0 probe: compile-free handcrafted creation code that executes PUSH0 in init? Simpler: runtime probe via eth_call on a deployed-like code is not possible; use estimateGas with init code returning runtime containing PUSH0 (0x5f) executed: init: PUSH1 1 PUSH1 0x0b? Keep simple: creation code that runs PUSH0 then STOP then returns empty runtime via estimate of a contract whose constructor executes PUSH0:
  // initcode: 5f 00 (PUSH0; STOP) as constructor executed -> if EVM < Shanghai, invalid opcode.
  await est('PUSH0 probe (initcode 0x5f00)', '0x5f00');
  // Pair creation is done by factory internally; also direct-estimate pair bytecode (constructor takes factory address)
  const pair=art('@uniswap/v2-core/build/UniswapV2Pair.json');
  await est('UniswapV2Pair direct (solc 0.5.16)', pair.bytecode);
})();
