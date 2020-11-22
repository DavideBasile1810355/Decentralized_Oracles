pragma solidity >=0.4.21 <0.8.0;

//Smart contract che implementa la componente on-chain dell'oracolo push based outbound
contract RegisterOracle{

//Funzione utilizzata dalle DApp per generare un'evento recuperato dalle componenti off-chain
function registerShipment(int256 id,uint location,uint timestamp) public 
     {
        emit NewShipment(id,location,timestamp);
        
    }
    //Evento che determina una nuova spedizione da registrare
    event NewShipment(int,uint,uint);
    
    
}