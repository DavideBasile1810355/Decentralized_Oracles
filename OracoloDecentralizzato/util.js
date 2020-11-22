const Web3 = require("web3");
const solc=require('solc');
let request=require("request");
let fs = require('fs');
const HDWalletProvvider=require('@truffle/hdwallet-provider');
/**
 * Script contenente funzioni di utilizzo
 */
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
    console.log('compiling contract ' + filename);
    let output = solc.compile(jsonContractSource);
    let c=JSON.parse(output);
    let bc = c.contracts.Task[contractName].evm.bytecode.object;
    let abi = c.contracts.Task[contractName].abi;
    return abi;
}

exports.deploy=async function(filename, contractName) {
    const solc = require('solc');
    let code = fs.readFileSync(filename).toString('utf-8');
    const provider=new HDWalletProvvider("DEFINIRE IL PROPRIO PROVIDER","DEFINIRE LA PROPRIA CHIAVE PRIVATA")
    const web3 =new Web3(provider); 
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
        from: "DEFINIRE CHIAVE PUBBLICA ADDRESS",
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
    return Math.floor(Math.random() * (max - min)) + min;
  }

exports.getSeconds=function(st,end){
    return (end-st)/1000;}