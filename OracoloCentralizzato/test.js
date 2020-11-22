const Web3 = require("web3");
const solc=require('solc');
let request=require("request");
let fs = require('fs');
let util=require('./util.js');
const HDWalletProvvider=require('@truffle/hdwallet-provider'); 
/**
 * Il seguente script è stato utilizzato solo per scopi di test della procedura pullbased inbound. 
 * L'utilità  del seguente script è quello di dare il via alla procedura di pullbased inbound
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
                "name": "da",
                "type": "uint256"
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
    ISTRUZIONI PER IL TEST:
    -Si presuppone che sia già stato effettuato il deploy di CreditWorthinessOracle.sol e di OrderManager.sol e che
    lo script creditworthiness.js sia già in ascolto. 
    -il test crea una nuovo ordine con conseguente verifica del parametro taxId da parte dell'oracolo
    -una volta che la transazione di newOrder() viene inserita in un blocco e viene ottenuta la reception
     viene stampato su schermo il timestamp di inizio procedura(pullbased inbound) che puo essere confrontato con 
     il valore che verrà printato sul terminale relativo all'esecuzione di creditworthiness.js, quando la 
     procedure sarà finita
 */
async function test(idCostumer,taxId,prodId,chiavePubblica,chiavePrivata,addressOrderManager)
{ 
        const provider=new HDWalletProvvider(chiavePrivata,
        "https://ropsten.infura.io/v3/c4f203f0ea5742e08da71ef5c49a9edf")
        const web3 =new Web3(provider); 
        let c = new web3.eth.Contract(abi,addressOrderManager);
        await c.methods.newOrder(idCostumer,taxId,prodId).send({from :chiavePubblica})
        .on('receipt',async function(a){console.log("GAS USED BY THE DAPP: "+a['gasUsed']);var t=+ new Date();console.log("START INBOUND PULLBASED : "+(t));
        process.exit();});  
}
test(util.getRandomArbitraryInt(0,9999),"0000",util.getRandomArbitraryInt(0,9999),
                    "0xA6a80830855c81b472A6aa9efb36bBA0fF36A5e4",
                    "10e75c695c5e1da62c7e8b569eab653719a7d5861692154cafc60b1debe1c417",
                    "0x37250a8121f483a35387ef939E9a94DcA823d901"
                    );