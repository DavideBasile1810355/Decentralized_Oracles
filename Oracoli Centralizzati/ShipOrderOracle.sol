// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.8.0;
//Classe astratta per la definizione del metodo di invio della risposta
abstract contract isUsingShippingOracle{
    
    function _callbackShipping(int256,uint,uint) virtual public;
}
//Smart contract che implementa la componente on-chain dell'oracolo push based inbound
contract ShipOrderOracle
{
     isUsingShippingOracle shippingContract;
     //Funzione di callback utilizzata per l'invio della notifica di spedizione alla DApp
     function _shipOrder(int256 id,address addr,uint idLocation ,uint timestamp) public 
     {
        shippingContract=isUsingShippingOracle(addr);
        shippingContract._callbackShipping(id,idLocation,timestamp);
    }
}