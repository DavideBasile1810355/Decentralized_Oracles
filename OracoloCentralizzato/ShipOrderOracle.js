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
        const provider=new HDWalletProvvider("797a5d45284765184aa95a1ff8eec3318f550e4063d6cdf0e45a90b7752485ad",
        "https://ropsten.infura.io/v3/c4f203f0ea5742e08da71ef5c49a9edf")
        const web3 =new Web3(provider); 
        let c = new web3.eth.Contract(this.abi,this.addr);
        //console.log("START_PUSH_INBOUND :"+dateTime)
        var r=await c.methods._shipOrder(idOrder,destination,location,dateTime).send({from :'0xd7c351Eb1DfaFCf19bf47D3fe55a9D761a274bd7'})
        .on("receipt",function(d){
            //console.log("END PUSH INBOUND: "+Date.now());
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

main(util.getRandomArbitraryInt(0,15),util.getRandomArbitraryInt(0,99999),"0x7d7e72FD36F0260e2A009b21fdB6F7A0182Bceae","0xf0333AB52210dAf72718257Bd062fdB28810B505");