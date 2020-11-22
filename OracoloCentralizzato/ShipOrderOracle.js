const Web3 = require("web3");
const solc=require('solc');
let request=require("request");
let fs = require('fs');
let util=require('./util.js');
const HDWalletProvvider=require('@truffle/hdwallet-provider');
/**
 * Il seguente script implementa l'oracolo pushbased Inbound ShipOrderOracle.js. Lo scopo di tale oracolo è quello 
 * di fornire al mondo esterno alla blockchain uno strumento con cui notificare la Dapp dell'avenuto invio di 
 * un ordine
 */



 /**
  * Classe che modella l'oracolo PushbasedInbound
  */
class PushInboundOracle
{
    //funzione che permette di definire l'abi dello smart contract che implementa la componente on chain 
    //dell'oracolo
    setAbi(abi){this.abi=abi;}
    //set dell'address del contratto che implementa la componente on chain dell'oracolo
    setAddr(addr){this.addr=addr;}
    
    /**
     * 
        funzione utilizzata per inviare la notifica di spezione dell'ordine.Prende in input:
            id dell'ordine, destinazione della dapp, id della locazione di spedizione, timestamp di spezione
     */
    async shipOrder(idOrder,destination,location,dateTime)
    {
        console.log("START SHIPPING");
        const provider=new HDWalletProvvider("DEFINIRE IL PROVIDER",
        "CHIAVE PRIVATA ACCOUNT")
        const web3 =new Web3(provider); 
        let c = new web3.eth.Contract(this.abi,this.addr);
        var r=await c.methods._shipOrder(idOrder,destination,location,dateTime).send({from :"CHIAVE PUBBLICA ACCOUNT"})
        .on("receipt",function(d){
            return r
        });
        console.log("GAS USED : "+r.gasUsed);
        console.log("PUSHBASED INBOUND TIMING :"+((Date.now()-(dateTime))/1000));
        process.exit();
    }
}

/**
 *FUNZIONE UTILIZZATA PER I TEST. 
 ISTRUZIONI PER IL TEST:
    Si presuppone che sia già stato effettuato il deploy di OrderManager.sol,ShipOrderOracle.sol e se ne conoscano
    i relativi address. La funzione test notifica la Dapp dell'avvenuto invio di un ordine.
 */
async function main(id,idLocation,addressDapp,addressOracolo){
    let c=new PushInboundOracle();
    var res=await util.setAbi("./ShipOrderOracle.sol","ShipOrderOracle");
    c.setAbi(res);
    c.setAddr(addressOracolo);
    await c.shipOrder(id,addressDapp,idLocation,+ new Date());
    return;
}
