const Web3 = require("web3");
const solc=require('solc');
let request=require("request");
let fs = require('fs');
const HDWalletProvvider=require('@truffle/hdwallet-provider')
let util=require("./util.js");
/**
 * Il seguente script implementa la componente off-chain dell' oracolo push based outbound decentralizzata
 */
var votesCounter=0;
function vote(id,startTimestamp,txH){votesCounter++;if(votesCounter==3){
            var ricezione=Date.now();
            console.log("ORDER:"+id+" SHIPPED ON "+(new Date(parseInt(startTimestamp)).toLocaleTimeString()));
            console.log("PUSHBASED OUTBOUND TIMING SINCE THE SHIPMENT: "+util.getSeconds(startTimestamp,ricezione));
            console.log("TRANSACTION THAT TRIGGERED THE RECEPTION: "+txH);
            votesCounter=0;
        }
        }
/**
 * Classe che modella il sistema di ricezione decentralizzato, contenente più oggetti di tipo PushOutOracle
 */
class ArrayOracle
{
    constructor(oracleArray){
        this.oracleArray=oracleArray;
        this.votesCounter=0;
    }
    /**
     * metodo che mette gli oracoli del sistema in ascolto di nuovi eventi NewShipment
     */ 
    startWatching(){
        for(i=0;i<3;i++){
            this.oracleArray[i].eventListener.startWatching();
        }
    }
}
/**
 * Classe che modella l'oracolo push based outbound
 */
class PushOutBoundOracle
{
    constructor(){this.eventListener=new EventListener();}
}
/**
 * Classe event listener che permette di catturare gli eventi emessi dalla componente on-chain
 */
class EventListener
{
    //set dell'indirizzo della componente on-chain
    setAddress(addr){this.address=addr;}
    //set dell'abi della componente on-chain
    setAbi(abi){this.abi=abi;}
    //metodo che mette l'oracolo in ascolto dell'emissione degli eventi NewShipment
    startWatching()
    {
        const provider=new Web3.providers.WebsocketProvider("DEFINIRE IL PROPRIO PROVIDER")
        var web3 =new Web3(provider);
        console.log("Starting Monitoring");
        let c = new web3.eth.Contract(this.abi,this.address);
        c.events.NewShipment({}, function(error, event){
            //Codice eseguito quando viene catturato l'evento
            util.sleep(util.getRandomArbitraryInt(0,500));
            var id=event["returnValues"][0];
            var timestamp=event["returnValues"][2];
            //Azione intrapresa per segnalare la ricezione dell'evento
            vote(id,timestamp,event.transactionHash);
        })
  
    }
}
//metodo che mette in funzione tre nodi esterni. I tre nodi saranno in attesa dell'emissione degli eventi emessi 
//dalla componente on-chain. Prende in input l'indirizzo della componente on-chain
async function test(addr){
    var oracleArray=[];
    for(i=0;i<3;i++){
        var oracle=new PushOutBoundOracle();
        var abi=await util.setAbi("./ShipmentRegisterOracle.sol","RegisterOracle");
        oracle.eventListener.setAbi(abi);
        oracle.eventListener.setAddress(addr);
       oracleArray.push(oracle);
    }
    const arrayOracle=new ArrayOracle(oracleArray);
    arrayOracle.startWatching();

}
