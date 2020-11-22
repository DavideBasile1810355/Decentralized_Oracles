pragma solidity >=0.4.21 <0.8.0;
//Contratto per la componente on-chain dell'oracolo pushbased outbound
contract RegisterOracle{    
//funzione per l'emissione dell'evento
function registerShipment(int256 id,uint location,uint timestamp) public 
     {
        emit NewShipment(id,location,timestamp);
        
    }
    //evento catturato dalla componente off-chain
    event NewShipment(int,uint,uint);
}