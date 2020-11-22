
pragma solidity >=0.4.21 <0.8.0;
//Interfaccia per il metodo di restituzione risposta dalla componente off-chain
abstract contract isUsingCreditOracle{
    
    function _callback(int256,bool) virtual public;
}
//smart contract che implementa la componenente on chain dell'oracolo pull based inbound
contract CreditWorthinessOracle
{
     isUsingCreditOracle  public callback;
    //funzione utilizzata dalle DApp per la sottomissione della risposta
    function newVerification(int256 id,string memory taxId,address caller) public
    {
      emit NewVerification(caller,id,taxId);
    }

    //funzione per la restituzione della risposta
     function _callback(int256 idOrder,bool state,address addr)public {

         callback=isUsingCreditOracle(addr);
         callback._callback(idOrder,state);
    }

    event NewVerification(address,int,string);
}