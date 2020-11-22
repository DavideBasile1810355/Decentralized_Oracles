const Web3 = require("web3");
const solc=require('solc');
let request=require("request");
let fs = require('fs');
const HDWalletProvvider=require('@truffle/hdwallet-provider');
let util=require("./util.js");
/**
 * Il seguente script contiene il codice della componente off-chain centralizzata dell'oracolo 
 * pull based inbound CreditWorthinss.js. Tale oracolo viene utilizzato per permettere la verifica della stringa
 * taxId inserita nella DApp OrderManager quando viene generato un nuovo ordine.
 */

/**
 * La seguente classe viene utilizzata per incapsulare al suo interno lo strumento necessario per far si che la
 * componente off-chain sia operativa cioè l'event listener
 */
class PullInBoundOracle
{
    constructor(chiavePubblica,chiavePrivata){this.eventListener=new EventListener();} 
}
/**
 * La seguente classe implementa l'event listener che permette di intercettare l'emissione di eventi da parte 
 * della componente dell'oracolo on-chain.
 */
class EventListener
{
    //Address della componente on-chain dell'oracolo(Creditworthiness.sol)
    setAddress(addr){this.address=addr;}
    //abi della componente on-chain dell'oracolo(Creditworthiness.sol)
    setAbi(abi){this.abi=abi;}
    //chiave pubblica dell'account per firmare le transazioni di risposta
    setChiavePubblica(chiavePubblica){this.chiavePubblica=chiavePubblica;}
    //chiave privata dell'account per firmare le transazioni di risposta
    setChiavePrivata(chiavePrivata){this.chiavePrivata=chiavePrivata;}
    //funzione che mette il listener in ascolto della componente on chain per recuperare nuove richiesta di verifica
    async startWatching()
    {
        const provider=new Web3.providers.WebsocketProvider("DEFINIRE IL PROVIDER");
        var web3 =new Web3(provider);
        web3.eth.accounts.wallet.add(this.chiavePrivata);
        console.log("Starting Monitoring");
        const address=this.chiavePubblica;
        const c = new web3.eth.Contract(this.abi,this.address);
        //funzione che mette in ascolto per l'emissione di eventi del tipo NewVerification dalla componente on-chain
        c.events.NewVerification({fromBlock:'latest'},function(error,event){  
            
            //funzione di callback richiamata ogni volta che viene catturato un evento NewVerification
            if(error){console.log(error)}
            else{
                //recupero dei parametri dell'evento dell'evento
                var addre=event["returnValues"][0];
                var id=event["returnValues"][1];
                var taxId=event["returnValues"][2];
                console.log("ORDER ID :"+id);
                //La chiamata all'api esterna viene soltanto simulata al fine di isolare al meglio il comportamento
                //dell'oracolo.L'unica stringa che determina un esito positivo è quella con 10 zeri
                var result=false;
                if (taxId=="0000000000"){result=true;}
                //viene richiamato il metodo della componente dell'oracolo on-chain _callback, per restituire alla
                //dapp  il risultato della verifica.La componente On-chain si occuperà del invio effettivo della
                //risposta. La chiamata a _callback genererà ovviamente una transazione
                c.methods._callback(id,result,addre)
                    .send({from:address,gas:3000000})
                    .on('receipt',async function(a)
                        {console.log("GAS USED: "+a['gasUsed']);
                        console.log("END INBOUND PULLBASED: "+ Date.now());});
                        //il metodo on('receipt') determina il momento in cui viene ottenuta la ricevuta di mining del blocco
                        //nel quale è contenuta la transazione 
            }
        });

    }
}



//FUNZIONE UTILIZZATA PER I TEST------------------
/**
 Metodo utilizzato per metter in ascolto l'oracolo.E' necessario passare in input, l'indirizzo della componente
 on chain e la chiave pubblica e dell'account
 */
async function runOracle(addr,chiavePubblica,chiavePrivata){

    var oracle=new PullInBoundOracle(chiavePubblica,chiavePrivata);
    var abi=await util.setAbi("./CreditWorthinessOracle.sol","CreditWorthinessOracle");
    oracle.eventListener.setAbi(abi);
    oracle.eventListener.setAddress(addr);
    oracle.eventListener.setChiavePubblica(chiavePubblica);
    oracle.eventListener.setChiavePrivata(chiavePrivata);
    await oracle.eventListener.startWatching();
}







