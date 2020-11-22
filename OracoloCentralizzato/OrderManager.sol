pragma solidity >=0.4.21 <0.8.0;
import "./CreditWorthinessOracle.sol";
import "./ShipmentRegisterOracle.sol";
import "./StateOracle.sol";
import "./ShipOrderOracle.sol";
//Implementazione del contratto DApp di esempio, OrderManager.Implementa le due interfaccie isUsingCreditOracle
// isUsingShippingOracle
contract OrderManager is isUsingCreditOracle  , isUsingShippingOracle
{
    address owner=msg.sender;
    CreditWorthinessOracle private creditWorthinessOracle;
    StateOracle private stateOracle;
    RegisterOracle private oracleRegister;
    Order[] private orderList;
    int private orderId=-1;
     //modificatore che controlla che l'id dell'ordine sottomesso sia valido
    modifier validId(int256 i)
    {
        require(i<=int(orderId));
        _;
    }
    //modificatore che controlla se il mittente della transazioni è il creatore della dapp
    modifier isOwner(){
        require(msg.sender==owner);
        _;
    }
    //modificatore che controlla se la chiamata della _callback() è stata effettuata dall'oracolo impostato
    modifier isTheOracle(){
        require(msg.sender==address(creditWorthinessOracle));      
        _;
    }
    //set dell'indirizzo della componente on chain dell'oracolo CreditWorthiness.sol
    function setCreditOracle(address addr) public isOwner
    {
        creditWorthinessOracle=CreditWorthinessOracle(addr);
        
    }
    //set dell'indirizzo della componente on chain dell'oracolo StateOracle.sol
    function setStateOracle(address addr) public isOwner
    {
        stateOracle=StateOracle(addr);
    }
    //set dell'indirizzo della componente on chain dell'oracolo ShipmentRegisterOracle
        function setShipmentRegisterOracle(address addr) public isOwner
    {
        oracleRegister= RegisterOracle(addr);
        
    }
    
    //Metodo richiamato quando si verifica la creazione di un nuovo ordine.Da il via alla veririca del taxId
    function newOrder(uint idCostumer, string memory taxId,uint productId) public
    {
        orderId++;
        Order memory o = Order(idCostumer,taxId,3,productId);
        orderList.push(o);
        creditWorthinessOracle.newVerification(orderId,taxId,address(this));
        stateOracle.updateState(orderId,"ON_VALIDATION");
        
    }
    
    //callback utilizzata dall'oracolo, per restituire alla DApp i risultati della verifica del taxId
    function _callback(int256 idOrder,bool state) override public 
    {
        if(state){orderList[uint(idOrder)].state=0;stateOracle.updateState(idOrder,"NOT_SHIPPED");}
        else{
        orderList[uint(idOrder)].state=2;
        stateOracle.updateState(idOrder,"REFUSED");
        }

    }
    //callback utilizzata dall'oracolo, per restituire alla DApp i risultati della verifica del taxId
     function _callbackShipping(int idOrder,uint da,uint date) override public{
        orderList[uint(idOrder)].state=4;
        stateOracle.updateState(idOrder,"SHIPPED");
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
