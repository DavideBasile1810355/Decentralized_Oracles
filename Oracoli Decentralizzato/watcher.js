const Web3 = require("web3");
const solc=require('solc');
let request=require("request");
let fs = require('fs');
let util=require("./util")
const HDWalletProvvider=require('@truffle/hdwallet-provider'); 
const { mainModule } = require("process");

/**
 * Script utilizzato per il test del creditworthiness oracle.
 */
exports.main= async function(addr)
{
    const provider=new Web3.providers.WebsocketProvider("DEFINIRE IL PRORPIO PROVIDER","CHIAVE PRIVATA")
        var web3 =new Web3(provider);
    var res=await util.setAbi("./CreditWorthinessOracle.sol","CreditWorthinessOracle");
    const c = new web3.eth.Contract(res,addr);
        console.log("Start monitoring");
        c.events.NewResponse({fromBlock:'latest'},function(error,event){  
        if(error){console.log(error)}
        else{
            console.log("END PULLBASED INBOUND ORACLE :"+Date.now());
            end=Date.now();
            console.log(util.getSeconds(start,end));
        }
        })
}
