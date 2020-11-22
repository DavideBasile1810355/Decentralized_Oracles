/// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.8.0;

contract StateOracle
{
    //Funzione utilizzata delle DApp per condividere informazioni circa un determinato ordine
    function returnAnswer(int i,string memory value) public
    {
        emit Answer(i,value);
    }
    //Evento che viene catturato delle componenti off-chain in ascolto
    event Answer(int indexed i ,string value);
}