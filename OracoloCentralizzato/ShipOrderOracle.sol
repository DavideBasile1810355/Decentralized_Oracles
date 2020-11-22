// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.8.0;
abstract contract isUsingShippingOracle{
    
    function _callbackShipping(int256,uint,uint) virtual public;
}
contract ShipOrderOracle
{
     isUsingShippingOracle shippingContract;
     function _shipOrder(int256 id,address addr,uint idLocation ,uint timestamp) public 
     {
        shippingContract=isUsingShippingOracle(addr);
        shippingContract._callbackShipping(id,idLocation,timestamp);
    }
}