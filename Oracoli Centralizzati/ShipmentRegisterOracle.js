const Web3 = require("web3");
const solc=require('solc');
let request=require("request");
let fs = require('fs');
const HDWalletProvvider=require('@truffle/hdwallet-provider')
let util=require('./util.js');
/**
 * Tale script implemeta la componente off-chain di ShimpentRegisterOracle, un oracolo pushnbasedOutbound.Tale
 * oracolo offre lo strumento alla Dapp OrderManager per registrare presso un entità esterna alla blockchain
 * l'avvenuta spedizione dell'ordine
 * 
 */

 
 /**
  * Funzione che simula la chiamata all'entità esterna alla blockchain che registra la spedizione.
  */
function callRegisterApi(id,location,timestamp)
{
    var result=(Date.now()-(timestamp))/1000;
    console.log("ORDER:"+id+" SHIPPED ON "+(new Date(parseInt(timestamp)).toLocaleTimeString())+" AT LOCATION : "+location);         
    console.log("PUSHBASED OUTBOUND TIMING SINCE THE SHIPMENT: "+result); 
}
/**
 * Classe che modella la componente off chain dell'oracolo ShipmentRegisterOracle
 */
class PushOutBoundOracle
{
    constructor(){this.eventListener=new EventListener();}
}
/**
 * Classe che implementa l'event listener, che permette di intercettare gli eventi NewShipment
 */
class EventListener
{
    //set dell'address della componente on-chain dell'oracolo ShipmentRegisterOracle
    setAddress(addr){this.address=addr;}
    //set dell'address della componente on-chain dell'oracolo ShipmentRegisterOracle
    setAbi(abi){this.abi=abi;}
    //funzione che mette l'oracolo in ascolto di nuovi eventi di tipo NewShipment
    async startWatching()
    {
        const provider=new Web3.providers.WebsocketProvider(
            "DEFINIRE IL PROVIDER")
             
        var web3 =new Web3(provider);
        console.log("Starting Monitoring");
        let c = new web3.eth.Contract(this.abi,this.address);
        c.events.NewShipment({},async function(error, event){
            /**
             * Definizione di una funzione di callback richiamata ogni volta che l'oracolo cattura un nuovo evento
             * emesso dalla componente on chain.
             */
            var id=event["returnValues"][0];
            var location=event["returnValues"][1];
            var timestamp=event["returnValues"][2];
            //la chiamata al database esterno è fittizia, al fine di isolare al meglio l'interazione dell'oracolo
            //con la blockchain
            callRegisterApi(id,location,timestamp);
    })
        
    }
}

//FUNZIONE DI TEST PER METTERE IN FUNZIONE L'ORACOLO.Prende in input l'address della componente on chain dell'oracolo
async function main(addr){
   
    var oracle=new PushOutBoundOracle();
    var abi=await util.setAbi("./ShipmentRegisterOracle.sol","RegisterOracle");
    oracle.eventListener.setAbi(abi);
    oracle.eventListener.setAddress(addr);
    await oracle.eventListener.startWatching();
}
