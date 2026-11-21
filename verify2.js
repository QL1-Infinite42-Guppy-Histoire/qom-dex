const fs=require('fs');
const src=fs.readFileSync('contracts/WQOMX.sol','utf8');
(async()=>{
  // try flattened-code endpoint
  const body={compiler_version:'v0.8.20+commit.a1b79de6', contract_name:'WQOMX', license_type:'mit', flattened_code:src, compiler_settings:{optimizer:{enabled:true,runs:999999}, evmVersion:'paris'}};
  let res=await fetch('https://scan.qomx.io/api/v2/smart-contracts/0x7DF7DDe45772E01e99aB05F1977E926516271897/verification/via/flattened-code',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  console.log('flattened status', res.status, (await res.text()).slice(0,300));
  // check supported compiler versions list contains 0.8.20
  res=await fetch('https://scan.qomx.io/api/v2/smart-contracts/verification/config');
  const cfg=await res.json().catch(()=>null);
  const vers=(cfg&&cfg.compiler_versions)||[]; console.log('has 0.8.20:', vers.filter(v=>v.includes('0.8.20')));
})();
