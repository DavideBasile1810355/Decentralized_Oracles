const Web3 = require("web3");
const solc=require('solc');
let request=require("request");
let fs = require('fs');
const HDWalletProvvider=require('@truffle/hdwallet-provider');
let util=require("./util.js")
/**
 * Il seguente script contiene l'implementazione della oracolo PullBased outbound StateOracle.Lo scopo di tale
 * oracolo è quello di recuperare lo stato di un ordine registarto sulla blockchain dalla Dapp, e riportarlo 
 * nel mondo esterno alla blockchain
 */
 /**
  * Classe che modella l'oracolo 
  */
class PullOutBoundOracle
{
    /**
     * Costruttore della classe prende in input l'address della componente on-chain
     * dell'oracolo StateOracle.sol,il filename del suo condice solidity, ed il nome del relativo contratto
     */
    constructor(address,filename,contractName)
    {
        this.address=address;
        this.filename=filename;
        this.contractName=contractName;
    }
    /**
     * Funzione che dato un id di un ordine inizializzato ne restituisce lo stato
     */
    async getState(id)
    {
        const web3 =new Web3(new Web3.providers.HttpProvider("DEFINIRE IL PROVIDER")); 
        var abi=await util.setAbi(this.filename,this.contractName);
        let c = new web3.eth.Contract(abi,this.address);
        var startTime=new Date();
        let eventList =await c.getPastEvents('Answer',
        { 
        fromBlock:0,
        toBlock:"latest"
       });
       var filtered=eventList.filter((x)=>{return x.returnValues["0"]==id})
       var endTime=new Date();
       var result=(endTime-startTime)/1000;
       if(filtered.length==0) return ["Stato dell'ordine non reperibile",result] 
       return [filtered[filtered.length-1].returnValues.value,result];
    }
}

/**
 * FUNZIONE UTILIZZATA PER I TEST:
 * Si presuppone che sia già stato effettuato il deploy dello smartcontract che implementa la componente on chain 
 * dell'oracolo(StateOracle.sol). Passare in input l'address di questo smart contract ed un id id di un ordine già
 * inizializzato.
 */
async function main(addr,idOrder){

    var oracle =new PullOutBoundOracle(addr,"./StateOracle.sol","StateOracle")
    var result =await oracle.getState(idOrder);
    console.log("STATE OF THE ORDER "+idOrder+": "+result[0]);
    console.log("PULL BASED OUTBOUND TIMNIG: "+result[1]);
    return 
   
}


