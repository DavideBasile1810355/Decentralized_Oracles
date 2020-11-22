const Web3 = require("web3");
const solc=require('solc');
let request=require("request");
let fs = require('fs');
let util=require('./util.js');
const HDWalletProvvider=require('@truffle/hdwallet-provider');
const { runInThisContext } = require("vm");
/**
 * Il seguente script contiene l'implementazione dell'oracolo push based inbound decentralizzato
 */

var terminationTest=0;
/**
 * Classe che implementa il singolo nodo dell'oracolo pushbased inbound. Il seguente oracolo ha il compito di
 * inviare la notifica di spedizione alla componente on-chain dell'oracolo
 */
class PushInboundOracle
{
    /**
     * Set dell'abi della componente on-chain dell'oracolo
     */
    setAbi(abi){this.abi=abi;}
    /**
     * set dell'address della componente on chain dell'oracolo 
     */
    setAddr(addr){this.addr=addr;}
    /**
     * set della chiave privata dell'account associato al nodo off-chain
     */
    setPrivateK(privateK){this.privateK=privateK;}
    /**
     * set della chiave pubblica dell'account associato al nodo off-chain
     */
    setPublicK(publicK){this.publicK=publicK;}
    /**
     * metodo utilizzato per l'invio della notifica di spedizione dell'ordine
     */
    async shipOrder(idOrder,destination,dateTime)
    {
        const provider=new Web3.providers.HttpProvider("DEFINIRE IL PROPRIO PROVIDER");
        const web3 =new Web3(provider); 
        let c = new web3.eth.Contract(this.abi,this.addr);
        web3.eth.accounts.wallet.add(this.privateK);
        //chiamata del metodo della componente on-chain 
        await c.methods._shipOrder(idOrder,destination,dateTime)
        //firma della transazione
        .send({from :this.publicK , gas:300000})
        //attesa della ricevuta di mining della transazione appena inviata
        .on("receipt",function(d){
            
            console.log("TRANSACTION HASH: "+d.transactionHash);
            console.log("GAS USED : "+d.gasUsed);
            terminationTest++;

        })
        //in tal modo si determina qual'è l'ultimo nodo che inviato la propria notifica
        if (terminationTest==3){console.log("LATENCY PUSHBASED INBOUND ORACLE : "+util.getSeconds(dateTime,Date.now()));terminationTest=0;process.exit()};
        
    }
}
/**
 * metodo utilizzato mettere in funzione la singola componente esterna, ed inviare la una notifica di spedizione. 
 * Occorre specificare l'id dell'ordine,l'indirizzo della DApp di destinazione,l'address della componente on-chain,
 * la chiave pubblica e privata dell'account che si associa al nodo.
 */
async function run(id,dappAddress,address,privateK,publicK,startTime){
    let c=new PushInboundOracle();
    var res=await util.setAbi("./ShipOrderOracle.sol","ShipOrderOracle");
    c.setAbi(res);
    c.setAddr(address);
    c.setPublicK(publicK);
    c.setPrivateK(privateK);
    await c.shipOrder(id,dappAddress,startTime);
}
//Funzione di test. Vengono utilizzati tre nodi esterni, che in modo asincorono inviano la notifica di spedizione.
function test(orderId){
    var startTime=Date.now();
    run(orderId,"INDIRIZZO-DAPP","INDIRIZZO-COMPONENTE-ONCHAIN","CHIAVE-PRIVATA-NODO1","CHIAVE-PUBBLICA-NODO1",startTime);
    util.sleep(util.getRandomArbitrary(0,2000));
    run(orderId,"INDIRIZZO-DAPP","INDIRIZZO-COMPONENTE-ONCHAIN","CHIAVE-PRIVATA-NODO2","CHIAVE-PUBBLICA-NODO2",startTime);
    util.sleep(util.getRandomArbitrary(0,2000));
    run(orderId,"INDIRIZZO-DAPP","INDIRIZZO-COMPONENTE-ONCHAIN","CHIAVE-PRIVATA-NODO2","CHIAVE-PUBBLICA-NODO3",startTime);
}
