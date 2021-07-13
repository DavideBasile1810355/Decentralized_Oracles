#Study and realization of oracle systems for the Ethereum blockchain

<p>In the repository can be found the implementations of software oracles prototype for the Ethereum platform. 
 The implementations are divided in centralized and decentralized.
In order to contextualize the carried out work, a use case has been defined within which the following realizations have been produced.
The DApp that interacts with the implemented oracles is an order management application. With each new order, the DApp in  needs to verify the buyer's Tax ID. Therefore, the application uses a pull-based inbound oracle, whose purpose is to perform checks in this area. Once the verification request has been obtained, the oracle in question communicates with a special external API, which checks the Tax ID and returns a response, which is forwarded by the oracle to the requesting application. Each order is associated with an ID, thanks to which the buyer can check its status. For example, if the TaxId check fails, the order assumes the status 'REFUSED'. The pull-based outbound oracle allows the buyer to get information about the status of a given order from the blockchain. Each time an order is shipped, the courier notifies the DApp of the shipment using an push-based inbound oracle. The oracle is responsible for retrieving the shipment data from the courier, and providing the recipient DApp with that notification. Once the application receives the shipment information (order id, timestamp, location id), it is assumed that the application needs to register the shipment with a database outside the blockchain.
This information is pushed outside the blockchain via the push-based outbound oracle, which takes care of having the external entity register the shipment.
</p>

<p>The folder "Oracoli Centralizzati" contains the centralized implmentations. The files of the folder are:<ul>
 
<li>CreditWorthinessOracle.sol: The implementation of the on-chain component of the pull based inbound centralized prototype.</li>
<li>CreditworthinessOracle.js: The implementation of the off-chain component of the pull based inbound centralized prototype.</li>  
<li>OrderManager.sol: The implementation of the Smart Contract that interacts with oracles.</li>
<li>ShipOrderOracle.js: The implementation of the off-chain component of the push based inbound centralized prototype.</li>
<li>ShipOrderOracle.sol: The implementation of the on-chain component of the push based inbound centralized prototype.</li>
<li>ShipmentRegisterOracle.js: The implementation of the off-chain component of the push based outbound centralized prototype.</li>
<li>ShipmentRegisterOracle.sol: The implementation of the on-chain component of the push based outbound centralized prototype.</li>
<li>StateOracle.js: The implementation of the off-chain component of the pull based outbound centralized prototype.</li>
<li>StateOracle.sol: The implementation of the off-chain component of the pull based outbound centralized prototype.</li>
<li>test.js: Code for the test of the creditworthiness oracle</li>
<li>truffle-config-js: config file for truffle</li>
<li>util.js: utilities functions in javascript</li>
 <li>node_modules/: Folder that contains dependencies for node.js</li>
 </ul>
</p>
<p>The folder "Oracoli Decentralizzati" contains the centralized implmentations. The files of the folder are: 
<li>CreditWorthinessOracle.sol: The implementation of the on-chain component of the pull based inbound decentralized prototype.</li>
<li>CreditworthinessOracle.js: The implementation of the off-chain component of the pull based inbound decentralized prototype.</li>  
<li>OrderManager.sol: The implementation of the Smart Contract that interacts with oracles.</li> 
<li>ShipOrderOracle.js: The implementation of the off-chain component of the push based inbound decentralized prototype.</li>
<li>ShipOrderOracle.sol: The implementation of the on-chain component of the push based inbound decentralized prototype.</li>
<li>ShipmentRegisterOracle.js: The implementation of the off-chain component of the push based outbound decentralized prototype.</li>
<li>ShipmentRegisterOracle.sol: The implementation of the on-chain component of the push based outbound decentralized prototype.</li>
<li>truffle-config.js: config file for truffle.</li>
<li>util.js: utilities functions in javascript</li>
<li>node_modules/: Folder that contains the dependencies for node.js</li>
<li>TestLatencyCredit.js: Code in node.js for the test of the creditworthiness decentralized oracle</li>
<li>watcher.js: Script used for the test of the creditworthiness decentralized oracle</li>
</p>
