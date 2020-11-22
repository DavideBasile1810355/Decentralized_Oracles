const Web3 = require("web3");
const solc=require('solc');
let request=require("request");
let fs = require('fs');
const HDWalletProvvider=require('@truffle/hdwallet-provider'); 
var util=require("./util.js");
const { timeStamp } = require("console");

/*
Il seguente script è stato utilizzato per la valutazione delle performance in termini di latenza per 
l'oracolo pullbased in bound.Ogni run dello script corrisponde ad un test.
*/

/*La variabile abi contiene l'abi dello smart contract OrderManager. Per motivi tecnici l'ottenimento di
quest'ultima non può avvenire a runtime(problemi di compilazione dello smart contract).
*/
var abi=[
    {
        "inputs": [
            {
                "internalType": "int256",
                "name": "idOrder",
                "type": "int256"
            },
            {
                "internalType": "bool",
                "name": "state",
                "type": "bool"
            }
        ],
        "name": "_callback",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "int256",
                "name": "idOrder",
                "type": "int256"
            },
            {
                "internalType": "uint256",
                "name": "date",
                "type": "uint256"
            }
        ],
        "name": "_callbackShipping",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "fatto",
        "outputs": [
            {
                "internalType": "int256",
                "name": "",
                "type": "int256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "inviati",
        "outputs": [
            {
                "internalType": "int256",
                "name": "",
                "type": "int256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "idCostumer",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "taxId",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "productId",
                "type": "uint256"
            }
        ],
        "name": "newOrder",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "addr",
                "type": "address"
            }
        ],
        "name": "setCreditOracle",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "addr",
                "type": "address"
            }
        ],
        "name": "setShipmentRegisterOracle",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "addr",
                "type": "address"
            }
        ],
        "name": "setStateOracle",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]
/*
    La funzione newOrderTest viene utilizzata con l'unico scopo di dare il via alla procedura riguardante 
    l'oracolo pullbased inbound. 
    Tale funzione è utile allo scopo del test per determinare il momento in cui il blocco che determina l'inizio
    della procedura viene minato. Gli input della funzione corrispondono a :
            indirizzo della dapp(OrderManager)
            id costumer
            taxId (oggetto di verifica)
            id del prodotto
    Il tempo di inizio procedura è definito nel momento in cui viene ottenuta la ricevuta dell'azione di mining del
    blocco relativo alla transazione
*/ 
async function newOrderTest(addr,id,taxId,productId)
{ 
        const provider=new HDWalletProvvider("DEFINIRE IL PROPRIO PROVIDER","DEFINIRE LA PROPRIA CHIAVE PRIVATA")
        const web3 =new Web3(provider);
        let c = new web3.eth.Contract(abi,addr);
        c.methods.newOrder(id,taxId,productId).send({from :"DEFINIRE LA PROPRIA CHIAVE PUBBLICA"})
        .on('receipt',async function(a){start=Date.now();
                                        console.log(a['gasUsed']);var t=+ new Date();
                                        console.log("START INBOUND PULLBASED : "+(t));
        }); 
}

/**
 * La funzione watcher viene utilizzata unicamente nel contesto del test delle performance dell'oracolo pullbased inbound. 
 * Tale funzione è utile per ottenere l'istante preciso della fine della procedura riguardante l'oracolo.
 * La funzione effettua una subscribe , e si mette in ascolto di potenziali eventi NewResponse emessi dall oracolo 
 * on-chain CrediWorthinessOracle.sol. Quando l'evento viene catturato dal watcher, la procedura è finita.Dunque 
 * è possibile determinare in secondi il tempo impiegato.
 * L'input corrisponde all'indirizzo dell oracolo on-chain CreditWorthiness.sol
 */
async function watcher(addr)
{
    const provider=new Web3.providers.WebsocketProvider(
        "DEFINIRE IL PROPRIO PROVIDER")
        var web3 =new Web3(provider);
    var res=await util.setAbi("./CreditWorthinessOracle.sol","CreditWorthinessOracle");
    const c = new web3.eth.Contract(res,addr);
        console.log("Start monitoring");
        c.events.NewResponse({fromBlock:'latest'},function(error,event){  
        if(error){console.log(error)}
        else{
            end=Date.now();
            console.log("LATENCY PULLBASED INBOUND ORACLE : "+util.getSeconds(start,end));
            process.exit();
        }
        })
}
/**
 * Le due variabili globali start ed end vengono utilizzate dalle due funzioni di testing newOrderTest e watcher;
 * Essendo le due funzioni asincrone tra loro , per una questione di semplicità si è deciso di farle comunicare mediante
 * variabili globali. Start viene inizialmente impostata da newOrderTest mentre end viene impostata dal watcher che 
 * calcolerà la differenza in secondi rispetto alla variabile gia impostata start.
 */
var start=0;
var end=0;

/**
 * La seguente funzione racchiude in il test.Ad ogni run corrisponde un test. 
 * Nota Bene: Si pesuppone che nel momento in cui si avvia il test, gli oracoli decentralizzati CrediWorthinessOracle.js 
 * siano già attivi ed in ascolo di nuove potenziali richieste.
 */
function roundTripTimeTest(){
    watcher("INDIRIZZO ORDERMANAGER");
    newOrderTest("INDIRIZZO COMPONENTE ONCHAIN",util.getRandomArbitraryInt(0,99999),"0000000000",util.getRandomArbitraryInt(0,99999));

}
roundTripTimeTest();
