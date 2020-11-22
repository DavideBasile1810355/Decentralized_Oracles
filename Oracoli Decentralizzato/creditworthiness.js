const Web3 = require("web3");
const solc=require('solc');
let request=require("request");
let fs = require('fs');
let util=require("./util.js");
const HDWalletProvvider=require('@truffle/hdwallet-provider');
/**
 * Il seguente script contiene l'implementazione decentralizzata dell'oracolo pull based inbound. 
 * L'oracolo viene utilizzato per fornire alle Dapp richiedenti informazioni richiedenti, circa il TaxId. Nel caso
 * decentralizzato l'istanzazione di più nodi in ascolto.
 */

 /**
  * Classe che implementa il sinoglo nodo off-chain
  */
class PullInBoundOracle
{
    constructor(){this.eventListener=new EventListener();}
}
/**
 * Classe mediante la quale la componente off-chain riesce ad acogliere nuove richieste e sottomettere
 * transazioni di risposta.
 */
class EventListener
{
    /**
     *set dell'indirizzo pubblico del nodo off-chain
     */
    setAddress(addr){this.address=addr;}
    /**
     * set dell'abi della componente on-chain dell'oracolo
     */
    setAbi(abi){this.abi=abi;}
    /**
     * set della chiave privata per firmare le transazioni di risposta
     */
    setPrivateK(privateK){this.privateK=privateK;}
    /**
     * set dell'indirizzo della componente on-chain
     */
    setOracleAddress(oracleAddr){this.oracleAddr=oracleAddr;}
    /**
     * metodo che mette in ascolto della componente on-chain impostata e definisce un'azione di risposta quando
     * viene catturato l'evento.
     */
    startWatching()
    {
        const provider=new Web3.providers.WebsocketProvider(
        "FORNIRE IL PROPRIO PROVIDER")
        var web3 =new Web3(provider);
        web3.eth.accounts.wallet.add(this.privateK);
        console.log("Starting Monitoring");
        console.log(this.oracleAddr);
        const c = new web3.eth.Contract(this.abi,this.address);
        const address=this.oracleAddr;
        /**
         * l'oracolo si mette in ascolto di nuovi eventi NewVerification
        */
        c.events.NewVerification({fromBlock:'latest'},async function(error,event){  
        if(error){console.log(error)}
        else{
            /**
             *Azioni intraprese ogni volta che un nuovo evento viene catturato 
             */
            var addre=event["returnValues"][0];
            var id=event["returnValues"][1];
            var taxId=event["returnValues"][2];
            var idRequest=event["returnValues"][3]
            console.log(id);
            var result=false;
            /**
             * La verifca presso l'api esterna viene simulata atteaverso l'if sottostante
             */
            if (taxId=="0000000000"){result=true;}
            /**
             * Attesa casuale per desincronizzare le componente off-chain, al fine di ottenere test più verosimili
             */
            util.sleep(util.getRandomArbitrary(0,2000));
            /**
             * Chiamata del metodo di restituzione della risposta
             */
            c.methods._callback(id,result,idRequest,addre)
                //Firma della transazione 
                .send({from:address,gas:3000000})
                //attesa della ricevuta di mining del blocco contenente la transazione appena generata
                .on('receipt',async function(a){console.log(a['gasUsed']);console.log(+ new Date());});
        }
        });

    }
}
/**
 * Metodo per mettere in funzione una singola componente off-chain, usato per i test . 
 * E' necessario fornire in input l'indirizzo della componente on-chain e chiave publica e privata di un account per
 * la firma delle transazioni di risposta
 */
async function run(addr,privateK,oracleAddr){
   
    var oracle=new PullInBoundOracle();
    var abi=await util.setAbi("./CreditWorthinessOracle.sol","CreditWorthinessOracle");
    oracle.eventListener.setAbi(abi);
    oracle.eventListener.setAddress(addr);
    oracle.eventListener.setPrivateK(privateK);
    oracle.eventListener.setOracleAddress(oracleAddr);
    await oracle.eventListener.startWatching();
}



/**
 * Metodo per l'esecuzione dei test. Venogono messi in funzione tre nodi off-chain diversi, in attesa di 
 * nuovi eventi emessi dalla coomponente on-chain. I tre nod dovranno essere forniti di tre diversi account, per 
 * ognuno dei quali si definisce una chiave publica ed una chiave privata.
 */
function test(){
    run("INDIRIZZO-COMPONENTE-ONCHAIN","CHIAVE-PRIVATA-ACCOUNT1","CHIAVE-PUBBLICA-ACCOUNT1");
    run("INDIRIZZO-COMPONENTE-ONCHAIN","CHIAVE-PRIVATA-ACCOUNT2","CHIAVE-PUBBLICA-ACCOUNT2");
    run("INDIRIZZO-COMPONENTE-ONCHAIN","CHIAVE-PRIVATA-ACCOUNT3","CHIAVE-PUBBLICA-ACCOUNT3");
}



