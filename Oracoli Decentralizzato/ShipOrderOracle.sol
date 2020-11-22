// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.8.0;
abstract contract isUsingShippingOracle{
    
    function _callbackShipping(int256,uint) virtual public;
}
//Contratto che implementa la componente on-chain dell'oracolo pushbased inbound
contract ShipOrderOracle
{
     isUsingShippingOracle shippingContract;
     //Mappa che indicizza le componenti off-chain
     mapping(address=>uint256) votersIndex;
     //Mappa che tiene il conto delle notifica di spedizione arrivate per un determinato ordine
     mapping(int=>bool[3]) votesCounter;
     constructor(){
         votersIndex[address(INDIRIZZO NODO OFF-CHAIN)]=0;
         votersIndex[address(INDIRIZZO NODO 2 OFF-CHAIN)]=1;
         votersIndex[address(INDIRIZZO NODO 3 OFF-CHAIN)]=2;
     }
     //Modificatore che controlla che la sottomissione della notifica di spedizione avvenga da un oracolo off-chain già
     modifier fromOracle
     {
         require(address(msg.sender)==address(INDIRIZZO NODO OFF-CHAIN)||
                 address(msg.sender)==address(INDIRIZZO NODO 2 OFF-CHAIN)||
                 address(msg.sender)==address(INDIRIZZO NODO 3 OFF-CHAIN),"I don't know you");
         _;
     }

     //Funzione con la quale, le componenti off-chain sottomettono la transazione della notifica di spedizione
     function _shipOrder(int256 idOrder,address addr,uint timestamp)public fromOracle {
         require(!votesCounter[idOrder][votersIndex[address(msg.sender)]],"The oracle has already voted for this order!");
         
             votesCounter[idOrder][votersIndex[address(msg.sender)]]=true;
             if(votesCounter[idOrder][0]&&votesCounter[idOrder][1]&&votesCounter[idOrder][2])
             {
                 //Caso in cui tutte le componenti hanno votato e si può procedere con la sottomissione della notifica all
                 //DApp
                 shippingContract=isUsingShippingOracle(addr);
                 shippingContract._callbackShipping(idOrder,timestamp);
                 emit NewShipmentVotation(idOrder);
                 //per motivi di testing, una volta effettuata la sottomissione della notifica rispetto ad un'ordine,
                 //viene ripristinato lo stato iniziale.
                 votesCounter[idOrder][0]=false;votesCounter[idOrder][1]=false;votesCounter[idOrder][2]=false;
                 
             }
     }
     //evento che comununica il raggiungimento del consenso, e l'invio della notifica alla DApp
     event NewShipmentVotation(int256 idOrder);
           
}