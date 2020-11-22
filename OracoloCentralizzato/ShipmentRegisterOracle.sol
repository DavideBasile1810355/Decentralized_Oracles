pragma solidity >=0.4.21 <0.8.0;


contract RegisterOracle{
    
function registerShipment(int256 id,uint location,uint timestamp) public 
     {
        emit NewShipment(id,location,timestamp);
        
    }

    event NewShipment(int,uint,uint);
    
    
}