# Smart-tickets

Membran Smart-Tickets provides a platform for the management and sales of tickets.

## Installing dependencies

      npm -i && npm install -g truffle ethereumjs-testrpc
      (optional) redux-dev-tools chrome extension

## Running tests

      jest -i

## Starting app

      testrpc
      (In a seperate window) truffle compile && truffle migrate && npm start
      (Optional) Have redux-dev-tools chrome extension installed to see reducer states/actions

### The dApp focuses on these main elements:

- Using the blockchain to achieve consensus on the validity of ticket transactions in a distributed manner
- Leveraging smart contracts to automate the creation of events, and manangement of the tickets associated to a particular event
- Provide high flexibility in the creation and operation of such events
- Low costs and fees compared to existing ticketing solutions on the market today
- High reliability and availability in terms of accessing and interacting with the event sales due to the distributed nature of blockchain + smart contracts
- Reduction of second-hand market profiting and ticket fraud

## Recent specification changes

  Instead of focusing on a completely decentralized ticketing application, the target ecosystem for this application will to offer a "step-up" from conventional methods of ticket management rather than completely re-vamping how it the industry works. Because of this, a server will now be used to host the smart contracts instead of individual clients launching their own Projects onto the network. By doing this, our system will be more compatible with conventional infrastructure while still offering benefits such as double-spend protection, digitalized ticketing (tickets are created, validated, modified and used all on-chain, allowing much more functionality to be built into them), and reduced operating fees.

  The main changes so far will be:

### Project validation

  Before, any client could create their own Project and claim themselves as the Promoter to the Project. This meant that an additional validation componenent was needed to eliminate Project spam / false projects as there was no requirements to creating one. Moving forward, only our server will host the Proj smart contract, and future Promoter's of Projects need to have their addresses white-listed by us (so there will be a KYC process or some sort beforehand) before those addresses are able to create their own Projects

### Log/Node caching

  Because a centralized server will handle the management of Projects and white-listing, it is also able to cache data such as relevant Event Logs from the blockchain and serve them to the client to boot-strap the initial state, significantly reducing the time needed to load the newest blockchain state.

### No ICO

  We're moving to a product that's selling point is back-end infrastructure improvements + increase customer satisfaction by reducing ticketing fraud and greater ease of use. Revenue will instead be generated through ticket sales rather than ICO tokens.

## Proj.sol future specification

  This is the main smart contract, responsible for the creation of "projects" which describe any type of event that needs ticket distribution and sales 

  The contract works as a state machine, where different functionality is either unlocked or restricted based on time and/or functions being called by an authorized entity (such as a promoter).

  There will be 4 stages that the contract can be in:

- Staging

  This phase is the beginning phase, set during the creation of the Project itself. When the Project is first created, these values are set permamently:

  - Project name: The name of the Project the promoter wants to sell
  - Membran's fee: A fee in percentage that Membran collects from the face value of tickets
  - Tickets left: This value is how many tickets are left that are sofar unassigned, all tickets need to be assigned before finishing the staging phase.
  - Total Tickets: The total number of tickets to be offered for the duration of the Project
  - Consumer Maximum Tickets: The maximum number of tickets an end-consumer address can purchase
  - Promoter's address: The promoter's address, used to verify and validate before calling restricted functions
  - Contract state (Always set to staging): The Project state, used to determine what functionality is available at what time in the contract

  During this phase, the promoter is able to edit the Project details, such as ticket assignment and distributor assignment. Along with this, addresses whitelisted as distributors are allowed to set their mark-up percetage on the face value of tickets they would want to sell later on to end-consumers

  Ticket assignment involves first creating an unique identifier for the ticket, which is referred as the type of the ticket. This identifier can be used to resemble real-world hierarchies in Projects such as different seating arrangements / tiered access to special events / etc. A price (calculated in Wei) and quantity (which is how many tickets to remove fro the unassigned pool) is also required. Anytime during the Staging phase the Promoter is allowed to change the price and quantity (as long as they're enough unassigned tickets left)details. In addition, an IPFS hash containing more ticket data that is not needed for the smart contract to function can be added to the ticket to store things such as pictures, event location, etc.

  Distributor assignment involves whitelisting addresses to differentiate them from the typical end-consumer. In addition to the typical functionality a buyer has, a distributor is allowed to buy higher amounts of tickets from the Promoter, and re-sell tickets to the end-consumer with their own markup. This process involves marking the addresses as a distributor, then assigning different allotted quantities of assigned ticket types to that distributor. What this does is allow the distributor to circumvent the consumer ticket limit up to the new allotted quantity limit (that is specific to the ticket type). Then, the distributor is able to set their own mark up on their assigned ticket types ontop of the face value that the Promoter set. The Promoter is also able to set their own fee on what the Distributor makes from their mark up values. An example is given below to explain how the pricing scheme works.

  ``` 
  Project: My cool music event
  Max Tickets: 100
  Tickets Left: 0 -> Because we allotted 100 qty to a ticket type of "Regular"
  Consumer Max Tickets: 3
  Membran's Fee: 10%
  Promoter: 0xMYPROMOADDR
  Current State: Staging Phase

  Assigned Tickets:
    Ticket Type: Regular
    Ticket Price: 100 Wei
    Ticket Quantity: 100

  Distributor: 0xDISTRIB01
  - Tickets:
    - Regular
      - Allotted Quantity: 25 -> This means that 0xDISTRIB01 is allowed to buy up to 25 tickets of type "Regular"
      - Markup: 10% -> 10% over the face value of 100 Wei

  - Promoter Fee: 20% -> 20% on the profits of the markup fees
  ```
  End-consumer/Distributor buying a "Regular" ticket from the Promoter directly:
  - 100 Wei per Ticket
  - 90 Wei goes to the Promoter, 10 Wei to Membran

  End-consumer buys a "Regular" ticket from the distributor, note that this requires that the distributor has bought the requested ticket from the Promoter already:
  - 100 Wei (face value) + 10 Wei (Markup) per Ticket
  - 8 Wei (10% of 100 Wei - 20% of that value) goes to the distributor, 2 Wei to the Promoter

- Private Funding
- Public Funding
- Done

