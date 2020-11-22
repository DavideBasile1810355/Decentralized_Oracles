// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.8.0;
abstract contract isUsingOracle{
    
    function _callback(int256,bool) virtual public;
}
contract CreditWorthinessOracle
{
     isUsingOracle  public callback;
    //Emetto l'evento per la componente off-chain
    function newVerification(int256 id,string memory taxId,address caller) public
    {
      emit NewVerification(caller,id,taxId);
    }
     function _callback(int256 idOrder,bool state,address addr)public {

        callback=isUsingOracle(addr);
        callback._callback(idOrder,state);
        //addr.call(abi.encodeWithSignature("_callback(int256,bool)",idOrder,state));
    }

    event NewVerification(address,int,string);
    
}