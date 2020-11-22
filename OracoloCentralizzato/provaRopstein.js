const Web3 = require("web3");
const solc=require('solc');
let request=require("request");
let fs = require('fs');
const HDWalletProvvider=require('@truffle/hdwallet-provider')
async function getAbi(filename, contractName){
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
    let output = solc.compile(jsonContractSource);
    let c=JSON.parse(output);
    let bc = c.contracts.Task[contractName].evm.bytecode.object;
    let abi = c.contracts.Task[contractName].abi;
    return abi;
}




async function main(addr){
        const provider=new HDWalletProvvider("10e75c695c5e1da62c7e8b569eab653719a7d5861692154cafc60b1debe1c417",
        "https://ropsten.infura.io/v3/c4f203f0ea5742e08da71ef5c49a9edf")
        //const web3 =new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545")); 
        const web3 =new Web3(provider); 
        let a=await getAbi("./ProvaRopsten.sol","ProvaRopsten");
        let c = new web3.eth.Contract(a,addr);
        c.methods.set().send({from :"0xA6a80830855c81b472A6aa9efb36bBA0fF36A5e4"}).on('confirmation',async function(a,b,c){console.log(a);console.log(b);console.log(c);process.exit()});
        //process.exit();
        return;}

main("0x4F33D05831239607Bb6487B671C0afD3d5754B43")