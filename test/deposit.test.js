"use strict"
const KingOfTheFools = artifacts.require("./KingOfTheFools.sol");
const USDC = artifacts.require("./USDC.sol");
const w3utils = web3.utils;


contract("TestKingOfTheFools - deposit", accts => {
  let contract;
  let usdc;
  before(async () => {
	usdc = await USDC.deployed();
	console.log('usdc deployed at ', usdc.address);
	//const usdcContract = new web3.eth.Contract(USDC.abi, usdc.address);

	contract = await KingOfTheFools.deployed(usdc.address, "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e");
	console.log('contract deployed at ', contract.address);

  })

  it("depostETH", async() => {    
	const w3instance = new web3.eth.Contract(KingOfTheFools.abi, contract.address);
	const depositAmount = w3utils.toBN(w3utils.toWei("0.1", "ether"));
	const tx1 = await w3instance.methods.depositEth().send({ to: contract.address, from: accts[0], value: depositAmount })     
	let account1_balance = await web3.eth.getBalance(accts[0]);
	let contract_balance = await web3.eth.getBalance(contract.address);
	console.log("account1_balance", account1_balance);
	console.log("contract_balance", contract_balance);

	const tx2 = await w3instance.methods.depositEth().send({ to: contract.address, from: accts[1], value: depositAmount * 2 })     
	account1_balance = await web3.eth.getBalance(accts[0]);
	let account2_balance = await web3.eth.getBalance(accts[1]);
	contract_balance = await web3.eth.getBalance(contract.address);
	console.log("--------------------------------------");
	console.log("account1_balance", account1_balance);
	console.log("account2_balance", account2_balance);
	console.log("contract_balance", contract_balance);
  });

  it("depostUSDC", async() => {    

	await usdc.mint({from: accts[1]});
	await usdc.mint({from: accts[2]});	
	
	await usdc.approve(contract.address, 100000000000000, {from: accts[0]});
	await usdc.approve(contract.address, 100000000000000, {from: accts[1]});	

	const balance1 = await usdc.balanceOf(accts[0]);
	const balance2 = await usdc.balanceOf(accts[1]);
	
	console.log('balance1', balance1.toString());
	console.log('balance2', balance2.toString());	

	const allowance1_balance = await usdc.allowance(accts[0], contract.address);
	const allowance2_balance = await usdc.allowance(accts[1], contract.address);
	
	console.log('allowance1', allowance1_balance.toString());
	console.log('allowance2', allowance2_balance.toString());	

	const depositAmount = w3utils.toBN("100000000");	 
	const tx1 = await contract.depositUSDC(depositAmount, { to: contract.address, from: accts[0]});     
	let account1_balance = await usdc.balanceOf(accts[0]);
	let contract_balance = await usdc.balanceOf(contract.address);
	console.log("account1_balance", account1_balance.toString());
	console.log("contract_balance", contract_balance.toString());

	const tx2 = await contract.depositUSDC(depositAmount * 2, { to: contract.address, from: accts[1]});
	account1_balance = await usdc.balanceOf(accts[0]);
	let account2_balance = await usdc.balanceOf(accts[1]);
	contract_balance = await usdc.balanceOf(contract.address);
	console.log("--------------------------------------");
	console.log("account1_balance", account1_balance.toString());
	console.log("account2_balance", account2_balance.toString());
	console.log("contract_balance", contract_balance.toString());
  });

  it("depostMix", async() => {    
	await usdc.mint({from: accts[1]});		
	await usdc.approve(contract.address, 100000000000000, {from: accts[0]});	
	const balance1 = await usdc.balanceOf(accts[0]);	
	console.log('balance1', balance1.toString());
	
	const allowance1_balance = await usdc.allowance(accts[0], contract.address);
	console.log('allowance1', allowance1_balance.toString());	

	const depositAmount = w3utils.toBN("100000000000");	 
	const tx1 = await contract.depositUSDC(depositAmount, { to: contract.address, from: accts[0]});     


	const depositETHAmount = w3utils.toBN(w3utils.toWei("2", "ether"));
	const tx2 = await contract.depositEth({ to: contract.address, from: accts[1], value: depositETHAmount });  

	let account1_eth_balance = await web3.eth.getBalance(accts[0]);
	let account2_eth_balance = await web3.eth.getBalance(accts[1]);
	let contract_eth_balance = await web3.eth.getBalance(contract.address);
	console.log("account1_eth_balance", account1_eth_balance);
	console.log("account2_eth_balance", account2_eth_balance);
	console.log("contract_eth_balance", contract_eth_balance);
  });
});
