const {ethers}=require('ethers');
const ganache=require('ganache');
const fs=require('fs');
function norm(n){const a=JSON.parse(fs.readFileSync('artifacts/'+n+'.json','utf8')); return {abi:a.abi, bytecode: a.bytecode.startsWith('0x')?a.bytecode:'0x'+a.bytecode};}
(async()=>{
  const prov=new ethers.BrowserProvider(ganache.provider({logging:{quiet:true}}));
  // BrowserProvider over ganache provider works via EIP-1193
  const signer=await prov.getSigner(); const me=await signer.getAddress();
  const A={ WQOMX: JSON.parse(fs.readFileSync('artifacts/WQOMX.json','utf8')), Factory: norm('UniswapV2Factory'), Router: norm('UniswapV2Router02') };
  const wq=await (await new ethers.ContractFactory(A.WQOMX.abi,A.WQOMX.bytecode,signer).deploy()).waitForDeployment();
  const fac=await (await new ethers.ContractFactory(A.Factory.abi,A.Factory.bytecode,signer).deploy(me)).waitForDeployment();
  const rou=await (await new ethers.ContractFactory(A.Router.abi,A.Router.bytecode,signer).deploy(await fac.getAddress(), await wq.getAddress())).waitForDeployment();
  console.log('deployed', await wq.getAddress(), await fac.getAddress(), await rou.getAddress());
  console.log('feeTo', await fac.feeTo(), 'feeToSetter==deployer', (await fac.feeToSetter())===me);
  // test ERC20 from v2-core build (ERC20 test token, supply to deployer)
  const ercArt=require('@uniswap/v2-core/build/ERC20.json'); const ercBc=ercArt.bytecode.startsWith('0x')?ercArt.bytecode:'0x'+ercArt.bytecode;
  const supply=ethers.parseEther('1000000');
  const tok=await (await new ethers.ContractFactory(ercArt.abi,ercBc,signer).deploy(supply)).waitForDeployment();
  await (await tok.approve(await rou.getAddress(), supply)).wait();
  const dl=Math.floor(Date.now()/1000)+1200;
  const r=await (await rou.addLiquidityETH(await tok.getAddress(), ethers.parseEther('10000'), 0,0, me, dl, {value: ethers.parseEther('100')})).wait();
  console.log('addLiquidityETH ok', r.hash.slice(0,12));
  const pairAddr=await fac.getPair(await tok.getAddress(), await wq.getAddress()); console.log('pair', pairAddr);
  const pair=new ethers.Contract(pairAddr, ["function getReserves() view returns (uint112,uint112,uint32)"], prov);
  console.log('reserves', (await pair.getReserves()).map(x=>x.toString()));
  const out=await rou.getAmountsOut(ethers.parseEther('1'), [await wq.getAddress(), await tok.getAddress()]);
  console.log('quote 1 QOMX -> TEST', ethers.formatEther(out[1]));
  const s=await (await rou.swapExactETHForTokens(0,[await wq.getAddress(), await tok.getAddress()], me, dl, {value: ethers.parseEther('1')})).wait();
  console.log('swap ok', s.hash.slice(0,12), 'TEST bal', ethers.formatEther(await tok.balanceOf(me)));
  console.log('LOCAL E2E PASS');
})().catch(e=>{console.error('FAIL', e); process.exit(1)});
