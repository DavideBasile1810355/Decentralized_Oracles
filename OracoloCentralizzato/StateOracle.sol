// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.8.0;

contract StateOracle
{
    function returnAnswer(int i,string memory value) public
    {
        emit Answer(i,value);
    }
    event Answer(int indexed i ,string value);
}