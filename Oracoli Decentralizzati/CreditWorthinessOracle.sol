pragma solidity >=0.4.21 <0.8.0;
abstract contract isUsingCreditOracle{
    
    function _callback(int256,bool) virtual public;
}
//Contratto della componente on-chain dell'oracolo Pull based inbound per la verifica del taxId
contract CreditWorthinessOracle
{
     isUsingCreditOracle  public callback;
     //contatore delle richieste provenienti dalle DApp
     int256 public requestCounter;
     //Array contentente le richieste
     OracleRequest[] requestList;
     //Mappa per l'indicizzazione delle componenti off-chain
     mapping(address=>uint256) votersIndex;
     //Modificatore che fornisce il controllo per le verifica della provenienza delle transazioni di risposta
     modifier fromOracle
     {
         require(address(msg.sender)==address(INDIRIZZO NODO OFF-CHAIN)||
                 address(msg.sender)==address(INDIRIZZO NODO 2 OFF-CHAIN)||
                 address(msg.sender)==address(INDIRIZZO NODO 3 OFF-CHAIN),"I don't know you");
         _;
     }
    
     constructor()public
     {
         requestCounter=0;
         votersIndex[address(INDIRIZZO NODO OFF-CHAIN)]=0;
         votersIndex[address(INDIRIZZO NODO 2 OFF-CHAIN)]=1;
         votersIndex[address(INDIRIZZO NODO 3 OFF-CHAIN)]=2;
     }
    //Metodo utilizzato per le DApp che effettuano la richiesta per ottenere la verifica
    function newVerification(int256 id,string memory taxId,address caller) public
    {
            bool[3] memory v;
            bool[3] memory a;
            OracleRequest memory req =OracleRequest(v,a,false,false);
            requestList.push(req);
            //Emissione dell evento catturato dalle componenti off-chain
            emit NewVerification(caller,id,taxId,requestCounter);
            requestCounter++;
    }
     //Metodo utilizzato per eseguire le transazioni di risposta contenente i risultati dalla verifica.
     //Utilizzato dalle componenti off-chain.
     function _callback(int256 idOrder,bool state,uint reqId,address addr)public fromOracle {
         OracleRequest storage currRequest = requestList[reqId];
         
         //if(currRequest.voted[votersIndex[msg.sender]])
         require(!currRequest.voted[votersIndex[msg.sender]],"The oracle has already voted!");
         if(!currRequest.done)
         {
             //faccio votare l'address e segno la risposta in answ
             //currRequest.voted[votersIndex[msg.sender]]=true;
             //currRequest.answ[votersIndex[msg.sender]]=true;
             currRequest.voted[votersIndex[msg.sender]]=true;
             currRequest.answ[votersIndex[msg.sender]]=state;
             uint nYes=0;
             uint nNo=0;
             //controllo per verificare se il consenso è stato ottenuto
             for (uint i = 0; i < 3; i++)
             {
                 if (currRequest.voted[i]&&currRequest.answ[i]){nYes++;}
                 else if(currRequest.voted[i]&& (!currRequest.answ[i])){nNo++;}
             }
             if (nYes>=2){currRequest.done=true;emit NewResponse(reqId);callback=isUsingCreditOracle(addr);callback._callback(idOrder,state);}
             
             if(nNo>=2) {currRequest.done=true;emit NewResponse(reqId);callback=isUsingCreditOracle(addr);callback._callback(idOrder,state);}
             
         }
         
        
    }
    //struct che modella le richieste da parte delle DApp 
    struct OracleRequest 
    {
        bool[3] voted;
        bool[3] answ;
        bool value;
        bool done;
    }
    //Evento per la nuova verifica
    event NewVerification(address,int,string,int);
    //Evento per la nuova risposta
    event NewResponse(uint);

    
}