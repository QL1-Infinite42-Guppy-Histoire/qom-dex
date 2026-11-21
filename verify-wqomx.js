const fs=require('fs');
const solc=require('solc-0820');
const src=fs.readFileSync('contracts/WQOMX.sol','utf8');
const standardInput={language:'Solidity',sources:{'WQOMX.sol':{content:src}},settings:{optimizer:{enabled:true,runs:999999},evmVersion:'paris',outputSelection:{'*':{'*':['abi','evm.bytecode.object']}}}};
(async()=>{
  const body={compiler_version:'v0.8.20+commit.a1b79de6', contract_name:'WQOMX.sol:WQOMX', license_type:'mit', standard_input:standardInput};
  const res=await fetch('https://scan.qomx.io/api/v2/smart-contracts/0x7DF7DDe45772E01e99aB05F1977E926516271897/verification/via/standard-input',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  console.log('status', res.status); console.log((await res.text()).slice(0,500));
})();
