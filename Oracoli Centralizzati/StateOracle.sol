// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.8.0;
//Smart contract che implementa la componente on-chain dell'oracolo pull based outbound
contract StateOracle
{
    //Funzione per l'emissione dell'evento che registra il cambiamento di stato
    function updateState(int i,string memory value) public
    {
        emit Answer(i,value);
    }
    event Answer(int indexed i ,string value);
}