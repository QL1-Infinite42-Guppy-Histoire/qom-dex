const {ethers}=require('ethers');
const fs=require('fs');
const p=new ethers.JsonRpcProvider('https://rpc.qomx.io',33303);
function deployedBytecode(file){ const a=JSON.parse(fs.readFileSync(file,'utf8')); return a.deployedBytecode ? (a.deployedBytecode.startsWith('0x')?a.deployedBytecode:'0x'+a.deployedBytecode) : null; }
(async()=>{
  // WQOMX artifact only has creation bytecode; compile runtime via solc again? artifacts/WQOMX.json lacks deployedBytecode. Use creation-> deploy on ganache? Simpler: compare on-chain code hash to solc output object runtime from compile script if present.
  const checks=[
    ['Factory','0x1cC5CeEaF98A3b4e2BB2731f960D63CBe0BA8BFC','artifacts/UniswapV2Factory.json'],
    ['Router02','0xD0199c4EA87e4CfCc221f2efBC9f161a1331B1F4','artifacts/UniswapV2Router02.json'],
    ['PairTemplate','-','artifacts/UniswapV2Pair.json'],
  ];
  for(const [n,addr,file] of checks){
    const dep=deployedBytecode(file);
    if(!dep){ console.log(n,'no deployedBytecode in artifact'); continue; }
    console.log(n,'artifact runtime bytes',(dep.length-2)/2,'hash',ethers.keccak256(dep));
    if(addr!=='-'){ const code=await p.getCode(addr); console.log('   on-chain bytes',(code.length-2)/2,'hash',ethers.keccak256(code),'MATCH', code.toLowerCase()===dep.toLowerCase()); }
  }
  // WQOMX: recompile to get runtime
  const solc=require('solc-0820');
  const src=fs.readFileSync('contracts/WQOMX.sol','utf8');
  const input={language:'Solidity',sources:{'WQOMX.sol':{content:src}},settings:{optimizer:{enabled:true,runs:999999},evmVersion:'paris',outputSelection:{'*':{'*':['evm.deployedBytecode.object']}}}};
  const out=JSON.parse(solc.compile(JSON.stringify(input)));
  const rt='0x'+out.contracts['WQOMX.sol']['WQOMX'].evm.deployedBytecode.object;
  const code=await p.getCode('0x7DF7DDe45772E01e99aB05F1977E926516271897');
  console.log('WQOMX recompiled runtime bytes',(rt.length-2)/2,'on-chain',(code.length-2)/2,'MATCH', code.toLowerCase()===rt.toLowerCase());
})().catch(e=>{console.error(e);process.exit(1)});
