pragma solidity >=0.4.21 <0.8.0;
import "./CreditWorthinessOracle.sol";
import "./ShipmentRegisterOracle.sol";
import "./StateOracle.sol";
import "./ShipOrderOracle.sol";

contract OrderManager is isUsingOracle  , isUsingShippingOracle
{
    address owner=msg.sender;
    CreditWorthinessOracle private creditWorthinessOracle;
    StateOracle private stateOracle;
    RegisterOracle private oracleRegister;
    Order[] private orderList;
    int public fatto=0;
    int private orderId=-1;
    int public inviati=0;
    modifier validId(int256 i)
    {
        require(i<=int(orderId));
        _;
    }
    modifier isOwner(){
        require(msg.sender==owner);
        _;
    }
    modifier isTheOracle(){
        require(msg.sender==address(creditWorthinessOracle));      
        _;
    }
    function setCreditOracle(address addr) public isOwner
    {
        creditWorthinessOracle=CreditWorthinessOracle(addr);
        
    }
    function setStateOracle(address addr) public isOwner
    {
        stateOracle=StateOracle(addr);
    }
        function setShipmentRegisterOracle(address addr) public isOwner
    {
        oracleRegister= RegisterOracle(addr);
    }
    
    //Creo la richiesta Inbound di verifica
    function newOrder(uint idCostumer, string memory taxId,uint productId) public
    {
        orderId++;
        Order memory o = Order(idCostumer,taxId,3,productId);
        orderList.push(o);
        creditWorthinessOracle.newVerification(orderId,taxId,address(this));
        stateOracle.returnAnswer(orderId,"ON_VALIDATION");
        
    }
    
    //callback per la creazione dell'ordine 
    function _callback(int256 idOrder,bool state) override public 
    {
        if(state){orderList[uint(idOrder)].state=0;stateOracle.returnAnswer(idOrder,"NOT_SHIPPED");}
        else{
        orderList[uint(idOrder)].state=2;
        stateOracle.returnAnswer(idOrder,"REFUSED");
        }
        fatto++;
    }

     function _callbackShipping(int idOrder,uint da,uint date) override public{
        orderList[uint(idOrder)].state=4;
        stateOracle.returnAnswer(idOrder,"SHIPPED");
        oracleRegister.registerShipment(idOrder,da,date);
    }
    
struct Order
{
    uint idCostumer;
    string taxId;
    uint state;
    uint idProduct;
}


}
