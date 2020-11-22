const Web3 = require("web3");
const solc=require('solc');
let request=require("request");
let fs = require('fs');
const HDWalletProvvider=require('@truffle/hdwallet-provider');

exports.setAbi=async function(filename, contractName) {
    const solc = require('solc');
    let code = fs.readFileSync(filename).toString('utf-8');
    let jsonContractSource = JSON.stringify({
        language: 'Solidity',
        sources: {
          'Task': {
              content: code,
           },
        },
        settings: { 
            outputSelection: {
                '*': {
                    '*': ['abi',"evm.bytecode"],   
                },
            },
        },
    });
    // compila
    console.log('compiling contract ' + filename);
    let output = solc.compile(jsonContractSource);
    let c=JSON.parse(output);
    let bc = c.contracts.Task[contractName].evm.bytecode.object;
    let abi = c.contracts.Task[contractName].abi;
    //this.eventListener.setAddress(addr);
    return abi;
}

exports.deploy=async function(filename, contractName) {
    const solc = require('solc');
    let code = fs.readFileSync(filename).toString('utf-8');
    const provider=new HDWalletProvvider("10e75c695c5e1da62c7e8b569eab653719a7d5861692154cafc60b1debe1c417",
    "https://ropsten.infura.io/v3/c4f203f0ea5742e08da71ef5c49a9edf")
    //const web3 =new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545")); 
    const web3 =new Web3(provider); 
    //const address=await web3.eth.getAccounts();
    let jsonContractSource = JSON.stringify({
        language: 'Solidity',
        sources: {
          'Task': {
              content: code,
           },
        },
        settings: { 
            outputSelection: {
                '*': {
                    '*': ['abi',"evm.bytecode"],   
                },
            },
        },
    });
    // compila
    console.log('compiling contract ' + filename);
    let output = solc.compile(jsonContractSource);
    let c=JSON.parse(output);
    let bc = c.contracts.Task[contractName].evm.bytecode.object;
    let abi = c.contracts.Task[contractName].abi;
    let contract = new web3.eth.Contract(abi);
    let addr = "";
    let x = contract.deploy({
        data: '0x' + bc
    }).send({
        from: "0xA6a80830855c81b472A6aa9efb36bBA0fF36A5e4",
        gas: 555555
    }, function(error, transactionHash) {
        if(error) {
            console.log("error: " + error)
        }
        if(transactionHash)
            console.log("txId: " + transactionHash)
    }).on('receipt', function(receipt) {
        addr = receipt.contractAddress
        console.log(receipt.contractAddress)
    }).then(function(contractInstance){
    })
    // wait for it ...
    await x;
    return [abi,addr];
}
exports.getRandomArbitrary=function(min, max) {
    return Math.random() * (max - min) + min;
  }

  exports.sleep=function(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}
exports.getRandomArbitraryInt=function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //Il max è escluso e il min è incluso
  }

exports.getSeconds=function(st,end){
    return (end-st)/1000;}